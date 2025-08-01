import { prisma } from "../config/prismaClient";
import { firebaseAuth } from "../config/firebase";
import { AuthProvider, UserStatus, UserRole } from "@prisma/client";
import crypto from "crypto";
import {
  CreateUserRequest,
  LoginResponse,
  UserWithRelations,
  OnboardingStatus,
  ActivityLog,
} from "../types/user.type";

export class AuthService {
  /**
   * Handle user login/registration flow
   */
  static async handleUserLogin(
    firebaseToken: string,
    clientInfo: { ipAddress?: string; userAgent?: string; deviceInfo?: string }
  ): Promise<LoginResponse> {
    try {
      // Verify Firebase token
      const decoded = await firebaseAuth.verifyIdToken(firebaseToken);

      // Determine auth provider
      const authProvider = this.getAuthProvider(
        decoded.firebase?.sign_in_provider
      );

      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { id: decoded.uid },
        include: {
          investorProfile: true,
          sessions: {
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      });

      let isNewUser = false;

      // Create user if doesn't exist
      if (!user) {
        const newUser = await this.createUser({
          uid: decoded.uid,
          email: decoded.email,
          emailVerified: decoded.email_verified || false,
          displayName: decoded.name,
          photoURL: decoded.picture,
          phoneNumber: decoded.phone_number,
          authProvider: authProvider.toString(),
        });

        // Refetch with sessions for consistency
        user = await prisma.user.findUnique({
          where: { id: newUser.id },
          include: {
            investorProfile: true,
            sessions: {
              where: { isActive: true },
              orderBy: { createdAt: "desc" },
              take: 5,
            },
          },
        });

        isNewUser = true;
      } else {
        // Update existing user with latest info from Firebase
        user = await this.updateUserFromFirebase(user.id, decoded);
      }

      if (!user) {
        throw new Error("Failed to create or retrieve user");
      }

      // Create session
      const sessionToken = await this.createUserSession(user.id, clientInfo);

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Log login activity
      await this.logActivity(user.id, "login", {
        authProvider,
        isNewUser,
        ...clientInfo,
      });

      // Check onboarding status
      const needsOnboarding = !user.isOnboardingComplete;

      return {
        user: user as UserWithRelations,
        sessionToken,
        isNewUser,
        needsOnboarding,
      };
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Authentication failed");
    }
  }

  /**
   * Create new user in database
   */
  static async createUser(userData: CreateUserRequest) {
    const authProviders = userData.authProvider
      ? [userData.authProvider as AuthProvider]
      : [AuthProvider.email_password];

    return await prisma.user.create({
      data: {
        id: userData.uid,
        email: userData.email,
        emailVerified: userData.emailVerified || false,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        phoneNumber: userData.phoneNumber,
        authProviders,
        status: userData.emailVerified
          ? UserStatus.active
          : UserStatus.pending_verification,
        role: UserRole.user,
      },
      include: {
        investorProfile: true,
      },
    });
  }

  /**
   * Update user with latest Firebase data
   */
  static async updateUserFromFirebase(userId: string, firebaseData: any) {
    const authProvider = this.getAuthProvider(
      firebaseData.firebase?.sign_in_provider
    );

    return await prisma.user.update({
      where: { id: userId },
      data: {
        email: firebaseData.email || undefined,
        emailVerified: firebaseData.email_verified || false,
        displayName: firebaseData.name || undefined,
        photoURL: firebaseData.picture || undefined,
        phoneNumber: firebaseData.phone_number || undefined,
        authProviders: {
          push: authProvider,
        },
        updatedAt: new Date(),
      },
      include: {
        investorProfile: true,
        sessions: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });
  }

  /**
   * Create user session
   */
  static async createUserSession(
    userId: string,
    clientInfo: { ipAddress?: string; userAgent?: string; deviceInfo?: string }
  ): Promise<string> {
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await prisma.userSession.create({
      data: {
        userId,
        sessionToken,
        deviceInfo: clientInfo.deviceInfo,
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        expiresAt,
      },
    });

    return sessionToken;
  }

  /**
   * Logout user and invalidate session
   */
  static async logout(
    userId: string,
    sessionToken?: string,
    logoutAllDevices = false
  ) {
    if (logoutAllDevices) {
      // Invalidate all sessions
      await prisma.userSession.updateMany({
        where: { userId },
        data: { isActive: false },
      });
    } else if (sessionToken) {
      // Invalidate specific session
      await prisma.userSession.updateMany({
        where: { userId, sessionToken },
        data: { isActive: false },
      });
    }

    // Log logout activity
    await this.logActivity(userId, "logout", {
      logoutAllDevices,
      sessionToken: sessionToken ? "provided" : "not_provided",
    });
  }

  /**
   * Get user onboarding status
   */
  static async getOnboardingStatus(userId: string): Promise<OnboardingStatus> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        investorProfile: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const emailVerified = user.emailVerified;
    const profileCompleted = !!(user.displayName && user.email);
    const investorProfileCreated = !!user.investorProfile;
    const kycCompleted = user.investorProfile?.panStatus === "verified";

    const isComplete =
      emailVerified &&
      profileCompleted &&
      investorProfileCreated &&
      kycCompleted;

    let nextStep: string | undefined;
    if (!emailVerified) nextStep = "verify_email";
    else if (!profileCompleted) nextStep = "complete_profile";
    else if (!investorProfileCreated) nextStep = "create_investor_profile";
    else if (!kycCompleted) nextStep = "complete_kyc";

    return {
      emailVerified,
      profileCompleted,
      investorProfileCreated,
      kycCompleted,
      isComplete,
      nextStep,
    };
  }

  /**
   * Complete onboarding
   */
  static async completeOnboarding(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isOnboardingComplete: true,
        status: UserStatus.active,
      },
    });

    await this.logActivity(userId, "onboarding_completed");
  }

  /**
   * Delete user account
   */
  static async deleteUser(userId: string) {
    // Delete from Firebase
    await firebaseAuth.deleteUser(userId);

    // Delete from database (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    console.log(`User ${userId} deleted successfully`);
  }

  /**
   * Get user activities
   */
  static async getUserActivities(userId: string, limit = 50) {
    return await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions() {
    const result = await prisma.userSession.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { isActive: false }],
      },
    });

    console.log(`Cleaned up ${result.count} expired sessions`);
    return result.count;
  }

  /**
   * Log user activity
   */
  static async logActivity(userId: string, action: string, details?: any) {
    try {
      await prisma.userActivity.create({
        data: {
          userId,
          action,
          details: details || {},
          ipAddress: details?.ipAddress,
          userAgent: details?.userAgent,
        },
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  }

  /**
   * Helper to determine auth provider from Firebase
   */
  private static getAuthProvider(signInProvider?: string): AuthProvider {
    switch (signInProvider) {
      case "google.com":
        return AuthProvider.google;
      case "facebook.com":
        return AuthProvider.facebook;
      case "apple.com":
        return AuthProvider.apple;
      case "phone":
        return AuthProvider.phone;
      default:
        return AuthProvider.email_password;
    }
  }

  /**
   * Validate user input
   */
  static validateUserInput(data: any) {
    const errors: Record<string, string> = {};

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Invalid email format";
    }

    if (data.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(data.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number format";
    }

    if (
      data.displayName &&
      (data.displayName.length < 2 || data.displayName.length > 50)
    ) {
      errors.displayName = "Display name must be between 2 and 50 characters";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
