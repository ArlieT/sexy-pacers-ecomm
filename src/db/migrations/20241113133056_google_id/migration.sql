/*
  Warnings:

  - You are about to drop the column `orderId` on the `OrderDetail` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userId` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bio` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localation` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Kids');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('Promos', 'Offers', 'Latest', 'Articles', 'Events');

-- DropForeignKey
ALTER TABLE "OrderDetail" DROP CONSTRAINT "OrderDetail_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingSession" DROP CONSTRAINT "ShoppingSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAddress" DROP CONSTRAINT "UserAddress_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPayment" DROP CONSTRAINT "UserPayment_userId_fkey";

-- AlterTable
ALTER TABLE "OrderDetail" DROP COLUMN "orderId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShoppingSession" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "localation" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "UserAddress" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UserPayment" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "gender" "Gender"[],
    "sports" TEXT[],
    "brands" TEXT[],
    "sizes" TEXT[],
    "notifications" "NotificationType"[],
    "location" BOOLEAN NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPayment" ADD CONSTRAINT "UserPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingSession" ADD CONSTRAINT "ShoppingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
