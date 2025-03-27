import { PaymentStatus, PaymentMethod } from '@prisma/client';
import { Prisma } from '@prisma/client';

export class Payment implements Prisma.PaymentUncheckedCreateInput {
  id?: string;
  contractId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  status?: PaymentStatus;
  createdAt?: Date | string;
}
