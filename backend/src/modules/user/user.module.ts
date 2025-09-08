import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../audit/audit.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AuditService],
  exports: [UserService],
})
export class UserModule {}
