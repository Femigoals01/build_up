/*
  Warnings:

  - Added the required column `userId` to the `Badge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
