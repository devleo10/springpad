import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, sendEmailVerification, onAuthStateChanged, User } from "firebase/auth";
import { app } from "../lib/firebase";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");
  const [checkingVerification, setCheckingVerification] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // If no user, redirect to home
        router.push("/");
        return;
      }

      setUser(currentUser);

      // Check if email is already verified
      if (currentUser.emailVerified) {
        router.push("/dashboard");
        return;
      }

      // If user signed up with Google or other provider, redirect to dashboard
      const hasPasswordProvider = currentUser.providerData.some(p => p.providerId === 'password');
      if (!hasPasswordProvider) {
        router.push("/dashboard");
        return;
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Periodically check if email is verified
  useEffect(() => {
    if (!user) return;

    const checkVerification = async () => {
      try {
        setCheckingVerification(true);
        await user.reload();
        const auth = getAuth(app);
        const refreshedUser = auth.currentUser;
        
        if (refreshedUser?.emailVerified) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking verification:", error);
      } finally {
        setCheckingVerification(false);
      }
    };

    // Check every 3 seconds
    const interval = setInterval(checkVerification, 3000);
    
    return () => clearInterval(interval);
  }, [user, router]);

  const handleResendEmail = async () => {
    if (!user) return;
    
    setIsResending(true);
    setResendSuccess("");
    setResendError("");
    
    try {
      await sendEmailVerification(user);
      setResendSuccess("Verification email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      setResendError("Failed to send email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleManualCheck = async () => {
    if (!user) return;
    
    setCheckingVerification(true);
    try {
      await user.reload();
      const auth = getAuth(app);
      const refreshedUser = auth.currentUser;
      
      if (refreshedUser?.emailVerified) {
        router.push("/dashboard");
      } else {
        setResendError("Email not verified yet. Please check your inbox and click the verification link.");
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      setResendError("Error checking verification status. Please try again.");
    } finally {
      setCheckingVerification(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5282]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <svg
                className="h-8 w-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2C5282] mb-2">
              Check your email
            </h2>
            <p className="text-gray-600 text-sm">
              We&apos;ve sent a verification link to
            </p>
            <p className="text-[#2C5282] font-semibold">
              {user.email}
            </p>
          </div>

          {/* Verification Status */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {checkingVerification ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2C5282]"></div>
                  <span className="text-sm text-gray-600">Checking verification status...</span>
                </>
              ) : (
                <>
                  <div className="animate-pulse flex space-x-1">
                    <div className="rounded-full bg-[#2C5282] h-2 w-2"></div>
                    <div className="rounded-full bg-[#2C5282] h-2 w-2 animation-delay-75"></div>
                    <div className="rounded-full bg-[#2C5282] h-2 w-2 animation-delay-150"></div>
                  </div>
                  <span className="text-sm text-gray-600">Waiting for verification...</span>
                </>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Click the link in your email to verify your account. This page will automatically redirect you once verified.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleManualCheck}
              disabled={checkingVerification}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2C5282] hover:bg-[#2A4F7D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C5282] disabled:opacity-50 transition-all"
            >
              {checkingVerification ? "Checking..." : "I&apos;ve verified my email"}
            </button>

            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C5282] disabled:opacity-50 transition-all"
            >
              {isResending ? "Sending..." : "Resend verification email"}
            </button>
          </div>

          {/* Success/Error Messages */}
          {resendSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">{resendSuccess}</p>
            </div>
          )}

          {resendError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{resendError}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Didn&apos;t receive an email? Check your spam folder or{" "}
              <button 
                onClick={handleResendEmail}
                className="text-[#2C5282] hover:text-[#2A4F7D] underline"
                disabled={isResending}
              >
                try again
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
