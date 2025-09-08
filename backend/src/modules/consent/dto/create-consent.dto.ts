import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConsentDto {
  @ApiProperty({
    description: 'User ID',
    example: 'clh1234567890',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Consent type',
    example: 'DATA_SHARING',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Consent type',
    example: 'DATA_SHARING',
  })
  @IsString()
  consentType: string;

  @ApiProperty({
    description: 'Consent status',
    example: 'GRANTED',
    enum: ['GRANTED', 'DENIED', 'PENDING'],
  })
  @IsEnum(['GRANTED', 'DENIED', 'PENDING'])
  status: string;

  @ApiProperty({
    description: 'Consent purpose',
    example: 'Financial analysis and insights',
  })
  @IsString()
  purpose: string;

  @ApiProperty({
    description: 'Data categories',
    example: ['TRANSACTIONS', 'BANK_ACCOUNTS'],
    type: [String],
  })
  @IsString({ each: true })
  dataCategories: string[];

  @ApiProperty({
    description: 'Data types',
    example: ['TRANSACTIONS', 'BANK_ACCOUNTS'],
    type: [String],
  })
  @IsString({ each: true })
  dataTypes: string[];

  @ApiProperty({
    description: 'Data fiduciaries',
    example: ['BANK_A', 'BANK_B'],
    type: [String],
  })
  @IsString({ each: true })
  dataFiduciaries: string[];

  @ApiProperty({
    description: 'Consent expiry date',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  expiryDate?: string;

  @ApiProperty({
    description: 'Additional metadata',
    example: { source: 'mobile_app', version: '1.0' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiProperty({
    description: 'Data sharing frequency',
    example: 'MONTHLY',
    required: false,
  })
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiProperty({
    description: 'Data retention period',
    example: '2_YEARS',
    required: false,
  })
  @IsOptional()
  @IsString()
  dataRetentionPeriod?: string;
}
