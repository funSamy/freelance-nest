import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { JobModule } from './job/job.module';
import { ProposalModule } from './proposal/proposal.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { ContractModule } from './contract/contract.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    ProfileModule,
    JobModule,
    ProposalModule,
    PaymentModule,
    ReviewModule,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
