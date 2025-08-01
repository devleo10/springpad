import { Response } from "express";
import { prisma } from "../config/prismaClient";
import { AuthRequest, getClientInfo } from "../middlewares/auth.middleware";
import { AuthService } from "../services/auth.service";
import { firebaseAuth } from "../config/firebase";
import {
  LoginRequest,
  UpdateUserRequest,
  OnboardingRequest,
} from "../types/user.type";

/**
 * Handle user login/registration
 * POST /api/v1/user/login
 */
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { firebaseToken } = req.body as LoginRequest;

    if (!firebaseToken) {
      return res.status(400).json({
        error: "Firebase token required",
        code: "MISSING_TOKEN",
        message: "Firebase ID token is required for authentication",
      });
    }

    const clientInfo = getClientInfo(req);
    const result = await AuthService.handleUserLogin(firebaseToken, clientInfo);

    res.status(200).json({
      success: true,
      data: result,
      message: result.isNewUser
        ? "User registered successfully"
        : "Login successful",
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(401).json({
      error: "Authentication failed",
      code: "LOGIN_FAILED",
      message: error.message || "Invalid credentials",
    });
  }
};

/**
 * Get current user profile
 * GET /api/v1/user/me
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.uid) {
      return res.status(401).json({
        error: "User ID required",
        code: "MISSING_UID",
      });
    }

    // Get or create user (upsert pattern for Firebase sync)
    const user = await prisma.user.upsert({
      where: { id: req.uid },
      create: {
        id: req.uid,
        email: req.email,
        emailVerified: req.emailVerified ?? false,
        displayName: req.name,
        photoURL: req.picture,
        phoneNumber: req.phoneNumber,
        authProviders: req.authProvider
          ? [req.authProvider]
          : ["email_password"],
      },
      update: {
        email: req.email ?? undefined,
        emailVerified: req.emailVerified ?? undefined,
        displayName: req.name ?? undefined,
        photoURL: req.picture ?? undefined,
        phoneNumber: req.phoneNumber ?? undefined,
        lastLoginAt: new Date(),
      },
      include: {
        investorProfile: true,
        sessions: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    });

    // Get onboarding status
    const onboardingStatus = await AuthService.getOnboardingStatus(user.id);

    res.status(200).json({
      success: true,
      data: {
        user,
        onboardingStatus,
      },
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Failed to get user profile",
      code: "PROFILE_FETCH_ERROR",
      message: error.message,
    });
  }
};

/**
 * Update user profile
 * PATCH /api/v1/user/me
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.uid) {
      return res.status(401).json({
        error: "User ID required",
        code: "MISSING_UID",
      });
    }

    const updateData = req.body as UpdateUserRequest;

    // Validate input
    const validation = AuthService.validateUserInput(updateData);
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: validation.errors,
      });
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: req.uid },
      data: {
        displayName: updateData.displayName ?? undefined,
        photoURL: updateData.photoURL ?? undefined,
        email: updateData.email ?? undefined,
        phoneNumber: updateData.phoneNumber ?? undefined,
        updatedAt: new Date(),
      },
      include: {
        investorProfile: true,
      },
    });

    // Update Firebase user if email changed
    if (updateData.email && updateData.email !== updatedUser.email) {
      try {
        await firebaseAuth.updateUser(req.uid, {
          email: updateData.email,
          displayName: updateData.displayName,
        });
      } catch (firebaseError) {
        console.error("Firebase update failed:", firebaseError);
        // Continue with database update even if Firebase fails
      }
    }

    // Log activity
    await AuthService.logActivity(req.uid, "profile_update", {
      changes: updateData,
      ...getClientInfo(req),
    });

    res.status(200).json({
      success: true,
      data: { user: updatedUser },
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({
      error: "Failed to update profile",
      code: "PROFILE_UPDATE_ERROR",
      message: error.message,
    });
  }
};

/**
 * Handle user onboarding steps
 * POST /api/v1/user/onboarding
 */
export const handleOnboarding = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.uid) {
      return res.status(401).json({
        error: "User ID required",
        code: "MISSING_UID",
      });
    }

    const { step, data } = req.body as OnboardingRequest;

    switch (step) {
      case "profile":
        // Update basic profile information
        await prisma.user.update({
          where: { id: req.uid },
          data: {
            displayName: data.displayName,
            phoneNumber: data.phoneNumber,
          },
        });
        break;

      case "investor_profile":
        // Create investor profile
        await prisma.investorProfile.upsert({
          where: { userId: req.uid },
          create: {
            userId: req.uid,
            fullName: data.fullName,
            pan: data.pan,
            phone: data.phone,
          },
          update: {
            fullName: data.fullName,
            pan: data.pan,
            phone: data.phone,
          },
        });
        break;

      case "kyc":
        // Update KYC information
        await prisma.investorProfile.update({
          where: { userId: req.uid },
          data: {
            panStatus: "pending",
            kycSubmittedAt: new Date(),
          },
        });
        break;

      default:
        return res.status(400).json({
          error: "Invalid onboarding step",
          code: "INVALID_STEP",
        });
    }

    // Check if onboarding is complete
    const onboardingStatus = await AuthService.getOnboardingStatus(req.uid);

    if (onboardingStatus.isComplete) {
      await AuthService.completeOnboarding(req.uid);
    }

    // Log activity
    await AuthService.logActivity(req.uid, `onboarding_${step}`, {
      data,
      ...getClientInfo(req),
    });

    res.status(200).json({
      success: true,
      data: { onboardingStatus },
      message: `${step} step completed successfully`,
    });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    res.status(500).json({
      error: "Onboarding failed",
      code: "ONBOARDING_ERROR",
      message: error.message,
    });
  }
};

/**
 * Get user onboarding status
 * GET /api/v1/user/onboarding
 */
export const getOnboardingStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.uid) {
      return res.status(401).json({
        error: "User ID required",
        code: "MISSING_UID",
      });
    }

    const onboardingStatus = await AuthService.getOnboardingStatus(req.uid);

    res.status(200).json({
      success: true,
      data: { onboardingStatus },
    });
  } catch (error: any) {
    console.error("Get onboarding status error:", error);
    res.status(500).json({
      error: "Failed to get onboarding status",
      code: "ONBOARDING_STATUS_ERROR",
      message: error.message,
    });
  }
};

/**
 * User logout
 * POST /api/v1/user/logout
 */
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.uid) {
      return res.status(401).json({
        error: "User ID required",
        code: "MISSING_UID",
      });
    }

    const { logoutAllDevices = false } = req.body;
    const sessionToken = req.sessionToken;

    await AuthService.logout(req.uid, sessionToken, logoutAllDevices);

    res.status(200).json({
      success: true,
      message: logoutAllDevices
        ? "Logged out from all devices"
        : "Logged out successfully",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "Logout failed",
      code: "LOGOUT_ERROR",
      message: error.message,
    });
  }
};

/**
 * Get user activities
 * GET /api/v1/user/activities
 */
export const getUserActivities = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.uid) {
      return res.status(401).json({
        error: "User ID required",
        code: "MISSING_UID",
      });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const activities = await AuthService.getUserActivities(req.uid, limit);

    res.status(200).json({
      success: true,
      data: { activities },
    });
  } catch (error: any) {
    console.error("Get activities error:", error);
    res.status(500).json({
      error: "Failed to get user activities",
      code: "ACTIVITIES_ERROR",
      message: error.message,
    });
  }
};

/**
 * Delete user account
 * DELETE /api/v1/user/me
 */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.uid) {
      return res.status(401).json({
        error: "User ID required",
        code: "MISSING_UID",
      });
    }

    // Confirm deletion with password or re-authentication
    const { confirmDeletion } = req.body;

    if (!confirmDeletion) {
      return res.status(400).json({
        error: "Deletion confirmation required",
        code: "CONFIRMATION_REQUIRED",
        message: "Please confirm account deletion",
      });
    }

    // Log deletion activity before deleting
    await AuthService.logActivity(
      req.uid,
      "account_deletion",
      getClientInfo(req)
    );

    // Delete user (this will cascade to related records)
    await AuthService.deleteUser(req.uid);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    res.status(500).json({
      error: "Failed to delete account",
      code: "DELETION_ERROR",
      message: error.message,
    });
  }
};

/**
 * Refresh user session
 * POST /api/v1/user/refresh-session
 */
export const refreshSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.uid) {
      return res.status(401).json({
        error: "User ID required",
        code: "MISSING_UID",
      });
    }

    const clientInfo = getClientInfo(req);
    const newSessionToken = await AuthService.createUserSession(
      req.uid,
      clientInfo
    );

    // Invalidate old session if provided
    if (req.sessionToken) {
      await prisma.userSession.updateMany({
        where: {
          userId: req.uid,
          sessionToken: req.sessionToken,
        },
        data: { isActive: false },
      });
    }

    res.status(200).json({
      success: true,
      data: { sessionToken: newSessionToken },
      message: "Session refreshed successfully",
    });
  } catch (error: any) {
    console.error("Refresh session error:", error);
    res.status(500).json({
      error: "Failed to refresh session",
      code: "SESSION_REFRESH_ERROR",
      message: error.message,
    });
  }
};
