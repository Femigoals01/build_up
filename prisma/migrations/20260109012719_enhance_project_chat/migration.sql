/*
  Warnings:

  - Added the required column `mentorId` to the `ProjectChat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volunteerId` to the `ProjectChat` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProjectChat_projectId_key";

-- AlterTable
ALTER TABLE "ProjectChat" ADD COLUMN     "mentorId" TEXT NOT NULL,
ADD COLUMN     "mentorshipRequestId" TEXT,
ADD COLUMN     "requestId" TEXT,
ADD COLUMN     "volunteerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectChat" ADD CONSTRAINT "ProjectChat_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChat" ADD CONSTRAINT "ProjectChat_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChat" ADD CONSTRAINT "ProjectChat_mentorshipRequestId_fkey" FOREIGN KEY ("mentorshipRequestId") REFERENCES "MentorshipRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
