/*
  Warnings:

  - You are about to drop the `OptionValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OptionValue" DROP CONSTRAINT "OptionValue_productOptionId_fkey";

-- AlterTable
ALTER TABLE "ProductOption" ADD COLUMN     "values" TEXT[];

-- DropTable
DROP TABLE "OptionValue";
