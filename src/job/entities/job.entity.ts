import { JobStatus, Prisma } from '@prisma/client';

export class Job implements Prisma.JobUncheckedCreateInput {
  id?: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  status?: JobStatus;
  numberOfSlots: number;
  acceptedSlots?: number;
  clientId: string;
  createdAt?: Date | string;
}
