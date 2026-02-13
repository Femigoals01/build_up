/*
  Warnings:

  - You are about to drop the column `mentorId` on the `ProjectChat` table. All the data in the column will be lost.
  - You are about to drop the column `mentorshipRequestId` on the `ProjectChat` table. All the data in the column will be lost.
  - You are about to drop the column `requestId` on the `ProjectChat` table. All the data in the column will be lost.
  - You are about to drop the column `volunteerId` on the `ProjectChat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `ProjectChat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProjectChat" DROP CONSTRAINT "ProjectChat_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectChat" DROP CONSTRAINT "ProjectChat_mentorshipRequestId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectChat" DROP CONSTRAINT "ProjectChat_volunteerId_fkey";

-- AlterTable
ALTER TABLE "ProjectChat" DROP COLUMN "mentorId",
DROP COLUMN "mentorshipRequestId",
DROP COLUMN "requestId",
DROP COLUMN "volunteerId";

-- CreateIndex
CREATE UNIQUE INDEX "ProjectChat_projectId_key" ON "ProjectChat"("projectId");
