-- CreateEnum
CREATE TYPE "public"."KycStatus" AS ENUM ('not_started', 'pending', 'verified', 'rejected');

-- CreateEnum
CREATE TYPE "public"."AuthProvider" AS ENUM ('google', 'facebook', 'apple', 'email_password', 'phone');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('user', 'admin', 'moderator');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- CreateEnum
CREATE TYPE "public"."HoldingType" AS ENUM ('mutual_fund', 'stock', 'gold_bond');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('buy', 'sell', 'dividend', 'interest', 'redemption');

-- CreateEnum
CREATE TYPE "public"."MarketDataType" AS ENUM ('mutual_fund_nav', 'stock_price', 'gold_price');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('login', 'portfolio_update', 'import', 'trade', 'manual_edit', 'link_broker');

-- CreateTable
CREATE TABLE "public"."users" (
    "uid" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "displayName" TEXT,
    "photoURL" TEXT,
    "phoneNumber" TEXT,
    "authProviders" "public"."AuthProvider"[] DEFAULT ARRAY['email_password']::"public"."AuthProvider"[],
    "role" "public"."UserRole" NOT NULL DEFAULT 'user',
    "status" "public"."UserStatus" NOT NULL DEFAULT 'pending_verification',
    "lastLoginAt" TIMESTAMP(3),
    "isOnboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvestorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "pan" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "panStatus" "public"."KycStatus" NOT NULL DEFAULT 'not_started',
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "kycSubmittedAt" TIMESTAMP(3),
    "kycVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "investorOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "phoneOtpCodeHash" TEXT,
    "phoneOtpSentAt" TIMESTAMP(3),
    "phoneOtpAttempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InvestorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sessionToken_key" ON "public"."user_sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "InvestorProfile_userId_key" ON "public"."InvestorProfile"("userId");

-- AddForeignKey
ALTER TABLE "public"."user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_activities" ADD CONSTRAINT "user_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvestorProfile" ADD CONSTRAINT "InvestorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
