/*
  Warnings:

  - Changed the type of `paymentMethod` on the `Sale` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'TRANSFER');

-- AlterEnum
ALTER TYPE "SaleStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL;
