import { z } from "zod";

// User validation schemas
export const userValidationSchema = {
  // Registration/Login
  login: z.object({
    firebaseToken: z.string().min(1, "Firebase token is required"),
    deviceInfo: z.string().optional(),
  }),

  // Profile update
  updateProfile: z.object({
    displayName: z
      .string()
      .min(2, "Display name must be at least 2 characters")
      .max(50, "Display name must be less than 50 characters")
      .optional(),
    email: z.string().email("Invalid email format").optional(),
    phoneNumber: z
      .string()
      .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
      .optional(),
    photoURL: z.string().url("Invalid photo URL").optional(),
  }),

  // Onboarding steps
  onboarding: z.object({
    step: z.enum(["profile", "investor_profile", "kyc"]),
    data: z.record(z.any()),
  }),

  // Investor profile
  investorProfile: z.object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters"),
    pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  }),

  // Session management
  logout: z.object({
    logoutAllDevices: z.boolean().default(false),
  }),

  // Account deletion
  deleteAccount: z.object({
    confirmDeletion: z.boolean().refine((val) => val === true, {
      message: "Account deletion must be confirmed",
    }),
  }),
};

// Validation middleware factory
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      // Replace req.body with validated data
      req.body = result.data;
      next();
    } catch (error) {
      console.error("Validation middleware error:", error);
      res.status(500).json({
        error: "Validation error",
        code: "VALIDATION_MIDDLEWARE_ERROR",
        message: "Internal validation error",
      });
    }
  };
};

// Helper functions for common validations
export const ValidationHelpers = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  },

  isValidPAN: (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  },

  sanitizeString: (str: string): string => {
    return str.trim().replace(/\s+/g, " ");
  },

  isStrongPassword: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  },

  validateAge: (birthDate: Date): { isValid: boolean; age: number } => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return { isValid: age - 1 >= 18, age: age - 1 };
    }

    return { isValid: age >= 18, age };
  },
};

// Rate limiting validation
export const rateLimitValidation = {
  // For login attempts
  loginAttempts: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
  },

  // For password reset
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3,
  },

  // For profile updates
  profileUpdate: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 10,
  },
};

// Error messages
export const ValidationErrors = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  INVALID_PAN: "Please enter a valid PAN number (format: ABCDE1234F)",
  PASSWORD_TOO_WEAK:
    "Password must be at least 8 characters with uppercase, lowercase, number and special character",
  UNDERAGE: "You must be at least 18 years old",
  INVALID_DATE: "Please enter a valid date",
  STRING_TOO_SHORT: (min: number) => `Must be at least ${min} characters`,
  STRING_TOO_LONG: (max: number) => `Must be less than ${max} characters`,
  INVALID_URL: "Please enter a valid URL",
  INVALID_FORMAT: "Invalid format",
};
