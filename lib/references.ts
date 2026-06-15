import { prisma } from "@/lib/prisma";

function padNumber(value: number) {
  return String(value).padStart(6, "0");
}

export function generateProjectReference(sequence: number) {
  const year = new Date().getFullYear();

  return `BUP-PROJ-${year}-${padNumber(sequence)}`;
}

export function generateSupportTicketReference(sequence: number) {
  const year = new Date().getFullYear();

  return `BUP-SUP-${year}-${padNumber(sequence)}`;
}

export async function createUniqueSupportTicketNo() {
  const supportCount = await prisma.supportMessage.count();

  let ticketNo = generateSupportTicketReference(supportCount + 1);

  let existingTicket = await prisma.supportMessage.findUnique({
    where: { ticketNo },
    select: { id: true },
  });

  let retryCount = 1;

  while (existingTicket) {
    ticketNo = generateSupportTicketReference(supportCount + 1 + retryCount);

    existingTicket = await prisma.supportMessage.findUnique({
      where: { ticketNo },
      select: { id: true },
    });

    retryCount++;
  }

  return ticketNo;
}