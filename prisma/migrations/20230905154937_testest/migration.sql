/*
  Warnings:

  - You are about to drop the column `whitelisted` on the `User` table. All the data in the column will be lost.
  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `VerificationToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "whitelisted",
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_pkey",
DROP COLUMN "id";
