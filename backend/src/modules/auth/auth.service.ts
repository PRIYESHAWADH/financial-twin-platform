import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/services/prisma.service';
import { UserService } from '../user/user.service';
import { ConsentService } from '../consent/consent.service';
import { AuditService } from '../audit/audit.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly consentService: ConsentService,
    private readonly auditService: AuditService,
  ) {}

  async register(registerDto: RegisterDto, ipAddress: string, userAgent: string) {
    const { email, phone, password, firstName, lastName, pan } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
          { pan },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email, phone, or PAN already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        firstName,
        lastName,
        pan,
        isActive: true,
        isVerified: false,
      },
    });

    // Generate OTP
    const otp = this.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    await this.prisma.oTP.create({
      data: {
        userId: user.id,
        otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt: otpExpiry,
      },
    });

    // Send OTP (in production, this would send actual SMS/email)
    await this.sendOTP(phone, otp);

    // Log audit event
    await this.auditService.logEvent({
      userId: user.id,
      action: 'user_registration',
      resource: 'user',
      result: 'SUCCESS',
      details: { email, phone, pan: pan.substring(0, 3) + '****' + pan.substring(7) },
      ipAddress,
      userAgent,
    });

    return {
      message: 'User registered successfully. Please verify your phone number.',
      userId: user.id,
      requiresVerification: true,
    };
  }

  async verifyOTP(verifyOtpDto: VerifyOtpDto, ipAddress: string, userAgent: string) {
    const { userId, otp, type } = verifyOtpDto;

    // Find OTP record
    const otpRecord = await this.prisma.oTP.findFirst({
      where: {
        userId,
        otp,
        type: type as any,
        expiresAt: {
          gt: new Date(),
        },
        isUsed: false,
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark OTP as used
    await this.prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { isUsed: true, usedAt: new Date() },
    });

    // Update user verification status
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    // Log audit event
    await this.auditService.logEvent({
      userId: user.id,
      action: 'otp_verification',
      resource: 'user',
      result: 'SUCCESS',
      details: { type, verified: true },
      ipAddress,
      userAgent,
    });

    return {
      message: 'Phone number verified successfully',
      user: this.sanitizeUser(user),
    };
  }

  async login(loginDto: LoginDto, ipAddress: string, userAgent: string) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your phone number first');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Log audit event
    await this.auditService.logEvent({
      userId: user.id,
      action: 'login',
      resource: 'authentication',
      result: 'SUCCESS',
      details: { method: 'password', success: true },
      ipAddress,
      userAgent,
    });

    return {
      message: 'Login successful',
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto, ipAddress: string, userAgent: string) {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Find user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Log audit event
      await this.auditService.logEvent({
        userId: user.id,
        action: 'token_refresh',
        resource: 'authentication',
        result: 'SUCCESS',
        details: { success: true },
        ipAddress,
        userAgent,
      });

      return {
        message: 'Token refreshed successfully',
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, ipAddress: string, userAgent: string) {
    // In a production system, you might want to blacklist the token
    // For now, we'll just log the logout event

    await this.auditService.logEvent({
      userId,
      action: 'logout',
      resource: 'authentication',
      result: 'SUCCESS',
      details: { success: true },
      ipAddress,
      userAgent,
    });

    return {
      message: 'Logout successful',
    };
  }

  async forgotPassword(email: string, ipAddress: string, userAgent: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return {
        message: 'If the email exists, a password reset link has been sent',
      };
    }

    // Generate OTP
    const otp = this.generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store OTP
    await this.prisma.oTP.create({
      data: {
        userId: user.id,
        otp,
        type: 'PASSWORD_RESET',
        expiresAt: otpExpiry,
      },
    });

    // Send OTP (in production, this would send actual email)
    await this.sendOTP(user.phone, otp);

    // Log audit event
    await this.auditService.logEvent({
      userId: user.id,
      action: 'password_reset_requested',
      resource: 'authentication',
      result: 'SUCCESS',
      details: { email },
      ipAddress,
      userAgent,
    });

    return {
      message: 'If the email exists, a password reset OTP has been sent',
    };
  }

  async resetPassword(userId: string, otp: string, newPassword: string, ipAddress: string, userAgent: string) {
    // Find OTP record
    const otpRecord = await this.prisma.oTP.findFirst({
      where: {
        userId,
        otp,
        type: 'PASSWORD_RESET',
        expiresAt: {
          gt: new Date(),
        },
        isUsed: false,
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark OTP as used
    await this.prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { isUsed: true, usedAt: new Date() },
    });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Log audit event
    await this.auditService.logEvent({
      userId,
      action: 'password_reset',
      resource: 'authentication',
      result: 'SUCCESS',
      details: { success: true },
      ipAddress,
      userAgent,
    });

    return {
      message: 'Password reset successfully',
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  private async generateTokens(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendOTP(phone: string, otp: string): Promise<void> {
    // In production, integrate with SMS provider like Twilio
    console.log(`SMS to ${phone}: Your FinTwin verification code is ${otp}. Valid for 10 minutes.`);
    
    // For development, you might want to store OTP in a way that's accessible for testing
    // This could be a separate development-only endpoint or logged to a file
  }

  private sanitizeUser(user: User): Partial<User> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
