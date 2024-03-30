import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const orgs = [
  { id: '32c94969-bd41-454e-b871-8e4cd91e0828', name: 'alpha' },
  { id: 'f71884ce-0939-4645-bd4e-22caccc908e8', name: 'beta' },
  { id: '69eb7b39-00b7-4783-ac11-481c71e6b587', name: 'gamma' },
];

const users = ['alice', 'bob'];

const generateUsersForOrg = (
  orgName: string,
): { name: string; email: string }[] =>
  users.map((u) => ({ name: u, email: `${u}@${orgName}.org` }));

async function main() {
  for (const orgsUpsert of orgs.map(async (org) => {
    await prisma.organisation.upsert({
      where: {
        id: org.id,
      },
      update: {},
      create: {
        ...org,
      },
    });

    const users = generateUsersForOrg(org.name);

    for (const usersUpsert of users.map(async (user) => {
      await prisma.user.upsert({
        where: {
          email: user.email,
        },
        update: {},
        create: {
          ...user,
          organisation: {
            connectOrCreate: {
              where: {
                id: org.id,
              },
              create: {
                ...org,
              },
            },
          },
        },
      });
    })) {
      await usersUpsert;
    }
  })) {
    await orgsUpsert;
  }
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
