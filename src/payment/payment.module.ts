import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { FapshiService } from './services/fapshi.service';

@Module({
  imports: [
    PrismaModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, FapshiService],
  exports: [PaymentService],
})
export class PaymentModule {}
