/*
  Warnings:

  - You are about to drop the column `price` on the `SaleItem` table. All the data in the column will be lost.
  - Added the required column `total` to the `SaleItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleItem" DROP COLUMN "price",
ADD COLUMN     "total" DECIMAL(10,2) NOT NULL;
