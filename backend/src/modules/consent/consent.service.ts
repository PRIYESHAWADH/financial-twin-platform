import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { ConsentResponseDto } from './dto/consent-response.dto';
import { Consent, ConsentStatus, ConsentType } from '@prisma/client';

@Injectable()
export class ConsentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createConsent(
    userId: string,
    createConsentDto: CreateConsentDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<ConsentResponseDto> {
    const {
      consentType,
      purpose,
      dataTypes,
      dataFiduciaries,
      expiryDate,
      frequency,
      dataRetentionPeriod,
    } = createConsentDto;

    // Validate consent type
    if (!Object.values(ConsentType).includes(consentType as any)) {
      throw new BadRequestException('Invalid consent type');
    }

    // Create consent artefact
    const consentArtefact = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      consentId: this.generateConsentId(),
      purpose: {
        code: purpose,
        text: this.getPurposeText(purpose),
        refUri: this.getPurposeRefUri(purpose),
      },
      dataFiduciaries: dataFiduciaries.map(fiduciary => ({
        fid: (fiduciary as any).fid,
        name: (fiduciary as any).name,
        logo: (fiduciary as any).logo,
        contact: (fiduciary as any).contact,
      })),
      dataTypes: dataTypes.map(dataType => ({
        code: (dataType as any).code,
        description: (dataType as any).description,
        sensitivity: (dataType as any).sensitivity,
        category: (dataType as any).category,
      })),
      dataLife: {
        unit: 'YEAR',
        value: dataRetentionPeriod || 1,
      },
      frequency: {
        unit: (frequency as any)?.unit || 'ONCE',
        value: (frequency as any)?.value || 1,
      },
      consentStart: new Date().toISOString(),
      consentEnd: expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year default
      consentMode: 'STORE',
      consentTypes: ['PROFILE', 'SUMMARY'],
      fiTypes: ['DEPOSIT', 'CREDIT_CARD', 'TERM_DEPOSIT', 'MUTUAL_FUND', 'EQUITY', 'BOND'],
      dataConsumer: {
        id: 'fintwin-ai',
        name: 'FinTwin AI',
        logo: 'https://fintwin.ai/logo.png',
        contact: 'support@fintwin.ai',
      },
      purposeCategory: 'FINANCIAL_SERVICES',
      collectionMethod: 'API',
      collectionMode: 'DIGITAL',
      thirdPartyDisclosure: false,
      thirdPartyName: null,
      thirdPartyPurpose: null,
      thirdPartyDataTypes: null,
    };

    // Create consent record
    const consent = await this.prisma.consent.create({
      data: {
        userId,
        consentType: consentType as any,
        consentArtefact: consentArtefact as any,
        status: ConsentStatus.ACTIVE,
        grantedAt: new Date(),
        expiresAt: new Date(consentArtefact.consentEnd),
        dataRetentionPeriod: parseInt(dataRetentionPeriod) || 1,
      },
    });

    // Log audit event
    await this.auditService.logEvent({
      userId,
      action: 'consent_granted',
      resource: 'consent',
      result: 'SUCCESS',
      details: {
        consentId: consent.id,
        consentType,
        purpose,
        dataTypes: dataTypes.map((dt: any) => dt.code),
      },
      ipAddress,
      userAgent,
    });

    return this.mapToResponseDto(consent);
  }

  async getConsents(userId: string): Promise<ConsentResponseDto[]> {
    const consents = await this.prisma.consent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return consents.map(consent => this.mapToResponseDto(consent));
  }

  async getConsentById(userId: string, consentId: string): Promise<ConsentResponseDto> {
    const consent = await this.prisma.consent.findFirst({
      where: {
        id: consentId,
        userId,
      },
    });

    if (!consent) {
      throw new NotFoundException('Consent not found');
    }

    return this.mapToResponseDto(consent);
  }

  async updateConsent(
    userId: string,
    consentId: string,
    updateConsentDto: UpdateConsentDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<ConsentResponseDto> {
    const consent = await this.prisma.consent.findFirst({
      where: {
        id: consentId,
        userId,
      },
    });

    if (!consent) {
      throw new NotFoundException('Consent not found');
    }

    // Update consent
    const updatedConsent = await this.prisma.consent.update({
      where: { id: consentId },
      data: {
        status: updateConsentDto.status as any,
        consentType: updateConsentDto.consentType as any,
        dataRetentionPeriod: updateConsentDto.dataRetentionPeriod ? parseInt(updateConsentDto.dataRetentionPeriod) : undefined,
        updatedAt: new Date(),
      },
    });

    // Log audit event
    await this.auditService.logEvent({
      userId,
      action: 'consent_updated',
      resource: 'consent',
      result: 'SUCCESS',
      details: {
        consentId,
        changes: updateConsentDto,
      },
      ipAddress,
      userAgent,
    });

    return this.mapToResponseDto(updatedConsent);
  }

  async revokeConsent(
    userId: string,
    consentId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ message: string }> {
    const consent = await this.prisma.consent.findFirst({
      where: {
        id: consentId,
        userId,
      },
    });

    if (!consent) {
      throw new NotFoundException('Consent not found');
    }

    // Revoke consent
    await this.prisma.consent.update({
      where: { id: consentId },
      data: {
        status: ConsentStatus.REVOKED,
        revokedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Log audit event
    await this.auditService.logEvent({
      userId,
      action: 'consent_revoked',
      resource: 'consent',
      result: 'SUCCESS',
      details: {
        consentId,
        consentType: consent.consentType,
      },
      ipAddress,
      userAgent,
    });

    return { message: 'Consent revoked successfully' };
  }

  async getActiveConsents(userId: string): Promise<ConsentResponseDto[]> {
    const consents = await this.prisma.consent.findMany({
      where: {
        userId,
        status: ConsentStatus.ACTIVE,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return consents.map(consent => this.mapToResponseDto(consent));
  }

  async getConsentHistory(userId: string): Promise<ConsentResponseDto[]> {
    const consents = await this.prisma.consent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return consents.map(consent => this.mapToResponseDto(consent));
  }

  async checkDataAccessPermission(
    userId: string,
    dataType: string,
    purpose: string,
  ): Promise<boolean> {
    const consent = await this.prisma.consent.findFirst({
      where: {
        userId,
        status: ConsentStatus.ACTIVE,
        expiresAt: {
          gt: new Date(),
        },
        consentArtefact: {
          path: ['purpose', 'code'],
          equals: purpose,
        },
      },
    });

    if (!consent) {
      return false;
    }

    // Check if data type is covered by consent
    const consentArtefact = consent.consentArtefact as any;
    const dataTypes = consentArtefact.dataTypes || [];
    
    return dataTypes.some((dt: any) => dt.code === dataType);
  }

  async getConsentSummary(userId: string): Promise<any> {
    const consents = await this.prisma.consent.findMany({
      where: { userId },
    });

    const summary = {
      total: consents.length,
      active: consents.filter(c => c.status === ConsentStatus.ACTIVE).length,
      revoked: consents.filter(c => c.status === ConsentStatus.REVOKED).length,
      expired: consents.filter(c => c.expiresAt < new Date()).length,
      byType: {},
      byPurpose: {},
    };

    // Group by consent type
    consents.forEach(consent => {
      summary.byType[consent.consentType] = (summary.byType[consent.consentType] || 0) + 1;
    });

    // Group by purpose
    consents.forEach(consent => {
      const consentArtefact = consent.consentArtefact as any;
      const purpose = consentArtefact?.purpose?.code || 'unknown';
      summary.byPurpose[purpose] = (summary.byPurpose[purpose] || 0) + 1;
    });

    return summary;
  }

  private generateConsentId(): string {
    return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getPurposeText(purpose: string): string {
    const purposeTexts = {
      'FINANCIAL_ANALYSIS': 'Financial analysis and insights generation',
      'TAX_FILING': 'Tax return preparation and filing',
      'INVESTMENT_ADVICE': 'Investment recommendations and portfolio analysis',
      'CREDIT_ASSESSMENT': 'Creditworthiness evaluation',
      'FRAUD_DETECTION': 'Fraud detection and prevention',
      'COMPLIANCE': 'Regulatory compliance and reporting',
    };
    return purposeTexts[purpose] || purpose;
  }

  private getPurposeRefUri(purpose: string): string {
    return `https://fintwin.ai/purposes/${purpose.toLowerCase()}`;
  }

  private mapToResponseDto(consent: Consent): ConsentResponseDto {
    const consentArtefact = consent.consentArtefact as any;
    
    return {
      id: consent.id,
      userId: consent.userId,
      type: (consent as any).type,
      consentType: consent.consentType,
      status: consent.status,
      purpose: consentArtefact?.purpose?.code || 'unknown',
      dataCategories: (consent as any).dataCategories || [],
      dataTypes: (consentArtefact as any)?.dataTypes?.map((dt: any) => ({
        code: dt.code,
        description: dt.description,
        sensitivity: dt.sensitivity,
        category: dt.category,
      })) || [],
      dataFiduciaries: consentArtefact?.dataFiduciaries?.map((df: any) => ({
        fid: df.fid,
        name: df.name,
        logo: df.logo,
        contact: df.contact,
      })) || [],
      metadata: (consent as any).metadata,
      grantedAt: consent.grantedAt,
      expiresAt: consent.expiresAt,
      revokedAt: consent.revokedAt,
      dataRetentionPeriod: consent.dataRetentionPeriod,
      createdAt: consent.createdAt,
      updatedAt: consent.updatedAt,
    };
  }
}
