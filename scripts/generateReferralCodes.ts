


import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function makeCode(username: string) {
  return (
    username.toUpperCase() +
    Math.floor(100 + Math.random() * 900)
  );
}

async function main() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    if (!user.referralCode) {
      let code = makeCode(user.username);

      while (
        await prisma.user.findFirst({
          where: { referralCode: code },
        })
      ) {
        code = makeCode(user.username);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          referralCode: code,
        },
      });

      console.log(`Updated ${user.email} => ${code}`);
    }
  }

  console.log("All users updated.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });