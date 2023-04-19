-- CreateTable
CREATE TABLE "CollectorFavoritePhase" (
    "userId" INTEGER NOT NULL,
    "phaseId" INTEGER NOT NULL,

    CONSTRAINT "CollectorFavoritePhase_pkey" PRIMARY KEY ("userId","phaseId")
);

-- AddForeignKey
ALTER TABLE "CollectorFavoritePhase" ADD CONSTRAINT "CollectorFavoritePhase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectorFavoritePhase" ADD CONSTRAINT "CollectorFavoritePhase_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
