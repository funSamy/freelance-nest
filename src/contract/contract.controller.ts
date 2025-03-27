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
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ContractStatus } from '@prisma/client';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string, @Query('status') status?: string) {
    return this.contractService.findAll({ userId, status });
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.contractService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractService.update(id, updateContractDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.contractService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    if (!status) {
      throw new BadRequestException('Status is required');
    }

    if (!['active', 'completed', 'disputed'].includes(status)) {
      throw new BadRequestException('Status must be one of: active, completed, disputed');
    }

    return this.contractService.updateContractStatus(id, status as ContractStatus);
  }
}
