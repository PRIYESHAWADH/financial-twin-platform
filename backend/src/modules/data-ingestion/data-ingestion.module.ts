import { Module } from '@nestjs/common';
import { DataIngestionService } from './data-ingestion.service';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ConsentService } from '../consent/consent.service';
import { RAGService } from '../rag/rag.service';

@Module({
  providers: [DataIngestionService, PrismaService, AuditService, ConsentService, RAGService],
  exports: [DataIngestionService],
})
export class DataIngestionModule {}
