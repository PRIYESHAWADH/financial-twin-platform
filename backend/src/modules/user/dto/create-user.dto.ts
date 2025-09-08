import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+919876543210',
  })
  @IsPhoneNumber('IN')
  phone: string;

  @ApiProperty({
    description: 'User PAN number',
    example: 'ABCDE1234F',
  })
  @IsString()
  pan: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    enum: ['USER', 'CA', 'ADMIN'],
  })
  @IsEnum(['USER', 'CA', 'ADMIN'])
  role: string;
}
