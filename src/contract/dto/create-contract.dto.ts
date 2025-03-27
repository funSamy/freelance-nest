import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { Prisma, ContractStatus } from '@prisma/client';

export class CreateContractDto implements Prisma.ContractUncheckedCreateInput {
  @IsMongoId({ message: 'Invalid proposal ID' })
  @IsNotEmpty({ message: 'Proposal ID is required' })
  proposalId: string;

  @IsNumber({}, { message: 'Escrow amount must be a number' })
  @IsNotEmpty({ message: 'Escrow amount is required' })
  escrowAmount: number;

  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @IsEnum(ContractStatus, { message: 'Contract status must be one of: ' + Object.values(ContractStatus).join(', ') })
  status?: ContractStatus;

  @IsOptional()
  @IsMongoId({ message: 'Invalid user ID' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;
}
