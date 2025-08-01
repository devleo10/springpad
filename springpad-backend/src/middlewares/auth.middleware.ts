import { Request, Response, NextFunction } from "express";
import { firebaseAuth } from "../config/firebase";
import { prisma } from "../config/prismaClient";
import { AuthProvider } from "@prisma/client";

export interface AuthRequest extends Request {
  uid?: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  picture?: string;
  phoneNumber?: string;
  authProvider?: AuthProvider;
  decoded?: any;
  sessionToken?: string;
}

// Main Firebase token verification middleware
export const verifyFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required",
        code: "MISSING_TOKEN",
        message: "Authorization header with Bearer token is required",
      });
    }

    const token = auth.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Invalid token format",
        code: "INVALID_TOKEN_FORMAT",
        message: "Bearer token is required",
      });
    }

    // Verify the Firebase ID token
    const decoded = await firebaseAuth.verifyIdToken(token);

    // Extract user information from the token
    req.uid = decoded.uid;
    req.email = decoded.email;
    req.emailVerified = decoded.email_verified || false;
    req.name = decoded.name;
    req.picture = decoded.picture;
    req.phoneNumber = decoded.phone_number;
    req.decoded = decoded;

    // Determine auth provider from token
    if (decoded.firebase?.sign_in_provider) {
      switch (decoded.firebase.sign_in_provider) {
        case "google.com":
          req.authProvider = AuthProvider.google;
          break;
        case "facebook.com":
          req.authProvider = AuthProvider.facebook;
          break;
        case "apple.com":
          req.authProvider = AuthProvider.apple;
          break;
        case "phone":
          req.authProvider = AuthProvider.phone;
          break;
        default:
          req.authProvider = AuthProvider.email_password;
      }
    }

    // Log user activity
    await logUserActivity(req.uid!, "token_verification", {
      provider: req.authProvider,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    next();
  } catch (error: any) {
    console.error("Firebase token verification failed:", error);

    // Handle specific Firebase auth errors
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        error: "Token expired",
        code: "TOKEN_EXPIRED",
        message: "Please refresh your authentication token",
      });
    }

    if (error.code === "auth/id-token-revoked") {
      return res.status(401).json({
        error: "Token revoked",
        code: "TOKEN_REVOKED",
        message: "Authentication token has been revoked",
      });
    }

    return res.status(401).json({
      error: "Invalid token",
      code: "INVALID_TOKEN",
      message: "Authentication token is invalid or malformed",
    });
  }
};

// Optional middleware for session-based authentication
export const verifySession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.headers["x-session-token"] as string;

    if (!sessionToken) {
      return res.status(401).json({
        error: "Session required",
        code: "MISSING_SESSION",
        message: "Session token is required",
      });
    }

    // Find active session
    const session = await prisma.userSession.findFirst({
      where: {
        sessionToken,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return res.status(401).json({
        error: "Invalid session",
        code: "INVALID_SESSION",
        message: "Session is invalid or expired",
      });
    }

    // Attach user info to request
    req.uid = session.user.id;
    req.email = session.user.email;
    req.sessionToken = sessionToken;

    // Update session last activity
    await prisma.userSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    });

    next();
  } catch (error) {
    console.error("Session verification failed:", error);
    return res.status(500).json({
      error: "Session verification failed",
      code: "SESSION_ERROR",
      message: "Internal error during session verification",
    });
  }
};

// Middleware to check if user exists in database
export const ensureUserExists = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.uid) {
      return res.status(401).json({
        error: "User ID required",
        code: "MISSING_UID",
        message: "User ID is required to proceed",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.uid },
      include: {
        investorProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        code: "USER_NOT_FOUND",
        message: "User account not found in database",
      });
    }

    // Check if user is active
    if (user.status !== "active") {
      return res.status(403).json({
        error: "Account not active",
        code: "ACCOUNT_INACTIVE",
        message: `Account status: ${user.status}`,
      });
    }

    next();
  } catch (error) {
    console.error("User existence check failed:", error);
    return res.status(500).json({
      error: "User verification failed",
      code: "USER_CHECK_ERROR",
      message: "Internal error during user verification",
    });
  }
};

// Middleware to check user roles
export const requireRole = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.uid) {
        return res.status(401).json({
          error: "Authentication required",
          code: "MISSING_AUTH",
          message: "User authentication is required",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.uid },
        select: { role: true },
      });

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          error: "Insufficient permissions",
          code: "INSUFFICIENT_PERMISSIONS",
          message: "You do not have permission to access this resource",
        });
      }

      next();
    } catch (error) {
      console.error("Role check failed:", error);
      return res.status(500).json({
        error: "Permission check failed",
        code: "ROLE_CHECK_ERROR",
        message: "Internal error during permission verification",
      });
    }
  };
};

// Helper function to log user activities
const logUserActivity = async (
  userId: string,
  action: string,
  details?: any
) => {
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
    console.error("Failed to log user activity:", error);
    // Don't throw error as this is not critical
  }
};

// Utility function to extract client info
export const getClientInfo = (req: Request) => {
  return {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get("User-Agent") || "Unknown",
    deviceInfo: req.get("X-Device-Info") || "Unknown",
  };
};
