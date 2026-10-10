import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CatalogModule } from './modules/catalog/catalog.module';
import { OrdersModule } from './modules/orders/orders.module';

import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';

import databaseConfig from './database/database.config';

import { ApprovalsModule } from './modules/approvals/approvals.module';
import { BehindTheWorkModule } from './modules/behind-the-work/behind-the-work.module';
import { CareersModule } from './modules/careers/careers.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ActivityModule } from './modules/engagement/activity.module';
import { NotificationsModule } from './modules/engagement/notifications.module';
import { EventsModule } from './modules/events/events.module';
import { FilesModule } from './modules/files/files.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { QueriesModule } from './modules/queries/queries.module';
import { ServicesModule } from './modules/services/services.module';
import { StaffModule } from './modules/staff/staff.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // Database
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService): SequelizeModuleOptions =>
        config.getOrThrow<SequelizeModuleOptions>('database'),
    }),

    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),

    // Core modules
    UsersModule,
    RolesModule,
    AuthModule,

    // Business modules
    ApprovalsModule,
    BehindTheWorkModule,
    CareersModule,
    ClientsModule,
    ActivityModule,
    NotificationsModule,
    EventsModule,
    FilesModule,
    InvoicesModule,
    ProjectsModule,
    QueriesModule,
    ServicesModule,
    StaffModule,
    TasksModule,
    CatalogModule,
    OrdersModule,
  ],

  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
