import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ConsentService } from '../consent/consent.service';
import { RAGService } from '../rag/rag.service';
import { CreateDataIngestionDto } from './dto/create-data-ingestion.dto';
import { DataIngestionResponseDto } from './dto/data-ingestion-response.dto';
import { DataSource, DataIngestionStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import * as pdf from 'pdf-parse';
import * as xlsx from 'xlsx';

@Injectable()
export class DataIngestionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly consentService: ConsentService,
    private readonly ragService: RAGService,
  ) {}

  async initiateDataIngestion(
    userId: string,
    createDataIngestionDto: CreateDataIngestionDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<DataIngestionResponseDto> {
    const { source, dataType, filePath, accountAggregatorData, apiData } = createDataIngestionDto;

    // Check if user has consent for this data type
    const hasConsent = await this.consentService.checkDataAccessPermission(
      userId,
      dataType,
      'FINANCIAL_ANALYSIS'
    );

    if (!hasConsent) {
      throw new BadRequestException('User has not granted consent for this data type');
    }

    // Create data ingestion record
    const dataIngestion = await this.prisma.dataIngestion.create({
      data: {
        userId,
        source: source as DataSource,
        dataType: dataType as any,
        status: DataIngestionStatus.PENDING,
        metadata: {
          filePath,
          accountAggregatorData,
          apiData,
        } as any,
      },
    });

    // Log audit event
    await this.auditService.logEvent({
      userId,
      action: 'data_ingestion_initiated',
      resource: 'data_ingestion',
      result: 'SUCCESS',
      details: {
        ingestionId: dataIngestion.id,
        source,
        dataType,
      },
      ipAddress,
      userAgent,
    });

    // Process data ingestion asynchronously
    this.processDataIngestion(dataIngestion.id, userId).catch(error => {
      console.error('Data ingestion processing error:', error);
    });

    return this.mapToResponseDto(dataIngestion);
  }

  async processDataIngestion(ingestionId: string, userId: string): Promise<void> {
    try {
      // Update status to processing
      await this.prisma.dataIngestion.update({
        where: { id: ingestionId },
        data: { status: DataIngestionStatus.PROCESSING },
      });

      const ingestion = await this.prisma.dataIngestion.findUnique({
        where: { id: ingestionId },
      });

      if (!ingestion) {
        throw new NotFoundException('Data ingestion record not found');
      }

      let processedData: any;

      // Process based on source
      switch (ingestion.source) {
        case DataSource.FILE_UPLOAD:
          processedData = await this.processFileUpload(ingestion.metadata as any);
          break;
        case DataSource.ACCOUNT_AGGREGATOR:
          processedData = await this.processAccountAggregatorData(ingestion.metadata as any);
          break;
        case DataSource.API_INTEGRATION:
          processedData = await this.processAPIData(ingestion.metadata as any);
          break;
        case DataSource.MANUAL_ENTRY:
          processedData = await this.processManualEntry(ingestion.metadata as any);
          break;
        default:
          throw new BadRequestException('Unsupported data source');
      }

      // Store processed data
      const financialData = await this.prisma.financialData.create({
        data: {
          userId,
          dataType: ingestion.dataType,
          rawData: ingestion.metadata as any,
          processedData,
          source: ingestion.source,
        },
      });

      // Index data in RAG system
      await this.ragService.indexFinancialData(financialData.id, processedData);

      // Update ingestion status
      await this.prisma.dataIngestion.update({
        where: { id: ingestionId },
        data: {
          status: DataIngestionStatus.COMPLETED,
          processedAt: new Date(),
          financialDataId: financialData.id,
        },
      });

      // Log audit event
      await this.auditService.logEvent({
        userId,
        action: 'data_ingestion_completed',
        resource: 'data_ingestion',
        result: 'SUCCESS',
        details: {
          ingestionId,
          financialDataId: financialData.id,
          recordsProcessed: processedData.records?.length || 0,
        },
        ipAddress: 'system',
        userAgent: 'system',
      });

    } catch (error) {
      // Update status to failed
      await this.prisma.dataIngestion.update({
        where: { id: ingestionId },
        data: {
          status: DataIngestionStatus.FAILED,
          errorMessage: error.message,
          processedAt: new Date(),
        },
      });

      // Log audit event
      await this.auditService.logEvent({
        userId,
        action: 'data_ingestion_failed',
        resource: 'data_ingestion',
        result: 'FAILURE',
        details: {
          ingestionId,
          error: error.message,
        },
        ipAddress: 'system',
        userAgent: 'system',
      });

      throw error;
    }
  }

  private async processFileUpload(metadata: any): Promise<any> {
    const { filePath, fileType } = metadata;

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    switch (fileType) {
      case 'csv':
        return await this.processCSVFile(filePath);
      case 'pdf':
        return await this.processPDFFile(filePath);
      case 'xlsx':
        return await this.processExcelFile(filePath);
      default:
        throw new BadRequestException('Unsupported file type');
    }
  }

  private async processCSVFile(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve({
            records: results,
            totalRecords: results.length,
            fileType: 'csv',
            processedAt: new Date().toISOString(),
          });
        })
        .on('error', reject);
    });
  }

  private async processPDFFile(filePath: string): Promise<any> {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    
    return {
      text: pdfData.text,
      pages: pdfData.numpages,
      fileType: 'pdf',
      processedAt: new Date().toISOString(),
    };
  }

  private async processExcelFile(filePath: string): Promise<any> {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    return {
      records: data,
      totalRecords: data.length,
      fileType: 'xlsx',
      sheetName,
      processedAt: new Date().toISOString(),
    };
  }

  private async processAccountAggregatorData(metadata: any): Promise<any> {
    const { accountAggregatorData } = metadata;
    
    // Process AA data structure
    const processedData = {
      accounts: accountAggregatorData.accounts || [],
      transactions: accountAggregatorData.transactions || [],
      profile: accountAggregatorData.profile || {},
      summary: {
        totalAccounts: accountAggregatorData.accounts?.length || 0,
        totalTransactions: accountAggregatorData.transactions?.length || 0,
        dateRange: this.calculateDateRange(accountAggregatorData.transactions || []),
      },
      source: 'account_aggregator',
      processedAt: new Date().toISOString(),
    };

    return processedData;
  }

  private async processAPIData(metadata: any): Promise<any> {
    const { apiData, apiType } = metadata;
    
    // Process different API data types
    switch (apiType) {
      case 'bank_statement':
        return this.processBankStatementAPI(apiData);
      case 'investment_data':
        return this.processInvestmentAPI(apiData);
      case 'tax_data':
        return this.processTaxAPI(apiData);
      default:
        return {
          rawData: apiData,
          source: 'api',
          processedAt: new Date().toISOString(),
        };
    }
  }

  private processBankStatementAPI(apiData: any): any {
    return {
      accounts: apiData.accounts || [],
      transactions: apiData.transactions || [],
      summary: {
        totalBalance: apiData.totalBalance || 0,
        totalTransactions: apiData.transactions?.length || 0,
        dateRange: this.calculateDateRange(apiData.transactions || []),
      },
      source: 'bank_api',
      processedAt: new Date().toISOString(),
    };
  }

  private processInvestmentAPI(apiData: any): any {
    return {
      portfolio: apiData.portfolio || [],
      holdings: apiData.holdings || [],
      transactions: apiData.transactions || [],
      summary: {
        totalValue: apiData.totalValue || 0,
        totalHoldings: apiData.holdings?.length || 0,
        totalTransactions: apiData.transactions?.length || 0,
      },
      source: 'investment_api',
      processedAt: new Date().toISOString(),
    };
  }

  private processTaxAPI(apiData: any): any {
    return {
      taxReturns: apiData.taxReturns || [],
      form16: apiData.form16 || [],
      tds: apiData.tds || [],
      summary: {
        totalReturns: apiData.taxReturns?.length || 0,
        totalTDS: apiData.tds?.length || 0,
      },
      source: 'tax_api',
      processedAt: new Date().toISOString(),
    };
  }

  private async processManualEntry(metadata: any): Promise<any> {
    return {
      entries: metadata.entries || [],
      totalEntries: metadata.entries?.length || 0,
      source: 'manual',
      processedAt: new Date().toISOString(),
    };
  }

  private calculateDateRange(transactions: any[]): { start: string; end: string } | null {
    if (!transactions || transactions.length === 0) {
      return null;
    }

    const dates = transactions
      .map(t => new Date(t.date || t.transactionDate))
      .filter(date => !isNaN(date.getTime()));

    if (dates.length === 0) {
      return null;
    }

    const start = new Date(Math.min(...dates.map(d => d.getTime())));
    const end = new Date(Math.max(...dates.map(d => d.getTime())));

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }

  async getDataIngestionStatus(userId: string, ingestionId: string): Promise<DataIngestionResponseDto> {
    const ingestion = await this.prisma.dataIngestion.findFirst({
      where: {
        id: ingestionId,
        userId,
      },
    });

    if (!ingestion) {
      throw new NotFoundException('Data ingestion not found');
    }

    return this.mapToResponseDto(ingestion);
  }

  async getUserDataIngestions(userId: string): Promise<DataIngestionResponseDto[]> {
    const ingestions = await this.prisma.dataIngestion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return ingestions.map(ingestion => this.mapToResponseDto(ingestion));
  }

  async getFinancialDataSummary(userId: string): Promise<any> {
    const financialData = await this.prisma.financialData.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const summary = {
      totalRecords: financialData.length,
      bySource: {},
      byDataType: {},
      lastUpdated: null,
      totalSize: 0,
    };

    financialData.forEach(data => {
      // Group by source
      summary.bySource[data.source] = (summary.bySource[data.source] || 0) + 1;
      
      // Group by data type
      summary.byDataType[data.dataType] = (summary.byDataType[data.dataType] || 0) + 1;
      
      // Calculate total size
      summary.totalSize += JSON.stringify(data.rawData).length + JSON.stringify(data.processedData).length;
      
      // Find last updated
      if (!summary.lastUpdated || data.updatedAt > summary.lastUpdated) {
        summary.lastUpdated = data.updatedAt;
      }
    });

    return summary;
  }

  private mapToResponseDto(ingestion: any): DataIngestionResponseDto {
    return {
      id: ingestion.id,
      userId: ingestion.userId,
      fileName: (ingestion as any).fileName,
      fileSize: (ingestion as any).fileSize,
      mimeType: (ingestion as any).mimeType,
      source: ingestion.source,
      dataType: ingestion.dataType,
      status: ingestion.status,
      metadata: ingestion.metadata,
      processedData: (ingestion as any).processedData,
      financialDataId: ingestion.financialDataId,
      errorMessage: (ingestion as any).errorMessage,
      createdAt: ingestion.createdAt,
      updatedAt: ingestion.updatedAt,
      processedAt: ingestion.processedAt,
    };
  }
}
