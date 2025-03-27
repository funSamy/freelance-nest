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
  ParseEnumPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from '@prisma/client';
import {
  DirectPaymentDto,
  ExpirePaymentDto,
  GeneratePaymentLinkDto,
  SearchTransactionsDto,
} from './dto/fapshi-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll(@Query('contractId') contractId?: string, @Query('status') status?: string) {
    return this.paymentService.findAll({ contractId, status });
  }

  @Get('contract/:contractId')
  findByContract(@Param('contractId') contractId: string) {
    return this.paymentService.findByContract(contractId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status', new ParseEnumPipe(Object.values(PaymentStatus))) status: PaymentStatus,
  ) {
    return this.paymentService.updatePaymentStatus(id, status);
  }

  // Fapshi API integration endpoints

  @Post('fapshi/payment-link')
  @HttpCode(HttpStatus.CREATED)
  generatePaymentLink(@Body() generatePaymentLinkDto: GeneratePaymentLinkDto) {
    return this.paymentService.generatePaymentLink(generatePaymentLinkDto);
  }

  @Post('fapshi/create-with-payment-link')
  @HttpCode(HttpStatus.CREATED)
  createWithFapshiPaymentLink(
    @Body('payment') createPaymentDto: CreatePaymentDto,
    @Body('paymentLink') paymentLinkDto: GeneratePaymentLinkDto,
  ) {
    return this.paymentService.createWithFapshiPaymentLink(createPaymentDto, paymentLinkDto);
  }

  @Get('fapshi/payment-status/:transId')
  getPaymentStatus(@Param('transId') transId: string) {
    return this.paymentService.getPaymentStatus(transId);
  }

  @Post('fapshi/expire-payment')
  @HttpCode(HttpStatus.OK)
  expirePayment(@Body() expirePaymentDto: ExpirePaymentDto) {
    return this.paymentService.expirePayment(expirePaymentDto);
  }

  @Get('fapshi/user-transactions/:userId')
  getUserTransactions(@Param('userId') userId: string) {
    return this.paymentService.getUserTransactions(userId);
  }

  @Post('fapshi/direct-payment')
  @HttpCode(HttpStatus.CREATED)
  initiateDirectPayment(@Body() directPaymentDto: DirectPaymentDto) {
    return this.paymentService.initiateDirectPayment(directPaymentDto);
  }

  @Post('fapshi/create-with-direct-payment')
  @HttpCode(HttpStatus.CREATED)
  createWithFapshiDirectPayment(
    @Body('payment') createPaymentDto: CreatePaymentDto,
    @Body('directPayment') directPaymentDto: DirectPaymentDto,
  ) {
    return this.paymentService.createWithFapshiDirectPayment(createPaymentDto, directPaymentDto);
  }

  @Get('fapshi/search')
  searchTransactions(@Query() searchParams: SearchTransactionsDto) {
    return this.paymentService.searchTransactions(searchParams);
  }

  @Get('fapshi/balance')
  getServiceBalance() {
    return this.paymentService.getServiceBalance();
  }

  @Patch(':id/sync-status')
  syncPaymentStatusWithFapshi(@Param('id') id: string) {
    return this.paymentService.syncPaymentStatusWithFapshi(id);
  }
}
