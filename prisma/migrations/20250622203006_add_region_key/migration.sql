/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Region_key_key" ON "Region"("key");
