// scripts/reset-password.ts
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const email = "ibk@gmail.com";
  const newPassword = "NewPassword123";

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log("Password reset successfully");
}

main();