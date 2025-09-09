import { Module } from '@nestjs/common';
import { CAMarketplaceService } from './ca-marketplace.service';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../audit/audit.service';

@Module({
  providers: [CAMarketplaceService, PrismaService, AuditService],
  exports: [CAMarketplaceService],
})
export class CAMarketplaceModule {}
