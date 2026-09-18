-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'AF', 'XH', 'ZU');

-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('IN_APP', 'WHATSAPP', 'SMS');

-- CreateEnum
CREATE TYPE "VerificationTier" AS ENUM ('REGISTERED', 'IDENTITY', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "OfferingCategory" AS ENUM ('TOUR', 'FOOD', 'TRANSPORT', 'ACCOMMODATION', 'CONCIERGE', 'SECURITY');

-- CreateEnum
CREATE TYPE "OfferingStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'LIVE', 'PAUSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('REQUESTED', 'CONFIRMED', 'DECLINED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayoutChannel" AS ENUM ('BANK', 'CASH_SEND', 'WALLET', 'CASH_PICKUP');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'SENT');

-- CreateEnum
CREATE TYPE "VouchSource" AS ENUM ('SURVEY', 'NOMINATION');

-- CreateEnum
CREATE TYPE "SustainabilityTag" AS ENUM ('LOW_IMPACT_TRAVEL', 'SUPPORTS_LOCAL_LIVELIHOODS');

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT,
    "phone" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "contactChannel" "ContactChannel" NOT NULL DEFAULT 'WHATSAPP',
    "serviceArea" TEXT NOT NULL,
    "story" TEXT,
    "photoUrl" TEXT,
    "tier" "VerificationTier" NOT NULL DEFAULT 'REGISTERED',
    "idNumberHash" TEXT,
    "idDocumentPath" TEXT,
    "payoutChannel" "PayoutChannel",
    "payoutPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offering" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "category" "OfferingCategory" NOT NULL,
    "status" "OfferingStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceLanguage" "Language" NOT NULL,
    "translations" JSONB,
    "priceCents" INTEGER NOT NULL,
    "durationMin" INTEGER,
    "groupMin" INTEGER NOT NULL DEFAULT 1,
    "groupMax" INTEGER,
    "inclusions" TEXT[],
    "meetingPoint" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "photos" TEXT[],
    "availability" JSONB NOT NULL,
    "voiceNotePath" TEXT,
    "transcript" TEXT,
    "vouchCount" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DOUBLE PRECISION,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "sustainabilityTag" "SustainabilityTag",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vouch" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "voucherArea" TEXT NOT NULL,
    "source" "VouchSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vouch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "travellerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Traveller" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Traveller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "organiserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "shareCode" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripMember" (
    "tripId" TEXT NOT NULL,
    "travellerId" TEXT NOT NULL,

    CONSTRAINT "TripMember_pkey" PRIMARY KEY ("tripId","travellerId")
);

-- CreateTable
CREATE TABLE "TripBlock" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "startTime" TEXT,
    "position" INTEGER NOT NULL,
    "addedById" TEXT NOT NULL,

    CONSTRAINT "TripBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "blockId" TEXT NOT NULL,
    "travellerId" TEXT NOT NULL,
    "up" BOOLEAN NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("blockId","travellerId")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "travellerId" TEXT NOT NULL,
    "blockId" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'REQUESTED',
    "date" TIMESTAMP(3) NOT NULL,
    "groupSize" INTEGER NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "feeCents" INTEGER NOT NULL,
    "hostReceivesCents" INTEGER NOT NULL,
    "paymentRef" TEXT,
    "respondBy" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "channel" "PayoutChannel" NOT NULL,
    "destination" TEXT NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationSession" (
    "waId" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationSession_pkey" PRIMARY KEY ("waId")
);

-- CreateTable
CREATE TABLE "ProcessedWebhookMessage" (
    "id" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedWebhookMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Host_authUserId_key" ON "Host"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Host_phone_key" ON "Host"("phone");

-- CreateIndex
CREATE INDEX "Offering_status_region_idx" ON "Offering"("status", "region");

-- CreateIndex
CREATE INDEX "Offering_hostId_idx" ON "Offering"("hostId");

-- CreateIndex
CREATE INDEX "Vouch_offeringId_idx" ON "Vouch"("offeringId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- CreateIndex
CREATE INDEX "Review_offeringId_idx" ON "Review"("offeringId");

-- CreateIndex
CREATE UNIQUE INDEX "Traveller_authUserId_key" ON "Traveller"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Traveller_email_key" ON "Traveller"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trip_shareCode_key" ON "Trip"("shareCode");

-- CreateIndex
CREATE INDEX "TripBlock_tripId_day_idx" ON "TripBlock"("tripId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_blockId_key" ON "Booking"("blockId");

-- CreateIndex
CREATE UNIQUE INDEX "Payout_bookingId_key" ON "Payout"("bookingId");

-- AddForeignKey
ALTER TABLE "Offering" ADD CONSTRAINT "Offering_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vouch" ADD CONSTRAINT "Vouch_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "Offering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "Offering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "Traveller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripMember" ADD CONSTRAINT "TripMember_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripMember" ADD CONSTRAINT "TripMember_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "Traveller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripBlock" ADD CONSTRAINT "TripBlock_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripBlock" ADD CONSTRAINT "TripBlock_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "Offering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "TripBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "Traveller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "Offering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "Traveller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "TripBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
