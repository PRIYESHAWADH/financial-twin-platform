import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConsentModule } from './modules/consent/consent.module';
import { DataIngestionModule } from './modules/data-ingestion/data-ingestion.module';
import { RAGModule } from './modules/rag/rag.module';
import { AIInsightsModule } from './modules/ai-insights/ai-insights.module';
import { CAMarketplaceModule } from './modules/ca-marketplace/ca-marketplace.module';
import { AuditModule } from './modules/audit/audit.module';
import { PrismaService } from './common/services/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    UserModule,
    ConsentModule,
    DataIngestionModule,
    RAGModule,
    AIInsightsModule,
    CAMarketplaceModule,
    AuditModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
