-- DropForeignKey
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_variantId_fkey";

-- AlterTable
ALTER TABLE "SaleItem" ALTER COLUMN "variantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
