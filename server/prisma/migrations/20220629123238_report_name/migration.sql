/*
  Warnings:

  - You are about to drop the `ProjectReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectReport" DROP CONSTRAINT "ProjectReport_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectReport" DROP CONSTRAINT "ProjectReport_userId_fkey";

-- DropTable
DROP TABLE "ProjectReport";

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "message" TEXT,
    "projectId" INTEGER,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
