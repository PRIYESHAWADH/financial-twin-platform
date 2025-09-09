import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateCADto } from './dto/create-ca.dto';
import { UpdateCADto } from './dto/update-ca.dto';
import { CAResponseDto } from './dto/ca-response.dto';
import { CAVerificationDto } from './dto/ca-verification.dto';
import { CA, CAStatus, CAServiceType } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class CAMarketplaceService {
  private readonly logger = new Logger(CAMarketplaceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createCA(createCADto: CreateCADto, ipAddress: string, userAgent: string): Promise<CAResponseDto> {
    const {
      icaiMemberId,
      email,
      phone,
      firstName,
      lastName,
      pan,
      address,
      city,
      state,
      pincode,
      services,
      experience,
      qualifications,
      languages,
      consultationFee,
      availability,
    } = createCADto;

    // Check if CA already exists
    const existingCA = await this.prisma.cA.findFirst({
      where: {
        OR: [
          { icaiMemberId },
          { email },
          { phone },
          { pan },
        ],
      },
    });

    if (existingCA) {
      throw new BadRequestException('CA with this information already exists');
    }

    // Verify ICAI membership
    const icaiVerification = await this.verifyICAIMembership(icaiMemberId, firstName, lastName);
    
    if (!icaiVerification.isValid) {
      throw new BadRequestException('Invalid ICAI membership details');
    }

    // Create CA profile
    const ca = await this.prisma.cA.create({
      data: {
        icaiMemberId,
        email,
        phone,
        firstName,
        lastName,
        pan,
        address,
        city,
        state,
        pincode,
        services: services as any,
        experience: parseInt(experience),
        qualifications,
        languages,
        consultationFee: parseInt(consultationFee),
        availability,
        status: CAStatus.PENDING_VERIFICATION,
        isVerified: false,
        isActive: true,
        verificationData: {
          icaiVerification,
          submittedAt: new Date().toISOString(),
        } as any,
      },
    });

    // Log audit event
    await this.auditService.logEvent({
      userId: ca.id,
      action: 'ca_registration',
      resource: 'ca',
      result: 'SUCCESS',
      details: {
        icaiMemberId,
        email,
        services: services.length,
      },
      ipAddress,
      userAgent,
    });

    this.logger.log(`CA registered: ${ca.id} (${icaiMemberId})`);
    return this.mapToResponseDto(ca);
  }

  async verifyCA(caId: string, verificationDto: CAVerificationDto, ipAddress: string, userAgent: string): Promise<CAResponseDto> {
    const { verificationStatus, verificationNotes, documents } = verificationDto;

    const ca = await this.prisma.cA.findUnique({
      where: { id: caId },
    });

    if (!ca) {
      throw new NotFoundException('CA not found');
    }

    // Update verification status
    const updatedCA = await this.prisma.cA.update({
      where: { id: caId },
      data: {
        status: verificationStatus === 'APPROVED' ? CAStatus.VERIFIED : CAStatus.REJECTED,
        isVerified: verificationStatus === 'APPROVED',
        verificationData: {
          ...(ca.verificationData as any),
          verificationStatus,
          verificationNotes,
          documents,
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'system', // In real implementation, this would be the admin user ID
        } as any,
        updatedAt: new Date(),
      },
    });

    // Log audit event
    await this.auditService.logEvent({
      userId: caId,
      action: 'ca_verification',
      resource: 'ca',
      result: 'SUCCESS',
      details: {
        verificationStatus,
        verificationNotes,
        documentsCount: documents?.length || 0,
      },
      ipAddress,
      userAgent,
    });

    this.logger.log(`CA verification ${verificationStatus}: ${caId}`);
    return this.mapToResponseDto(updatedCA);
  }

  async searchCAs(
    filters: {
      location?: string;
      services?: string[];
      experience?: number;
      maxFee?: number;
      languages?: string[];
      rating?: number;
    },
    pagination: { page: number; limit: number }
  ): Promise<{ cas: CAResponseDto[]; total: number; page: number; limit: number }> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: CAStatus.VERIFIED,
      isActive: true,
    };

    if (filters.location) {
      where.OR = [
        { city: { contains: filters.location, mode: 'insensitive' } },
        { state: { contains: filters.location, mode: 'insensitive' } },
      ];
    }

    if (filters.services && filters.services.length > 0) {
      where.services = {
        hasSome: filters.services,
      };
    }

    if (filters.experience) {
      where.experience = {
        gte: filters.experience,
      };
    }

    if (filters.maxFee) {
      where.consultationFee = {
        lte: filters.maxFee,
      };
    }

    if (filters.languages && filters.languages.length > 0) {
      where.languages = {
        hasSome: filters.languages,
      };
    }

    if (filters.rating) {
      where.rating = {
        gte: filters.rating,
      };
    }

    // Execute query
    const [cas, total] = await Promise.all([
      this.prisma.cA.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { rating: 'desc' },
          { experience: 'desc' },
          { consultationFee: 'asc' },
        ],
      }),
      this.prisma.cA.count({ where }),
    ]);

    return {
      cas: cas.map(ca => this.mapToResponseDto(ca)),
      total,
      page,
      limit,
    };
  }

  async getCAById(caId: string): Promise<CAResponseDto> {
    const ca = await this.prisma.cA.findUnique({
      where: { id: caId },
    });

    if (!ca) {
      throw new NotFoundException('CA not found');
    }

    return this.mapToResponseDto(ca);
  }

  async updateCA(caId: string, updateCADto: UpdateCADto, ipAddress: string, userAgent: string): Promise<CAResponseDto> {
    const ca = await this.prisma.cA.findUnique({
      where: { id: caId },
    });

    if (!ca) {
      throw new NotFoundException('CA not found');
    }

    const updatedCA = await this.prisma.cA.update({
      where: { id: caId },
      data: {
        ...updateCADto,
        services: updateCADto.services as any,
        experience: updateCADto.experience ? parseInt(updateCADto.experience) : undefined,
        consultationFee: updateCADto.consultationFee ? parseInt(updateCADto.consultationFee) : undefined,
        status: updateCADto.status as any,
        updatedAt: new Date(),
      },
    });

    // Log audit event
    await this.auditService.logEvent({
      userId: caId,
      action: 'ca_profile_update',
      resource: 'ca',
      result: 'SUCCESS',
      details: {
        updatedFields: Object.keys(updateCADto),
      },
      ipAddress,
      userAgent,
    });

    return this.mapToResponseDto(updatedCA);
  }

  async createClientRelationship(
    userId: string,
    caId: string,
    relationshipData: {
      services: string[];
      startDate: string;
      endDate?: string;
      terms: string;
      fee: number;
    },
    ipAddress: string,
    userAgent: string
  ): Promise<any> {
    // Check if CA exists and is verified
    const ca = await this.prisma.cA.findUnique({
      where: { id: caId },
    });

    if (!ca || !ca.isVerified) {
      throw new BadRequestException('CA not found or not verified');
    }

    // Check if relationship already exists
    const existingRelationship = await this.prisma.clientRelationship.findFirst({
      where: {
        userId,
        caId,
        status: 'ACTIVE',
      },
    });

    if (existingRelationship) {
      throw new BadRequestException('Active relationship already exists with this CA');
    }

    // Create client relationship
    const relationship = await this.prisma.clientRelationship.create({
      data: {
        userId,
        caId,
        services: relationshipData.services,
        startDate: new Date(relationshipData.startDate),
        endDate: relationshipData.endDate ? new Date(relationshipData.endDate) : null,
        terms: relationshipData.terms,
        fee: relationshipData.fee,
        status: 'PENDING',
      },
    });

    // Log audit event
    await this.auditService.logEvent({
      userId,
      action: 'client_relationship_created',
      resource: 'client_relationship',
      result: 'SUCCESS',
      details: {
        caId,
        services: relationshipData.services,
        fee: relationshipData.fee,
      },
      ipAddress,
      userAgent,
    });

    return relationship;
  }

  async getClientRelationships(userId: string): Promise<any[]> {
    const relationships = await this.prisma.clientRelationship.findMany({
      where: { userId },
      include: {
        ca: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            services: true,
            rating: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return relationships;
  }

  async getCAClients(caId: string): Promise<any[]> {
    const relationships = await this.prisma.clientRelationship.findMany({
      where: { caId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return relationships;
  }

  async rateCA(userId: string, caId: string, rating: number, review: string, ipAddress: string, userAgent: string): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Check if user has a relationship with this CA
    const relationship = await this.prisma.clientRelationship.findFirst({
      where: {
        userId,
        caId,
        status: 'ACTIVE',
      },
    });

    if (!relationship) {
      throw new BadRequestException('You can only rate CAs you have an active relationship with');
    }

    // Check if user has already rated this CA
    const existingRating = await this.prisma.cARating.findFirst({
      where: {
        userId,
        caId,
      },
    });

    if (existingRating) {
      throw new BadRequestException('You have already rated this CA');
    }

    // Create rating
    await this.prisma.cARating.create({
      data: {
        userId,
        caId,
        rating,
        review,
      },
    });

    // Update CA's average rating
    await this.updateCAAverageRating(caId);

    // Log audit event
    await this.auditService.logEvent({
      userId,
      action: 'ca_rating_submitted',
      resource: 'ca_rating',
      result: 'SUCCESS',
      details: {
        caId,
        rating,
        reviewLength: review.length,
      },
      ipAddress,
      userAgent,
    });
  }

  async getCARatings(caId: string): Promise<any[]> {
    const ratings = await this.prisma.cARating.findMany({
      where: { caId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return ratings;
  }

  async getCAStatistics(caId: string): Promise<any> {
    const [
      totalClients,
      activeClients,
      totalRatings,
      averageRating,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.clientRelationship.count({
        where: { caId },
      }),
      this.prisma.clientRelationship.count({
        where: { caId, status: 'ACTIVE' },
      }),
      this.prisma.cARating.count({
        where: { caId },
      }),
      this.prisma.cARating.aggregate({
        where: { caId },
        _avg: { rating: true },
      }),
      this.prisma.clientRelationship.aggregate({
        where: { caId, status: 'ACTIVE' },
        _sum: { fee: true },
      }),
    ]);

    return {
      totalClients,
      activeClients,
      totalRatings,
      averageRating: averageRating._avg.rating || 0,
      totalRevenue: totalRevenue._sum.fee || 0,
    };
  }

  async getMarketplaceStatistics(): Promise<any> {
    const [
      totalCAs,
      verifiedCAs,
      totalClients,
      totalRelationships,
      averageRating,
    ] = await Promise.all([
      this.prisma.cA.count(),
      this.prisma.cA.count({
        where: { isVerified: true },
      }),
      this.prisma.user.count({
        where: { role: 'USER' },
      }),
      this.prisma.clientRelationship.count(),
      this.prisma.cARating.aggregate({
        _avg: { rating: true },
      }),
    ]);

    return {
      totalCAs,
      verifiedCAs,
      totalClients,
      totalRelationships,
      averageRating: averageRating._avg.rating || 0,
      verificationRate: totalCAs > 0 ? (verifiedCAs / totalCAs) * 100 : 0,
    };
  }

  private async verifyICAIMembership(icaiMemberId: string, firstName: string, lastName: string): Promise<any> {
    // In a real implementation, this would call the ICAI API or scrape their website
    // For now, we'll simulate the verification process
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock verification logic
      const isValid = this.validateICAIMemberId(icaiMemberId);
      
      if (!isValid) {
        return {
          isValid: false,
          error: 'Invalid ICAI member ID format',
        };
      }

      // Simulate name matching
      const nameMatch = this.simulateNameVerification(icaiMemberId, firstName, lastName);
      
      return {
        isValid: nameMatch,
        memberId: icaiMemberId,
        verifiedAt: new Date().toISOString(),
        source: 'ICAI_API',
        error: nameMatch ? null : 'Name does not match ICAI records',
      };
    } catch (error) {
      this.logger.error('ICAI verification failed:', error);
      return {
        isValid: false,
        error: 'ICAI verification service unavailable',
      };
    }
  }

  private validateICAIMemberId(icaiMemberId: string): boolean {
    // ICAI member ID format validation
    const pattern = /^[A-Z]{2}[0-9]{6}$/;
    return pattern.test(icaiMemberId);
  }

  private simulateNameVerification(icaiMemberId: string, firstName: string, lastName: string): boolean {
    // Simulate name verification - in real implementation, this would check against ICAI database
    // For demo purposes, we'll accept most valid-looking names
    return firstName.length >= 2 && lastName.length >= 2;
  }

  private async updateCAAverageRating(caId: string): Promise<void> {
    const ratings = await this.prisma.cARating.findMany({
      where: { caId },
      select: { rating: true },
    });

    if (ratings.length === 0) return;

    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await this.prisma.cA.update({
      where: { id: caId },
      data: { rating: Math.round(averageRating * 10) / 10 }, // Round to 1 decimal place
    });
  }

  private mapToResponseDto(ca: CA): CAResponseDto {
    return {
      id: ca.id,
      name: (ca as any).name,
      icaiMemberId: ca.icaiMemberId,
      email: ca.email,
      phone: ca.phone,
      firstName: ca.firstName,
      lastName: ca.lastName,
      pan: ca.pan,
      address: ca.address,
      city: ca.city,
      state: ca.state,
      pincode: ca.pincode,
      services: ca.services,
      experience: ca.experience.toString(),
      qualifications: ca.qualifications,
      languages: ca.languages,
      consultationFee: ca.consultationFee,
      availability: ca.availability,
      rating: ca.rating,
      status: ca.status,
      isVerified: ca.isVerified,
      isActive: ca.isActive,
      verificationData: ca.verificationData,
      registrationNumber: (ca as any).registrationNumber,
      specialization: (ca as any).specialization,
      location: (ca as any).location,
      reviewCount: (ca as any).reviewCount,
      createdAt: ca.createdAt,
      updatedAt: ca.updatedAt,
    };
  }
}
