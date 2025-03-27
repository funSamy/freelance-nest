import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { fapshiConfig } from '../config/fapshi.config';
import {
  GeneratePaymentLinkDto,
  PaymentLinkResponseDto,
  PaymentStatusResponseDto,
  ExpirePaymentDto,
  DirectPaymentDto,
  DirectPaymentResponseDto,
  SearchTransactionsDto,
  BalanceResponseDto,
  FapshiPaymentStatus,
} from '../dto/fapshi-payment.dto';
import { AxiosResponse } from 'axios';

@Injectable()
export class FapshiService {
  private readonly logger = new Logger(FapshiService.name);
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.logger.verbose({apiuser: fapshiConfig.apiUser, apikey: fapshiConfig.apiKey});
    // Set the base URL based on the environment
    this.baseUrl =
      fapshiConfig.environment === 'production' ? fapshiConfig.baseUrl.production : fapshiConfig.baseUrl.sandbox;
  }

  /**
   * Generate a payment link for a user to complete payment
   * @param generatePaymentLinkDto
   * @returns PaymentLinkResponseDto
   */
  async generatePaymentLink(generatePaymentLinkDto: GeneratePaymentLinkDto): Promise<PaymentLinkResponseDto> {
    try {
      const response: AxiosResponse<PaymentLinkResponseDto> = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/initiate-pay`, generatePaymentLinkDto, {
          headers: {
            'Content-Type': 'application/json',
            apiuser: fapshiConfig.apiUser,
            apikey: fapshiConfig.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to generate payment link');
    }
  }

  /**
   * Get the status of a payment transaction
   * @param transId
   * @returns PaymentStatusResponseDto
   */
  async getPaymentStatus(transId: string): Promise<PaymentStatusResponseDto> {
    try {
      const response: AxiosResponse<PaymentStatusResponseDto> = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/payment-status/${transId}`, {
          headers: {
            'Content-Type': 'application/json',
            apiuser: fapshiConfig.apiUser,
            apikey: fapshiConfig.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get payment status for transaction ${transId}`);
    }
  }

  /**
   * Expire a payment transaction to prevent further payments
   * @param expirePaymentDto
   * @returns PaymentStatusResponseDto
   */
  async expirePayment(expirePaymentDto: ExpirePaymentDto): Promise<PaymentStatusResponseDto> {
    try {
      const response: AxiosResponse<PaymentStatusResponseDto> = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/expire-pay`, expirePaymentDto, {
          headers: {
            'Content-Type': 'application/json',
            apiuser: fapshiConfig.apiUser,
            apikey: fapshiConfig.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to expire payment for transaction ${expirePaymentDto.transId}`);
    }
  }

  /**
   * Get all transactions associated with a specific user ID
   * @param userId
   * @returns Array of PaymentStatusResponseDto
   */
  async getUserTransactions(userId: string): Promise<PaymentStatusResponseDto[]> {
    try {
      const response: AxiosResponse<PaymentStatusResponseDto[]> = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/transaction/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            apiuser: fapshiConfig.apiUser,
            apikey: fapshiConfig.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.handleError(error, `Failed to get transactions for user ${userId}`);
    }
  }

  /**
   * Initiate a direct payment request to a user's mobile device
   * @param directPaymentDto
   * @returns DirectPaymentResponseDto
   */
  async initiateDirectPayment(directPaymentDto: DirectPaymentDto): Promise<DirectPaymentResponseDto> {
    try {
      const response: AxiosResponse<DirectPaymentResponseDto> = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/direct-pay`, directPaymentDto, {
          headers: {
            'Content-Type': 'application/json',
            apiuser: fapshiConfig.apiUser,
            apikey: fapshiConfig.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to initiate direct payment');
    }
  }

  /**
   * Search/filter transactions based on various criteria
   * @param searchParams
   * @returns Array of PaymentStatusResponseDto
   */
  async searchTransactions(searchParams: SearchTransactionsDto): Promise<PaymentStatusResponseDto[]> {
    try {
      // Convert search parameters to query string
      const queryParams = new URLSearchParams();

      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const response: AxiosResponse<PaymentStatusResponseDto[]> = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/search?${queryParams.toString()}`, {
          headers: {
            'Content-Type': 'application/json',
            apiuser: fapshiConfig.apiUser,
            apikey: fapshiConfig.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to search transactions');
    }
  }

  /**
   * Get the current balance of the service account
   * @returns BalanceResponseDto
   */
  async getServiceBalance(): Promise<BalanceResponseDto> {
    try {
      const response: AxiosResponse<BalanceResponseDto> = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/balance`, {
          headers: {
            'Content-Type': 'application/json',
            apiuser: fapshiConfig.apiUser,
            apikey: fapshiConfig.apiKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get service balance');
    }
  }

  /**
   * Map Fapshi payment status to our application's PaymentStatus
   * @param fapshiStatus
   * @returns PaymentStatus
   */
  mapFapshiStatusToAppStatus(fapshiStatus: FapshiPaymentStatus): 'pending' | 'completed' | 'failed' {
    switch (fapshiStatus) {
      case FapshiPaymentStatus.SUCCESSFUL:
        return 'completed';
      case FapshiPaymentStatus.FAILED:
      case FapshiPaymentStatus.EXPIRED:
        return 'failed';
      case FapshiPaymentStatus.CREATED:
      case FapshiPaymentStatus.PENDING:
      default:
        return 'pending';
    }
  }

  /**
   * Handle HTTP errors from Fapshi API
   * @param error
   * @param message
   */
  private handleError(error: any, message: string): never {
    this.logger.error(`${message}: ${error.message}`, error.stack);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new HttpException(
        error.response.data?.message || message,
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new HttpException('No response received from payment gateway', HttpStatus.SERVICE_UNAVAILABLE);
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
