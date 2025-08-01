import admin from "firebase-admin";

// Firebase Admin SDK configuration
const initializeFirebase = () => {
  if (admin.apps.length > 0) {
    return admin;
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Missing Firebase configuration. Please check your environment variables."
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });

    console.log("✅ Firebase Admin SDK initialized successfully");
    return admin;
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error);
    throw error;
  }
};

// Initialize Firebase
const firebaseAdmin = initializeFirebase();

// Firebase Auth helper functions
export const firebaseAuth = {
  // Verify ID token
  verifyIdToken: async (idToken: string) => {
    try {
      return await firebaseAdmin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error("Token verification failed:", error);
      throw new Error("Invalid or expired token");
    }
  },

  // Get user by UID
  getUserByUID: async (uid: string) => {
    try {
      return await firebaseAdmin.auth().getUser(uid);
    } catch (error) {
      console.error("Failed to get user:", error);
      throw new Error("User not found");
    }
  },

  // Update user
  updateUser: async (uid: string, properties: admin.auth.UpdateRequest) => {
    try {
      return await firebaseAdmin.auth().updateUser(uid, properties);
    } catch (error) {
      console.error("Failed to update user:", error);
      throw new Error("Failed to update user");
    }
  },

  // Delete user
  deleteUser: async (uid: string) => {
    try {
      await firebaseAdmin.auth().deleteUser(uid);
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw new Error("Failed to delete user");
    }
  },

  // Create custom token
  createCustomToken: async (uid: string, additionalClaims?: object) => {
    try {
      return await firebaseAdmin
        .auth()
        .createCustomToken(uid, additionalClaims);
    } catch (error) {
      console.error("Failed to create custom token:", error);
      throw new Error("Failed to create custom token");
    }
  },

  // Set custom user claims
  setCustomUserClaims: async (uid: string, customClaims: object) => {
    try {
      await firebaseAdmin.auth().setCustomUserClaims(uid, customClaims);
    } catch (error) {
      console.error("Failed to set custom claims:", error);
      throw new Error("Failed to set custom claims");
    }
  },

  // Revoke refresh tokens
  revokeRefreshTokens: async (uid: string) => {
    try {
      await firebaseAdmin.auth().revokeRefreshTokens(uid);
    } catch (error) {
      console.error("Failed to revoke refresh tokens:", error);
      throw new Error("Failed to revoke refresh tokens");
    }
  },
};

export default firebaseAdmin;
