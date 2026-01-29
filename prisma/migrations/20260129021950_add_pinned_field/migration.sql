-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PortfolioItem" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;
