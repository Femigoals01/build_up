import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// 👇 EXPLICITLY pass DATABASE_URL (bypasses Accelerate)
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  const email = "admin@email.com"; // CHANGE THIS
  const newPassword = "Admin123!";

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashed },
  });

  console.log("✅ Admin password reset successful");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
