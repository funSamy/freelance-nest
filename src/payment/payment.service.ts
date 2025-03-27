import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, Prisma } from '@prisma/client';
import { FapshiService } from './services/fapshi.service';
import {
  DirectPaymentDto,
  ExpirePaymentDto,
  GeneratePaymentLinkDto,
  PaymentLinkResponseDto,
  PaymentStatusResponseDto,
  SearchTransactionsDto,
} from './dto/fapshi-payment.dto';
import { isEnum, isMongoId } from 'class-validator';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private fapshiService: FapshiService,
  ) { }

  async create(createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        status: 'pending',
      },
      include: {
        contract: true,
      },
    });
  }

  async findAll(filters?: { contractId?: string; status?: string }) {
    const where: Prisma.PaymentWhereInput = {};

    if (filters?.contractId) {
      // validate contract id
      if (!isMongoId(filters.contractId)) {
        throw new BadRequestException('Invalid contract ID');
      }
      where.contractId = filters.contractId;
    }

    if (filters?.status) {
      const paymentStatusValues = [...Object.values(PaymentStatus)] as const;
      if (!isEnum(filters.status, paymentStatusValues)) {
        throw new BadRequestException('Payment status must be one of: ' + paymentStatusValues.join(', '));
      }
      where.status = filters.status as PaymentStatus;
    }

    return this.prisma.payment.findMany({
      where,
      include: {
        contract: {
          include: {
            proposal: {
              include: {
                freelancer: true,
                job: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            proposal: {
              include: {
                freelancer: true,
                job: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    // First check if the payment exists
    await this.findOne(id);

    return this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
      include: {
        contract: true,
      },
    });
  }

  async remove(id: string) {
    // First check if the payment exists
    await this.findOne(id);

    return this.prisma.payment.delete({
      where: { id },
    });
  }

  async findByContract(contractId: string) {
    return this.findAll({ contractId });
  }

  async updatePaymentStatus(id: string, status: PaymentStatus) {
    // First check if the payment exists
    await this.findOne(id);

    return this.prisma.payment.update({
      where: { id },
      data: { status },
      include: {
        contract: true,
      },
    });
  }

  // Fapshi Payment Gateway Integration

  /**
   * Generate a payment link using Fapshi API
   * @param generatePaymentLinkDto
   * @returns Payment link response
   */
  async generatePaymentLink(generatePaymentLinkDto: GeneratePaymentLinkDto): Promise<PaymentLinkResponseDto> {
    return this.fapshiService.generatePaymentLink(generatePaymentLinkDto);
  }

  /**
   * Get the status of a payment transaction from Fapshi
   * @param transId
   * @returns Payment status
   */
  async getPaymentStatus(transId: string): Promise<PaymentStatusResponseDto> {
    return this.fapshiService.getPaymentStatus(transId);
  }

  /**
   * Expire a payment transaction to prevent further payments
   * @param expirePaymentDto
   * @returns Updated payment status
   */
  async expirePayment(expirePaymentDto: ExpirePaymentDto): Promise<PaymentStatusResponseDto> {
    return this.fapshiService.expirePayment(expirePaymentDto);
  }

  /**
   * Get all transactions associated with a specific user ID
   * @param userId
   * @returns Array of payment transactions
   */
  async getUserTransactions(userId: string): Promise<PaymentStatusResponseDto[]> {
    return this.fapshiService.getUserTransactions(userId);
  }

  /**
   * Initiate a direct payment request to a user's mobile device
   * @param directPaymentDto
   * @returns Direct payment response
   */
  async initiateDirectPayment(directPaymentDto: DirectPaymentDto) {
    return this.fapshiService.initiateDirectPayment(directPaymentDto);
  }

  /**
   * Search/filter transactions based on various criteria
   * @param searchParams
   * @returns Array of payment transactions
   */
  async searchTransactions(searchParams: SearchTransactionsDto): Promise<PaymentStatusResponseDto[]> {
    return this.fapshiService.searchTransactions(searchParams);
  }

  /**
   * Get the current balance of the service account
   * @returns Service balance
   */
  async getServiceBalance() {
    return this.fapshiService.getServiceBalance();
  }

  /**
   * Create a payment and initiate a Fapshi payment transaction
   * This method combines our internal payment creation with Fapshi payment initiation
   * @param createPaymentDto
   * @param paymentLinkDto
   * @returns Created payment with Fapshi payment link
   */
  async createWithFapshiPaymentLink(createPaymentDto: CreatePaymentDto, paymentLinkDto: GeneratePaymentLinkDto) {
    // First create the payment in our database
    const payment = await this.create(createPaymentDto);

    try {
      // Generate a payment link with Fapshi
      const paymentLinkResponse = await this.generatePaymentLink({
        ...paymentLinkDto,
        amount: createPaymentDto.amount,
        externalId: payment.id, // Use our payment ID as external ID for reference
      });

      // Update our payment with the Fapshi transaction ID
      await this.update(payment.id, {
        transactionId: paymentLinkResponse.transId,
      });

      // Return the payment with the Fapshi payment link
      return {
        payment,
        fapshiPaymentLink: paymentLinkResponse.link,
        fapshiTransId: paymentLinkResponse.transId,
      };
    } catch (error) {
      // If Fapshi payment link generation fails, delete the payment
      await this.remove(payment.id);
      throw error;
    }
  }

  /**
   * Create a payment and initiate a direct Fapshi payment
   * @param createPaymentDto
   * @param directPaymentDto
   * @returns Created payment with Fapshi transaction ID
   */
  async createWithFapshiDirectPayment(createPaymentDto: CreatePaymentDto, directPaymentDto: DirectPaymentDto) {
    // First create the payment in our database
    const payment = await this.create(createPaymentDto);

    try {
      // Initiate a direct payment with Fapshi
      const directPaymentResponse = await this.initiateDirectPayment({
        ...directPaymentDto,
        amount: createPaymentDto.amount,
        externalId: payment.id, // Use our payment ID as external ID for reference
      });

      // Update our payment with the Fapshi transaction ID
      await this.update(payment.id, {
        transactionId: directPaymentResponse.transId,
      });

      // Return the payment with the Fapshi transaction ID
      return {
        payment,
        fapshiTransId: directPaymentResponse.transId,
      };
    } catch (error) {
      // If Fapshi direct payment initiation fails, delete the payment
      await this.remove(payment.id);
      throw error;
    }
  }

  /**
   * Sync a payment status with Fapshi
   * This method checks the status of a payment transaction with Fapshi
   * and updates our internal payment status accordingly
   * @param id Payment ID
   * @returns Updated payment
   */
  async syncPaymentStatusWithFapshi(id: string) {
    // Get the payment from our database
    const payment = await this.findOne(id);

    if (!payment.transactionId) {
      throw new BadRequestException('Payment does not have a Fapshi transaction ID');
    }

    // Get the payment status from Fapshi
    const fapshiStatus = await this.getPaymentStatus(payment.transactionId);

    // Map Fapshi status to our payment status
    const mappedStatus = this.fapshiService.mapFapshiStatusToAppStatus(fapshiStatus.status);

    // Update our payment status if it's different
    if (payment.status !== mappedStatus) {
      return this.updatePaymentStatus(id, mappedStatus as PaymentStatus);
    }

    return payment;
  }
}
