import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { AuthTokensModule } from './auth-tokens.module';
import { MailModule } from '../mail/mail.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [
    UsersModule,
    AuthTokensModule,
    MailModule,
    SequelizeModule.forFeature([User]),
    RolesModule,
    ClientsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // getOrThrow (not get): fail loudly at boot if JWT_SECRET is
        // missing rather than silently signing tokens with `undefined` as
        // the secret. Matches JwtStrategy's own guard below.
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          // @types/jsonwebtoken's `expiresIn` is typed as a template-literal
          // union (StringValue, e.g. "8h" | "1d" | ...), which a
          // config-driven runtime string can never satisfy statically.
          // The value itself is validated by the `ms` package at runtime;
          // this cast only silences the compile-time mismatch.
          expiresIn: config.get<string>(
            'JWT_EXPIRES_IN',
            '8h',
          ) as unknown as number,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
