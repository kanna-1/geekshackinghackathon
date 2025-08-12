import { NextResponse } from "next/server";
import { enqueueProcessMilestone } from "@/worker/index";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  await enqueueProcessMilestone(id);
  return NextResponse.json({ enqueued: true, id });
} 