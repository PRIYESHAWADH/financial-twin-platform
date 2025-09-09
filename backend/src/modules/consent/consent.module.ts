import { Module } from '@nestjs/common';
import { ConsentService } from './consent.service';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../audit/audit.service';

@Module({
  providers: [ConsentService, PrismaService, AuditService],
  exports: [ConsentService],
})
export class ConsentModule {}
