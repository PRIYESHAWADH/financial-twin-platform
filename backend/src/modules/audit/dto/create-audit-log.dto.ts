import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuditLogDto {
  @ApiProperty({
    description: 'User ID who performed the action',
    example: 'clh1234567890',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Action performed',
    example: 'LOGIN',
  })
  @IsString()
  action: string;

  @ApiProperty({
    description: 'Resource affected',
    example: 'USER_PROFILE',
  })
  @IsString()
  resource: string;

  @ApiProperty({
    description: 'Resource ID',
    example: 'clh1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  resourceId?: string;

  @ApiProperty({
    description: 'Action result',
    example: 'SUCCESS',
    enum: ['SUCCESS', 'FAILURE', 'PENDING'],
  })
  @IsEnum(['SUCCESS', 'FAILURE', 'PENDING'])
  result: string;

  @ApiProperty({
    description: 'IP address',
    example: '192.168.1.1',
    required: false,
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    description: 'User agent',
    example: 'Mozilla/5.0...',
    required: false,
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({
    description: 'Additional metadata',
    example: { oldValue: 'old', newValue: 'new' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiProperty({
    description: 'Additional details',
    example: { oldValue: 'old', newValue: 'new' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  details?: any;
}
