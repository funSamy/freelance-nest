import { IsMongoId, IsNotEmpty, IsNumber, IsString, IsOptional, IsIn } from 'class-validator';

enum ProposalStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export class CreateProposalDto {
  @IsMongoId({ message: 'Invalid freelancer ID' })
  @IsNotEmpty({ message: 'Freelancer ID is required' })
  freelancerId: string;

  @IsMongoId({ message: 'Invalid job ID' })
  @IsNotEmpty({ message: 'Job ID is required' })
  jobId: string;

  @IsString({ message: 'Cover letter is required' })
  @IsNotEmpty({ message: 'Cover letter is required' })
  coverLetter: string;

  @IsNumber({}, { message: 'Bid amount must be a number' })
  @IsNotEmpty({ message: 'Bid amount is required' })
  bidAmount: number;

  @IsOptional()
  @IsIn(Object.values(ProposalStatus), { message: 'Invalid proposal status. Use "pending", "accepted", or "rejected"' })
  status?: string;
}
