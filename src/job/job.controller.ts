import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobStatus } from '@prisma/client';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

  @Get()
  findAll(@Query('status') status?: string, @Query('clientId') clientId?: string) {
    return this.jobService.findAll({ status, clientId });
  }

  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string) {
    return this.jobService.findByClient(clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(id, updateJobDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.jobService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    if (!status) {
      throw new BadRequestException('Status is required');
    }

    if (!['open', 'in_progress', 'completed'].includes(status)) {
      throw new BadRequestException('Status must be one of: open, in_progress, completed');
    }

    return this.jobService.updateJobStatus(id, status as JobStatus);
  }

  @Patch(':id/accept-proposal')
  incrementAcceptedSlots(@Param('id') id: string) {
    return this.jobService.incrementAcceptedSlots(id);
  }
}
