import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const participants = await prisma.participant.findMany({
    include: { user: true },
  });
  await Promise.all(
    participants.map(async (participant) => {
      await prisma.participant.update({
        where: {
          phaseId_userId: {
            phaseId: participant.phaseId,
            userId: participant.userId,
          },
        },
        data: {
          registrationAddress: participant.user.address,
        },
      });
    })
  );

  console.log("REGISTRATION ADDRESSES SET");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
