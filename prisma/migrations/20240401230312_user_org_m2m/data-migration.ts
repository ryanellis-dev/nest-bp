import { OrgRole, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const userOrgMap = await tx.user.findMany({
      where: {
        orgId: {
          not: null,
        },
      },
      select: {
        id: true,
        orgId: true,
      },
    });
    for (const { id: userId, orgId } of userOrgMap) {
      if (orgId) {
        tx.organisationsUsers.upsert({
          where: {
            orgId_userId: {
              userId,
              orgId,
            },
          },
          update: {},
          create: { userId, orgId, role: OrgRole.ADMIN },
        });
      }
    }
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit();
  });
