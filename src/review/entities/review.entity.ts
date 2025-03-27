import { Prisma } from '@prisma/client';

export class Review implements Prisma.ReviewUncheckedCreateInput {
  id?: string;
  contractId: string;
  reviewerId: string;
  rating: number;
  comment?: string;
  createdAt?: Date | string;
}
