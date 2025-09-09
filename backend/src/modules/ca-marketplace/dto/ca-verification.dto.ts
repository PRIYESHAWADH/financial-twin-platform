import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CAVerificationDto {
  @ApiProperty({
    description: 'CA ID to verify',
    example: 'clh1234567890',
  })
  @IsString()
  caId: string;

  @ApiProperty({
    description: 'Verification status',
    example: 'VERIFIED',
    enum: ['VERIFIED', 'REJECTED'],
  })
  @IsEnum(['VERIFIED', 'REJECTED'])
  verificationStatus: string;

  @ApiProperty({
    description: 'Verification notes',
    example: 'All documents verified successfully',
    required: false,
  })
  @IsOptional()
  @IsString()
  verificationNotes?: string;

  @ApiProperty({
    description: 'Verification documents',
    example: ['pan_card.pdf', 'icai_certificate.pdf'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  documents?: string[];
}
