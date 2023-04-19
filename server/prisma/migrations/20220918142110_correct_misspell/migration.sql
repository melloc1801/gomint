-- DropForeignKey
ALTER TABLE "CollectorFavoritePhase" DROP CONSTRAINT "CollectorFavoritePhase_phaseId_fkey";

-- AddForeignKey
ALTER TABLE "CollectorFavoritePhase" ADD CONSTRAINT "CollectorFavoritePhase_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
