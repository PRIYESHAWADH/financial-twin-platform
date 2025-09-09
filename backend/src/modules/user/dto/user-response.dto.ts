import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'clh1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+919876543210',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'User PAN number',
    example: 'ABCDE1234F',
  })
  pan: string;

  @ApiProperty({
    description: 'Verification status',
    example: true,
  })
  isVerified: boolean;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    enum: ['USER', 'CA', 'ADMIN'],
  })
  role: string;


  @ApiProperty({
    description: 'User creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
