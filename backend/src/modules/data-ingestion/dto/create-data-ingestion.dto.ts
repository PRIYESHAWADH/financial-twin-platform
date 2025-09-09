import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDataIngestionDto {
  @ApiProperty({
    description: 'User ID',
    example: 'clh1234567890',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Data type',
    example: 'BANK_STATEMENT',
    enum: ['BANK_STATEMENT', 'CREDIT_CARD', 'INVESTMENT', 'LOAN', 'INSURANCE'],
  })
  @IsEnum(['BANK_STATEMENT', 'CREDIT_CARD', 'INVESTMENT', 'LOAN', 'INSURANCE'])
  dataType: string;

  @ApiProperty({
    description: 'Data source',
    example: 'HDFC_BANK',
  })
  @IsString()
  source: string;

  @ApiProperty({
    description: 'File name',
    example: 'bank_statement_2023.pdf',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  @IsString()
  fileSize: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  @IsString()
  mimeType: string;

  @ApiProperty({
    description: 'File path',
    example: '/uploads/bank_statement_2023.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  filePath?: string;

  @ApiProperty({
    description: 'Account aggregator data',
    example: { consentId: 'consent123', dataRange: '3M' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  accountAggregatorData?: any;

  @ApiProperty({
    description: 'API data',
    example: { endpoint: 'api.bank.com', credentials: 'encrypted' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  apiData?: any;

  @ApiProperty({
    description: 'Processing status',
    example: 'PENDING',
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
  })
  @IsEnum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'])
  status: string;

  @ApiProperty({
    description: 'Additional metadata',
    example: { accountNumber: '****1234', period: '2023-01' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
