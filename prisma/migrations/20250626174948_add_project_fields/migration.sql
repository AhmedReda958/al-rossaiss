/*
  Warnings:

  - You are about to drop the column `regionId` on the `Project` table. All the data in the column will be lost.
  - Added the required column `cityId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_regionId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "regionId",
ADD COLUMN     "cityId" INTEGER NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "labelDirection" TEXT,
ADD COLUMN     "points" DOUBLE PRECISION[];

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
