import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const milestone = await prisma.milestone.update({ where: { id }, data: { status: "VERIFIED", verifiedAt: new Date() } });
  await prisma.auditLog.create({ data: { action: "MILESTONE_VERIFIED", entityType: "Milestone", entityId: id, metadataJson: JSON.stringify({}) } });
  return NextResponse.json({ milestone });
} 