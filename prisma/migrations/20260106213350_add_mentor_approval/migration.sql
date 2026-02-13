-- CreateEnum
CREATE TYPE "MentorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mentorStatus" "MentorStatus";
