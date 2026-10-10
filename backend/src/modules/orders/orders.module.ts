import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CatalogModule } from '../catalog/catalog.module';
import { Client } from '../clients/models/client.model';
import { ClientContact } from '../clients/models/client-contact.model';
import { Invoice } from '../invoices/models/invoice.model';
import { PaymentTransaction } from '../invoices/models/payment-transaction.model';
import { MailModule } from '../mail/mail.module';
import { PaymentsModule } from '../payments/payments.module';
import { Project } from '../projects/models/project.model';
import { ProjectService } from '../projects/models/project-service.model';
import { Role } from '../roles/models/role.model';
import { User } from '../users/models/user.model';
import { CheckoutController } from './checkout.controller';
import { Order } from './models/order.model';
import { OrderPayment } from './models/order-payment.model';
import { PaymentWebhookEvent } from './models/payment-webhook-event.model';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProvisioningService } from './provisioning.service';
import { MockPaymentsController, WebhooksController } from './webhooks.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Order, OrderPayment, PaymentWebhookEvent, User, Role, Client, ClientContact, Project, ProjectService, Invoice, PaymentTransaction]),
    CatalogModule,
    PaymentsModule,
    MailModule,
  ],
  controllers: [CheckoutController, WebhooksController, MockPaymentsController, OrdersController],
  providers: [OrdersService, ProvisioningService],
  exports: [OrdersService],
})
export class OrdersModule {}
