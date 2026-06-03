

import { prisma } from "@/lib/prisma";

function generateCertificateNo() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);

  return `BUP-${year}-${random}`;
}

export async function issueOrUpdateVolunteerCertificate(volunteerId: string) {
  const completedProjects = await prisma.application.findMany({
    where: {
      volunteerId,
      status: "COMPLETED",
      project: {
        status: "COMPLETED",
      },
    },
    include: {
      project: {
        select: {
          skills: true,
        },
      },
    },
  });

  if (completedProjects.length === 0) {
    return null;
  }

  const skills = Array.from(
    new Set(
      completedProjects.flatMap((application) => application.project.skills)
    )
  );

  const existingCertificate = await prisma.certificate.findFirst({
    where: { volunteerId },
    orderBy: { issuedAt: "desc" },
  });

  if (existingCertificate) {
    return prisma.certificate.update({
      where: { id: existingCertificate.id },
      data: {
        completedProjectsCount: completedProjects.length,
        skillsSummary: skills.join(", "),
      },
    });
  }

  let certificateNo = generateCertificateNo();

  while (
    await prisma.certificate.findUnique({
      where: { certificateNo },
    })
  ) {
    certificateNo = generateCertificateNo();
  }

  return prisma.certificate.create({
    data: {
      volunteerId,
      certificateNo,
      completedProjectsCount: completedProjects.length,
      skillsSummary: skills.join(", "),
    },
  });
}