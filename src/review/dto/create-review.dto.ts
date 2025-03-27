import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString({ message: 'Contract ID is required' })
  contractId: string;

  @IsString({ message: 'Reviewer ID is required' })
  reviewerId: string;

  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  rating: number;

  @IsOptional()
  @IsString({ message: 'Comment must be a string' })
  comment?: string;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsString({ message: 'Comment must be a string' })
  comment?: string;
}
