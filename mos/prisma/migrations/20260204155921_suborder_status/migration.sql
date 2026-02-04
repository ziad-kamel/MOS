/*
  Warnings:

  - The `status` column on the `SubOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SubOrder" ADD COLUMN     "rejectionReason" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "SubOrderStatus";
