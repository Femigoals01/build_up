
import "dotenv/config";

import { prisma } from "../lib/prisma";

async function main() {
  console.log("Checking for users without wallets...");

  const users = await prisma.user.findMany({
    where: {
      wallet: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  console.log(`Found ${users.length} users without wallets.`);

  for (const user of users) {
    await prisma.wallet.create({
      data: {
        userId: user.id,
        available: 0,
        pending: 0,
        withdrawn: 0,
        totalEarned: 0,
      },
    });

    console.log(`✅ Wallet created for ${user.name} (${user.email})`);
  }

  console.log("🎉 Wallet backfill completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });