import { IsString, Length, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'User ID',
    example: 'clh1234567890',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'OTP code sent to user',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @Length(6, 6)
  otp: string;

  @ApiProperty({
    description: 'OTP type',
    example: 'EMAIL_VERIFICATION',
    enum: ['EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'PASSWORD_RESET'],
  })
  @IsEnum(['EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'PASSWORD_RESET'])
  type: string;
}
