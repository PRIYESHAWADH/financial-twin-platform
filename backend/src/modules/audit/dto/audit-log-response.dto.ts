import { ApiProperty } from '@nestjs/swagger';

export class AuditLogResponseDto {
  @ApiProperty({
    description: 'Audit log ID',
    example: 'clh1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who performed the action',
    example: 'clh1234567890',
  })
  userId: string;

  @ApiProperty({
    description: 'Action performed',
    example: 'LOGIN',
  })
  action: string;

  @ApiProperty({
    description: 'Resource affected',
    example: 'USER_PROFILE',
  })
  resource: string;

  @ApiProperty({
    description: 'Resource ID',
    example: 'clh1234567890',
    required: false,
  })
  resourceId?: string;

  @ApiProperty({
    description: 'Action result',
    example: 'SUCCESS',
    enum: ['SUCCESS', 'FAILURE', 'PENDING'],
  })
  result: string;

  @ApiProperty({
    description: 'IP address',
    example: '192.168.1.1',
    required: false,
  })
  ipAddress?: string;

  @ApiProperty({
    description: 'User agent',
    example: 'Mozilla/5.0...',
    required: false,
  })
  userAgent?: string;

  @ApiProperty({
    description: 'Additional metadata',
    example: { oldValue: 'old', newValue: 'new' },
  })
  metadata: any;

  @ApiProperty({
    description: 'Additional details',
    example: { oldValue: 'old', newValue: 'new' },
  })
  details: any;

  @ApiProperty({
    description: 'Previous hash',
    example: 'abc123def456',
  })
  previousHash: string;

  @ApiProperty({
    description: 'Current hash',
    example: 'def456ghi789',
  })
  currentHash: string;

  @ApiProperty({
    description: 'Hash chain',
    example: ['hash1', 'hash2', 'hash3'],
    type: [String],
  })
  hashChain: string[];

  @ApiProperty({
    description: 'Audit log creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
