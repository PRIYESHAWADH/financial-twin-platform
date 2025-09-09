import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAIInsightDto {
  @ApiProperty({
    description: 'User ID',
    example: 'clh1234567890',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Insight type',
    example: 'EXPENSE_ANALYSIS',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Insight title',
    example: 'High Food Expenses Detected',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Insight description',
    example: 'Your food expenses are 30% higher than average',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Insight recommendation',
    example: 'Consider meal planning to reduce food costs',
  })
  @IsString()
  recommendation: string;

  @ApiProperty({
    description: 'Additional metadata',
    example: { category: 'food', amount: 15000 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
