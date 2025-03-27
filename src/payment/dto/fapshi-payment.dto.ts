import {
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsBoolean,
  Min,
  IsEnum,
  IsNotEmpty,
  Length,
  Matches,
  IsISO8601,
} from 'class-validator';

// Payment link generation DTO
export class GeneratePaymentLinkDto {
  @IsNumber()
  @Min(100, { message: 'Amount must be greater than or equal to 100 XAF' })
  amount: number;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString()
  redirectUrl?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'User ID must be between 1 and 100 characters' })
  @Matches(/^[a-zA-Z0-9\-_]+$/, {
    message: 'User ID can only contain alphanumeric characters, hyphens, and underscores',
  })
  userId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'External ID must be between 1 and 100 characters' })
  @Matches(/^[a-zA-Z0-9\-_]+$/, {
    message: 'External ID can only contain alphanumeric characters, hyphens, and underscores',
  })
  externalId?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsBoolean()
  cardOnly?: boolean;
}

// Response from payment link generation
export class PaymentLinkResponseDto {
  @IsString()
  link: string;

  @IsString()
  transId: string;
}

// Enum for payment status
export enum FapshiPaymentStatus {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

// Payment status response DTO
export class PaymentStatusResponseDto {
  @IsString()
  transId: string;

  @IsEnum(FapshiPaymentStatus)
  status: FapshiPaymentStatus;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  medium?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}

// Expire payment DTO
export class ExpirePaymentDto {
  @IsString()
  @IsNotEmpty({ message: 'Transaction ID is required' })
  transId: string;
}

// Direct payment DTO
export enum PaymentMedium {
  MOBILE_MONEY = 'mobile money',
  ORANGE_MONEY = 'orange money',
}

export class DirectPaymentDto {
  @IsNumber()
  @Min(100, { message: 'Amount must be greater than or equal to 100 XAF' })
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^6[9875]{1}[0-9]{7}$/, { message: 'Invalid phone number format. Must be in the format 69xxxxxxx' })
  phone: string;

  @IsOptional()
  @IsEnum(PaymentMedium, { message: 'Payment medium must be one of ' + Object.values(PaymentMedium).join(', ') })
  medium?: PaymentMedium;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'User ID must be between 1 and 100 characters' })
  @Matches(/^[a-zA-Z0-9\-_]+$/, {
    message: 'User ID can only contain alphanumeric characters, hyphens, and underscores',
  })
  userId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'External ID must be between 1 and 100 characters' })
  @Matches(/^[a-zA-Z0-9\-_]+$/, {
    message: 'External ID can only contain alphanumeric characters, hyphens, and underscores',
  })
  externalId?: string;

  @IsOptional()
  @IsString()
  message?: string;
}

// Direct payment response DTO
export class DirectPaymentResponseDto {
  @IsString()
  transId: string;
}

// Search transactions query parameters DTO
export class SearchTransactionsDto {
  @IsOptional()
  @IsEnum(FapshiPaymentStatus, {
    message: 'Payment status must be one of ' + Object.values(FapshiPaymentStatus).join(', '),
  })
  status?: FapshiPaymentStatus;

  @IsOptional()
  @IsEnum(PaymentMedium, { message: 'Payment medium must be one of ' + Object.values(PaymentMedium).join(', ') })
  medium?: PaymentMedium;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsISO8601({ strict: true }, { message: 'Start date must be in ISO 8601 format yyyy-mm-dd' })
  start?: string; // Format: yyyy-mm-dd

  @IsOptional()
  @IsString()
  @IsISO8601({ strict: true }, { message: 'End date must be in ISO 8601 format yyyy-mm-dd' })
  end?: string; // Format: yyyy-mm-dd

  @IsOptional()
  @IsNumber()
  amt?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'Sort must be one of ' + Object.values(['asc', 'desc']).join(', ') })
  sort?: 'asc' | 'desc';
}

// Balance response DTO
export class BalanceResponseDto {
  @IsNumber()
  balance: number;
}
