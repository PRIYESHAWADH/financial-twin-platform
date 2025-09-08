import { ApiProperty } from '@nestjs/swagger';

export class CAResponseDto {
  @ApiProperty({
    description: 'CA ID',
    example: 'clh1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'CA name',
    example: 'John Doe & Associates',
  })
  name: string;

  @ApiProperty({
    description: 'ICAI Member ID',
    example: 'ICAI123456',
  })
  icaiMemberId: string;

  @ApiProperty({
    description: 'CA first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'CA last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'CA PAN number',
    example: 'ABCDE1234F',
  })
  pan: string;

  @ApiProperty({
    description: 'CA address',
    example: '123 Main Street',
  })
  address: string;

  @ApiProperty({
    description: 'CA city',
    example: 'Mumbai',
  })
  city: string;

  @ApiProperty({
    description: 'CA state',
    example: 'Maharashtra',
  })
  state: string;

  @ApiProperty({
    description: 'CA pincode',
    example: '400001',
  })
  pincode: string;

  @ApiProperty({
    description: 'CA qualifications',
    example: ['CA', 'CS'],
    type: [String],
  })
  qualifications: string[];

  @ApiProperty({
    description: 'CA languages',
    example: ['English', 'Hindi'],
    type: [String],
  })
  languages: string[];

  @ApiProperty({
    description: 'CA consultation fee',
    example: 5000,
  })
  consultationFee: number;

  @ApiProperty({
    description: 'CA availability',
    example: '9 AM - 6 PM',
  })
  availability: string;

  @ApiProperty({
    description: 'CA verification status',
    example: true,
  })
  isVerified: boolean;

  @ApiProperty({
    description: 'CA active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'CA verification data',
    example: { documents: ['certificate.pdf'], verifiedAt: '2023-01-01' },
  })
  verificationData: any;

  @ApiProperty({
    description: 'CA registration number',
    example: 'REG123456',
  })
  registrationNumber: string;

  @ApiProperty({
    description: 'CA specialization',
    example: 'Taxation',
  })
  specialization: string;

  @ApiProperty({
    description: 'CA location',
    example: 'Mumbai, Maharashtra',
  })
  location: string;

  @ApiProperty({
    description: 'CA review count',
    example: 25,
  })
  reviewCount: number;

  @ApiProperty({
    description: 'CA email',
    example: 'ca@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'CA phone number',
    example: '+919876543210',
  })
  phone: string;

  @ApiProperty({
    description: 'CA experience in years',
    example: 5,
  })
  experience: string;

  @ApiProperty({
    description: 'CA status',
    example: 'VERIFIED',
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
  })
  status: string;

  @ApiProperty({
    description: 'CA services offered',
    example: ['Tax Filing', 'Audit', 'Consulting'],
    type: [String],
  })
  services: string[];

  @ApiProperty({
    description: 'CA bio',
    example: 'Experienced CA with 5+ years in tax planning',
  })
  bio?: string;

  @ApiProperty({
    description: 'CA rating',
    example: 4.5,
  })
  rating: number;


  @ApiProperty({
    description: 'CA creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'CA last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
