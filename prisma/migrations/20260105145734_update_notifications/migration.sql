/*
  Warnings:

  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPLICATION', 'PROJECT', 'REVIEW', 'BADGE', 'SYSTEM');

-- AlterTable
-- ALTER TABLE "Notification" ADD COLUMN     "link" TEXT,
-- ADD COLUMN     "type" "NotificationType" NOT NULL;


ALTER TABLE "Notification"
ADD COLUMN "link" TEXT,
ADD COLUMN "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM';
