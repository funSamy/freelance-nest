import { ContractStatus, Prisma } from '@prisma/client';

export class Contract implements Prisma.ContractCreateInput {
  proposal: Prisma.ProposalCreateNestedOneWithoutContractInput;
  payments?: Prisma.PaymentCreateNestedManyWithoutContractInput;
  reviews?: Prisma.ReviewCreateNestedManyWithoutContractInput;
  User?: Prisma.UserCreateNestedOneWithoutContractsInput;
  id?: string;
  proposalId: string;
  escrowAmount: number;
  status: ContractStatus;
  createdAt?: Date | string;
  userId?: string;
}
