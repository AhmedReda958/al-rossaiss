-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "soldOut" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "unitType" TEXT NOT NULL DEFAULT 'apartment';
