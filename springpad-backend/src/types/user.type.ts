import {
  User,
  InvestorProfile,
  UserSession,
  UserActivity,
} from "@prisma/client";

// Enhanced Auth Request Interface
export interface AuthRequest extends Request {
  uid?: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  picture?: string;
  phoneNumber?: string;
  authProvider?: string;
  decoded?: any;
}

// User creation and update types
export interface CreateUserRequest {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  authProvider?: string;
}

export interface UpdateUserRequest {
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  email?: string;
}

// User response types
export interface UserResponse {
  user: User & {
    investorProfile?: InvestorProfile | null;
  };
}

export interface UserWithRelations extends User {
  investorProfile?: InvestorProfile | null;
  sessions?: UserSession[];
  activities?: UserActivity[];
}

// Authentication types
export interface LoginRequest {
  firebaseToken: string;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginResponse {
  user: UserWithRelations;
  sessionToken?: string;
  isNewUser: boolean;
  needsOnboarding: boolean;
}

export interface LogoutRequest {
  sessionToken?: string;
  logoutAllDevices?: boolean;
}

// Validation schemas
export interface UserValidation {
  email?: {
    isValid: boolean;
    message?: string;
  };
  phoneNumber?: {
    isValid: boolean;
    message?: string;
  };
  displayName?: {
    isValid: boolean;
    message?: string;
  };
}

// Error types
export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

// Activity types
export interface ActivityLog {
  action: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// Onboarding types
export interface OnboardingStatus {
  emailVerified: boolean;
  profileCompleted: boolean;
  investorProfileCreated: boolean;
  kycCompleted: boolean;
  isComplete: boolean;
  nextStep?: string;
}

export interface OnboardingRequest {
  step: "profile" | "investor_profile" | "kyc";
  data: Record<string, any>;
}
