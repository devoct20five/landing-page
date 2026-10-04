import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './models/invoice.model';
import { PaymentTransaction } from './models/payment-transaction.model';
import { AccessControlModule } from '@/common/access-control/access-control.module';

@Module({
  imports: [SequelizeModule.forFeature([Invoice, PaymentTransaction]), AccessControlModule],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
