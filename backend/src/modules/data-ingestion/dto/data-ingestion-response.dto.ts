import { ApiProperty } from '@nestjs/swagger';

export class DataIngestionResponseDto {
  @ApiProperty({
    description: 'Data ingestion ID',
    example: 'clh1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'clh1234567890',
  })
  userId: string;

  @ApiProperty({
    description: 'Data type',
    example: 'BANK_STATEMENT',
    enum: ['BANK_STATEMENT', 'CREDIT_CARD', 'INVESTMENT', 'LOAN', 'INSURANCE'],
  })
  dataType: string;

  @ApiProperty({
    description: 'Data source',
    example: 'HDFC_BANK',
  })
  source: string;

  @ApiProperty({
    description: 'File name',
    example: 'bank_statement_2023.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
  })
  fileSize: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  mimeType: string;

  @ApiProperty({
    description: 'Processing status',
    example: 'COMPLETED',
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
  })
  status: string;

  @ApiProperty({
    description: 'Processed data',
    example: { transactions: [], summary: {} },
  })
  processedData: any;

  @ApiProperty({
    description: 'Additional metadata',
    example: { accountNumber: '****1234', period: '2023-01' },
  })
  metadata: any;

  @ApiProperty({
    description: 'Financial data ID',
    example: 'clh1234567890',
  })
  financialDataId: string;

  @ApiProperty({
    description: 'Error message if processing failed',
    example: 'Invalid file format',
    required: false,
  })
  errorMessage?: string;

  @ApiProperty({
    description: 'Processing timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  processedAt?: Date;

  @ApiProperty({
    description: 'Data ingestion creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data ingestion last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
