import express from "express";
import {
  verifyFirebaseToken,
  ensureUserExists,
  requireRole,
  verifySession,
} from "../middlewares/auth.middleware";
import {
  login,
  logout,
  getProfile,
  updateProfile,
  deleteUser,
  handleOnboarding,
  getOnboardingStatus,
  getUserActivities,
  refreshSession,
} from "../controllers/user.controller";

const router = express.Router();

// Public routes (no authentication required)
router.post("/login", login);

// Protected routes (require Firebase token)
router.use(verifyFirebaseToken);

// Basic user operations
router.get("/me", getProfile);
router.patch("/me", updateProfile);
router.delete("/me", deleteUser);

// Authentication operations
router.post("/logout", logout);
router.post("/refresh-session", refreshSession);

// Onboarding
router.get("/onboarding", getOnboardingStatus);
router.post("/onboarding", handleOnboarding);

// User activities (requires user to exist in DB)
router.get("/activities", ensureUserExists, getUserActivities);

// Admin routes (require admin role)
router.get(
  "/admin/users",
  ensureUserExists,
  requireRole(["admin"]),
  async (req, res) => {
    // TODO: Implement admin user management
    res.status(501).json({ error: "Not implemented" });
  }
);

export default router;
