import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'User ID',
    example: 'clh1234567890',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'OTP code',
    example: '123456',
  })
  @IsString()
  otp: string;

  @ApiProperty({
    description: 'New password',
    example: 'newpassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
