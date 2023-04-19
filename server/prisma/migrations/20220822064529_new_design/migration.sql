-- CreateEnum
CREATE TYPE "COMPOUND_REQUIREMENT_USE_TYPE" AS ENUM ('ANY', 'ALL');

-- AlterTable
ALTER TABLE "Phase" ADD COLUMN     "collectionsUseType" "COMPOUND_REQUIREMENT_USE_TYPE" NOT NULL DEFAULT E'ANY',
ADD COLUMN     "discordServersUseType" "COMPOUND_REQUIREMENT_USE_TYPE" NOT NULL DEFAULT E'ANY',
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tweetsUseType" "COMPOUND_REQUIREMENT_USE_TYPE" NOT NULL DEFAULT E'ANY',
ADD COLUMN     "twitterAccountsUseType" "COMPOUND_REQUIREMENT_USE_TYPE" NOT NULL DEFAULT E'ANY';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "phasesPublished" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "collectionAddress" TEXT NOT NULL,
    "collectionLink" TEXT NOT NULL,
    "collectionName" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "phaseId" INTEGER NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwitterAccount" (
    "id" SERIAL NOT NULL,
    "account" TEXT NOT NULL,
    "phaseId" INTEGER NOT NULL,

    CONSTRAINT "TwitterAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tweet" (
    "id" SERIAL NOT NULL,
    "like" BOOLEAN NOT NULL,
    "retweet" BOOLEAN NOT NULL,
    "tagAmount" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "phaseId" INTEGER NOT NULL,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordServer" (
    "id" SERIAL NOT NULL,
    "discordServerId" TEXT NOT NULL,
    "discordServerName" TEXT NOT NULL,
    "discordServerLink" TEXT NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "discordRolesUseType" "COMPOUND_REQUIREMENT_USE_TYPE" NOT NULL DEFAULT E'ANY',

    CONSTRAINT "DiscordServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordRole" (
    "id" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "discordServerInnerId" INTEGER NOT NULL,

    CONSTRAINT "DiscordRole_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TwitterAccount" ADD CONSTRAINT "TwitterAccount_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordServer" ADD CONSTRAINT "DiscordServer_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordRole" ADD CONSTRAINT "DiscordRole_discordServerInnerId_fkey" FOREIGN KEY ("discordServerInnerId") REFERENCES "DiscordServer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
