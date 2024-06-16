/*
  Warnings:

  - You are about to drop the column `expries_at` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `expriesAt` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "expries_at",
ADD COLUMN     "expriesAt" TIMESTAMP(3) NOT NULL;
