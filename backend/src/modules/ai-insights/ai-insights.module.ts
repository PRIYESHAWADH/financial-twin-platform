import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIInsightsService } from './ai-insights.service';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../audit/audit.service';
import { RAGService } from '../rag/rag.service';

@Module({
  imports: [ConfigModule],
  providers: [AIInsightsService, PrismaService, AuditService, RAGService],
  exports: [AIInsightsService],
})
export class AIInsightsModule {}
