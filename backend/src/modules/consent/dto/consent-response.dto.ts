import { ApiProperty } from '@nestjs/swagger';

export class ConsentResponseDto {
  @ApiProperty({
    description: 'Consent ID',
    example: 'clh1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'clh1234567890',
  })
  userId: string;

  @ApiProperty({
    description: 'Consent type',
    example: 'DATA_SHARING',
  })
  type: string;

  @ApiProperty({
    description: 'Consent status',
    example: 'GRANTED',
    enum: ['GRANTED', 'DENIED', 'PENDING'],
  })
  status: string;

  @ApiProperty({
    description: 'Consent purpose',
    example: 'Financial analysis and insights',
  })
  purpose: string;

  @ApiProperty({
    description: 'Data categories',
    example: ['TRANSACTIONS', 'BANK_ACCOUNTS'],
    type: [String],
  })
  dataCategories: string[];

  @ApiProperty({
    description: 'Consent expiry date',
    example: '2024-12-31T23:59:59.000Z',
  })
  expiryDate?: Date;

  @ApiProperty({
    description: 'Additional metadata',
    example: { source: 'mobile_app', version: '1.0' },
  })
  metadata: any;

  @ApiProperty({
    description: 'Consent type',
    example: 'DATA_SHARING',
  })
  consentType: string;

  @ApiProperty({
    description: 'Data types',
    example: [{ code: 'TRANSACTIONS', description: 'Transaction data' }],
    type: [Object],
  })
  dataTypes: any[];

  @ApiProperty({
    description: 'Data fiduciaries',
    example: [{ fid: 'BANK_A', name: 'Bank A' }],
    type: [Object],
  })
  dataFiduciaries: any[];

  @ApiProperty({
    description: 'Consent granted timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  grantedAt: Date;

  @ApiProperty({
    description: 'Consent expiry timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'Consent revoked timestamp',
    example: '2023-06-01T00:00:00.000Z',
    required: false,
  })
  revokedAt?: Date;

  @ApiProperty({
    description: 'Data retention period in years',
    example: 2,
  })
  dataRetentionPeriod: number;

  @ApiProperty({
    description: 'Consent creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Consent last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
