import { ApiProperty } from '@nestjs/swagger';

export class AIInsightResponseDto {
  @ApiProperty({
    description: 'Insight ID',
    example: 'clh1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'clh1234567890',
  })
  userId: string;

  @ApiProperty({
    description: 'Insight type',
    example: 'EXPENSE_ANALYSIS',
  })
  type: string;

  @ApiProperty({
    description: 'Insight title',
    example: 'High Food Expenses Detected',
  })
  title: string;

  @ApiProperty({
    description: 'Insight description',
    example: 'Your food expenses are 30% higher than average',
  })
  description: string;

  @ApiProperty({
    description: 'Insight recommendation',
    example: 'Consider meal planning to reduce food costs',
  })
  recommendation: string;

  @ApiProperty({
    description: 'Insight priority',
    example: 'HIGH',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  })
  priority: string;

  @ApiProperty({
    description: 'Additional metadata',
    example: { category: 'food', amount: 15000 },
  })
  metadata: any;

  @ApiProperty({
    description: 'Insight type',
    example: 'EXPENSE_ANALYSIS',
  })
  insightType: string;

  @ApiProperty({
    description: 'Confidence score',
    example: 0.85,
  })
  confidence: number;

  @ApiProperty({
    description: 'Whether the insight is actionable',
    example: true,
  })
  actionable: boolean;

  @ApiProperty({
    description: 'Estimated savings amount',
    example: 5000,
  })
  estimatedSavings: number;

  @ApiProperty({
    description: 'Deadline for action',
    example: '2023-12-31T23:59:59.000Z',
    required: false,
  })
  deadline?: Date;

  @ApiProperty({
    description: 'Citations for the insight',
    example: ['Source 1', 'Source 2'],
    type: [String],
  })
  citations: string[];

  @ApiProperty({
    description: 'When the insight was generated',
    example: '2023-01-01T00:00:00.000Z',
  })
  generatedAt: Date;

  @ApiProperty({
    description: 'Insight creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Insight last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
