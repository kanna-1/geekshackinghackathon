import { Worker, Queue, JobsOptions } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@/lib/db";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", { maxRetriesPerRequest: null });

export const queueName = "milestones";
export const milestoneQueue = new Queue(queueName, { connection });

export type ProcessMilestoneJob = { milestoneId: string };

async function processMilestone(job: { data: ProcessMilestoneJob }) {
  const { milestoneId } = job.data;
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { goal: { include: { recipient: true } } },
  });
  if (!milestone) throw new Error("Milestone not found");
  if (milestone.status !== "VERIFIED") {
    return { skipped: true };
  }
  await prisma.milestone.update({ where: { id: milestoneId }, data: { status: "PAID" } });
  return { ok: true };
}

new Worker<ProcessMilestoneJob>(queueName, processMilestone as any, { connection });

export async function enqueueProcessMilestone(milestoneId: string, opts?: JobsOptions) {
  await milestoneQueue.add("processMilestone", { milestoneId }, opts);
} 