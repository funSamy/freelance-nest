import { OmitType, PartialType } from '@nestjs/mapped-types';
import { PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { IsMongoId, IsNumber, IsString, IsNotEmpty, IsPositive, Min, IsEnum } from 'class-validator';

export class CreatePaymentDto implements Prisma.PaymentUncheckedCreateInput {
  @IsMongoId({ message: 'Invalid contract ID' })
  contractId: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be positive' })
  @Min(100, { message: 'Amount must be greater than or equal to 100 XAF' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @IsString({ message: 'Payment method is required' })
  @IsNotEmpty({ message: 'Payment method is required' })
  @IsEnum(PaymentMethod, { message: 'Payment method must be one of: ' + Object.values(PaymentMethod).join(', ') })
  paymentMethod: PaymentMethod;

  @IsString({ message: 'Transaction ID is required' })
  @IsNotEmpty({ message: 'Transaction ID is required' })
  transactionId: string;

  @IsString({ message: 'Status is required' })
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(PaymentStatus, { message: 'Status must be one of: ' + Object.values(PaymentStatus).join(', ') })
  status: PaymentStatus;
}

export class UpdatePaymentDto extends PartialType(OmitType(CreatePaymentDto, ['contractId'] as const)) {}
