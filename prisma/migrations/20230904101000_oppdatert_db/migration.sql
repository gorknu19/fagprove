/*
  Warnings:

  - You are about to drop the column `datePurschased` on the `Post` table. All the data in the column will be lost.
  - Added the required column `extraEquipment` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "datePurschased",
ADD COLUMN     "datePurchased" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "extraEquipment" TEXT NOT NULL;
