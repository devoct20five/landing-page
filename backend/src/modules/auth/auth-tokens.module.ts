import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthToken } from './models/auth-token.model';
import { AuthTokensService } from './auth-tokens.service';

@Module({
  imports: [SequelizeModule.forFeature([AuthToken])],
  providers: [AuthTokensService],
  exports: [AuthTokensService],
})
export class AuthTokensModule {}
