import { IsOptional, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
