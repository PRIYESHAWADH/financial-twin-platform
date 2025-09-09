import { IsString, IsEmail, IsOptional, IsPhoneNumber, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCADto {
  @ApiProperty({
    description: 'CA name',
    example: 'John Doe & Associates',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'ICAI Member ID',
    example: 'ICAI123456',
  })
  @IsString()
  icaiMemberId: string;

  @ApiProperty({
    description: 'CA first name',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'CA last name',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'CA PAN number',
    example: 'ABCDE1234F',
  })
  @IsString()
  pan: string;

  @ApiProperty({
    description: 'CA address',
    example: '123 Main Street',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'CA city',
    example: 'Mumbai',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'CA state',
    example: 'Maharashtra',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'CA pincode',
    example: '400001',
  })
  @IsString()
  pincode: string;

  @ApiProperty({
    description: 'CA email',
    example: 'ca@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'CA phone number',
    example: '+919876543210',
  })
  @IsPhoneNumber('IN')
  phone: string;

  @ApiProperty({
    description: 'CA registration number',
    example: 'CA123456',
  })
  @IsString()
  registrationNumber: string;

  @ApiProperty({
    description: 'CA experience in years',
    example: 5,
  })
  @IsString()
  experience: string;

  @ApiProperty({
    description: 'CA qualifications',
    example: ['CA', 'CS'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  qualifications: string[];

  @ApiProperty({
    description: 'CA languages',
    example: ['English', 'Hindi'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiProperty({
    description: 'CA consultation fee',
    example: 5000,
  })
  @IsString()
  consultationFee: string;

  @ApiProperty({
    description: 'CA availability',
    example: '9 AM - 6 PM',
  })
  @IsString()
  availability: string;

  @ApiProperty({
    description: 'CA specialization',
    example: 'Tax Planning',
  })
  @IsString()
  specialization: string;

  @ApiProperty({
    description: 'CA location',
    example: 'Mumbai, Maharashtra',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'CA status',
    example: 'PENDING',
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
  })
  @IsEnum(['PENDING', 'VERIFIED', 'REJECTED'])
  status: string;

  @ApiProperty({
    description: 'CA services offered',
    example: ['Tax Filing', 'Audit', 'Consulting'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  services: string[];

  @ApiProperty({
    description: 'CA bio',
    example: 'Experienced CA with 5+ years in tax planning',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;
}
