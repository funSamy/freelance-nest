import { JobStatus, Prisma } from '@prisma/client';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, Min, IsMongoId } from 'class-validator';

export class CreateJobDto implements Prisma.JobUncheckedCreateInput {
  @IsNotEmpty({ message: 'Job ID is required' })
  title: string;

  @IsNotEmpty({ message: 'Job description is required' })
  description: string;

  @IsInt({ message: 'Budget must be an integer' })
  @Min(100, { message: 'Budget must be at least 100 XAF' })
  budget: number;

  @IsOptional()
  @IsEnum(JobStatus, { message: 'Status must be one of the following: ' + Object.values(JobStatus).join(', ') })
  @IsString({ message: 'Status must be a string' })
  status?: JobStatus;

  @IsOptional()
  @IsInt({ message: 'Number of slots must be an integer' })
  @Min(1, { message: 'Number of slots must be at least 1' })
  numberOfSlots?: number;

  @IsOptional()
  @IsInt({ message: 'Accepted slots must be an integer' })
  @Min(0, { message: 'Accepted slots must be at least 0' })
  acceptedSlots?: number;

  @IsNotEmpty({ message: 'Client ID is required' })
  @IsMongoId({ message: 'Client ID must be a valid client Id' })
  clientId: string;
}
