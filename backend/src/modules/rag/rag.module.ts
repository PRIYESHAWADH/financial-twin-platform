import { Module } from '@nestjs/common';
import { RAGService } from './rag.service';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  providers: [RAGService, PrismaService],
  exports: [RAGService],
})
export class RAGModule {}
