import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogResponseDto } from './dto/audit-log-response.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logEvent(eventData: CreateAuditLogDto): Promise<AuditLogResponseDto> {
    try {
      // Get the last audit log for hash chaining
      const lastAuditLog = await this.prisma.auditLog.findFirst({
        where: { userId: eventData.userId },
        orderBy: { createdAt: 'desc' },
      });

      // Create current hash
      const currentData = {
        userId: eventData.userId,
        action: eventData.action,
        resource: eventData.resource,
        details: eventData.details,
        ipAddress: eventData.ipAddress,
        userAgent: eventData.userAgent,
        timestamp: new Date().toISOString(),
      };

      const currentHash = this.generateHash(JSON.stringify(currentData));
      
      // Create hash chain
      const previousHash = lastAuditLog?.currentHash || null;
      const hashChain = previousHash ? 
        this.generateHash(previousHash + currentHash) : 
        currentHash;

      // Store audit log
      const auditLog = await this.prisma.auditLog.create({
        data: {
          userId: eventData.userId,
          action: eventData.action,
          resource: eventData.resource,
          details: eventData.details,
          ipAddress: eventData.ipAddress,
          userAgent: eventData.userAgent,
          previousHash,
          currentHash,
          hashChain,
        },
      });

      this.logger.log(`Audit log created: ${auditLog.id} for user: ${eventData.userId}`);
      return this.mapToResponseDto(auditLog);
    } catch (error) {
      this.logger.error('Failed to create audit log:', error);
      throw error;
    }
  }

  async getAuditLogs(
    userId: string,
    filters: {
      action?: string;
      resource?: string;
      startDate?: Date;
      endDate?: Date;
      ipAddress?: string;
    },
    pagination: { page: number; limit: number }
  ): Promise<{ logs: AuditLogResponseDto[]; total: number; page: number; limit: number }> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.resource) {
      where.resource = filters.resource;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    if (filters.ipAddress) {
      where.ipAddress = filters.ipAddress;
    }

    // Execute query
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs: logs.map(log => this.mapToResponseDto(log)),
      total,
      page,
      limit,
    };
  }

  async getAuditLogById(logId: string): Promise<AuditLogResponseDto> {
    const log = await this.prisma.auditLog.findUnique({
      where: { id: logId },
    });

    if (!log) {
      throw new Error('Audit log not found');
    }

    return this.mapToResponseDto(log);
  }

  async verifyAuditChain(userId: string): Promise<{
    isValid: boolean;
    totalLogs: number;
    corruptedLogs: string[];
    verificationDetails: any[];
  }> {
    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    if (logs.length === 0) {
      return {
        isValid: true,
        totalLogs: 0,
        corruptedLogs: [],
        verificationDetails: [],
      };
    }

    const corruptedLogs: string[] = [];
    const verificationDetails: any[] = [];
    let isValid = true;

    for (let i = 0; i < logs.length; i++) {
      const currentLog = logs[i];
      const verification = {
        logId: currentLog.id,
        timestamp: currentLog.createdAt,
        action: currentLog.action,
        resource: currentLog.resource,
        hashVerification: false,
        chainVerification: false,
      };

      // Verify current hash
      const currentData = {
        userId: currentLog.userId,
        action: currentLog.action,
        resource: currentLog.resource,
        details: currentLog.details,
        ipAddress: currentLog.ipAddress,
        userAgent: currentLog.userAgent,
        timestamp: currentLog.createdAt.toISOString(),
      };

      const expectedCurrentHash = this.generateHash(JSON.stringify(currentData));
      verification.hashVerification = currentLog.currentHash === expectedCurrentHash;

      if (!verification.hashVerification) {
        isValid = false;
        corruptedLogs.push(currentLog.id);
      }

      // Verify hash chain
      if (i === 0) {
        // First log should have no previous hash
        verification.chainVerification = currentLog.previousHash === null;
      } else {
        // Subsequent logs should have previous hash and correct chain
        const previousLog = logs[i - 1];
        const expectedPreviousHash = previousLog.currentHash;
        const expectedChainHash = this.generateHash(expectedPreviousHash + currentLog.currentHash);
        
        verification.chainVerification = 
          currentLog.previousHash === expectedPreviousHash &&
          currentLog.hashChain === expectedChainHash;
      }

      if (!verification.chainVerification) {
        isValid = false;
        corruptedLogs.push(currentLog.id);
      }

      verificationDetails.push(verification);
    }

    return {
      isValid,
      totalLogs: logs.length,
      corruptedLogs,
      verificationDetails,
    };
  }

  async getAuditStatistics(userId: string): Promise<{
    totalLogs: number;
    actionsByType: Record<string, number>;
    resourcesByType: Record<string, number>;
    activityByDay: Record<string, number>;
    ipAddresses: string[];
    userAgents: string[];
    lastActivity: Date | null;
  }> {
    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const statistics = {
      totalLogs: logs.length,
      actionsByType: {} as Record<string, number>,
      resourcesByType: {} as Record<string, number>,
      activityByDay: {} as Record<string, number>,
      ipAddresses: [] as string[],
      userAgents: [] as string[],
      lastActivity: logs.length > 0 ? logs[0].createdAt : null,
    };

    // Process logs
    logs.forEach(log => {
      // Count actions
      statistics.actionsByType[log.action] = (statistics.actionsByType[log.action] || 0) + 1;
      
      // Count resources
      statistics.resourcesByType[log.resource] = (statistics.resourcesByType[log.resource] || 0) + 1;
      
      // Count activity by day
      const day = log.createdAt.toISOString().split('T')[0];
      statistics.activityByDay[day] = (statistics.activityByDay[day] || 0) + 1;
      
      // Collect unique IP addresses
      if (log.ipAddress && !statistics.ipAddresses.includes(log.ipAddress)) {
        statistics.ipAddresses.push(log.ipAddress);
      }
      
      // Collect unique user agents
      if (log.userAgent && !statistics.userAgents.includes(log.userAgent)) {
        statistics.userAgents.push(log.userAgent);
      }
    });

    return statistics;
  }

  async exportAuditLogs(
    userId: string,
    format: 'json' | 'csv',
    filters: {
      startDate?: Date;
      endDate?: Date;
      actions?: string[];
      resources?: string[];
    }
  ): Promise<string> {
    const where: any = { userId };

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    if (filters.actions && filters.actions.length > 0) {
      where.action = { in: filters.actions };
    }

    if (filters.resources && filters.resources.length > 0) {
      where.resource = { in: filters.resources };
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'json') {
      return JSON.stringify(logs.map(log => this.mapToResponseDto(log)), null, 2);
    } else if (format === 'csv') {
      const csvHeader = 'ID,User ID,Action,Resource,Details,IP Address,User Agent,Previous Hash,Current Hash,Hash Chain,Created At\n';
      const csvRows = logs.map(log => {
        const details = typeof log.details === 'object' ? JSON.stringify(log.details) : log.details;
        return [
          log.id,
          log.userId,
          log.action,
          log.resource,
          `"${details}"`,
          log.ipAddress,
          `"${log.userAgent}"`,
          log.previousHash,
          log.currentHash,
          log.hashChain,
          log.createdAt.toISOString(),
        ].join(',');
      }).join('\n');
      
      return csvHeader + csvRows;
    }

    throw new Error('Unsupported export format');
  }

  async getSecurityAlerts(userId: string): Promise<{
    suspiciousIPs: string[];
    unusualActivity: any[];
    failedLogins: number;
    dataAccessAnomalies: any[];
  }> {
    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const alerts = {
      suspiciousIPs: [] as string[],
      unusualActivity: [] as any[],
      failedLogins: 0,
      dataAccessAnomalies: [] as any[],
    };

    // Analyze IP addresses
    const ipCounts: Record<string, number> = {};
    const ipTimestamps: Record<string, Date[]> = {};

    logs.forEach(log => {
      if (log.ipAddress) {
        ipCounts[log.ipAddress] = (ipCounts[log.ipAddress] || 0) + 1;
        if (!ipTimestamps[log.ipAddress]) {
          ipTimestamps[log.ipAddress] = [];
        }
        ipTimestamps[log.ipAddress].push(log.createdAt);
      }
    });

    // Find suspicious IPs (unusual access patterns)
    Object.entries(ipCounts).forEach(([ip, count]) => {
      if (count > 10) { // Threshold for suspicious activity
        const timestamps = ipTimestamps[ip];
        const timeSpan = timestamps[timestamps.length - 1].getTime() - timestamps[0].getTime();
        const hours = timeSpan / (1000 * 60 * 60);
        
        if (hours < 1 && count > 5) { // Many requests in short time
          alerts.suspiciousIPs.push(ip);
        }
      }
    });

    // Count failed logins
    alerts.failedLogins = logs.filter(log => 
      log.action === 'login' && 
      log.details && 
      typeof log.details === 'object' && 
      (log.details as any).success === false
    ).length;

    // Find unusual activity patterns
    const actionCounts: Record<string, number> = {};
    logs.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });

    Object.entries(actionCounts).forEach(([action, count]) => {
      if (count > 50) { // Threshold for unusual activity
        alerts.unusualActivity.push({
          action,
          count,
          severity: count > 100 ? 'high' : 'medium',
        });
      }
    });

    // Find data access anomalies
    const dataAccessLogs = logs.filter(log => 
      log.resource === 'financial_data' || 
      log.resource === 'consent' ||
      log.resource === 'user'
    );

    if (dataAccessLogs.length > 20) {
      alerts.dataAccessAnomalies.push({
        type: 'excessive_data_access',
        count: dataAccessLogs.length,
        severity: 'high',
      });
    }

    return alerts;
  }

  private generateHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private mapToResponseDto(log: any): AuditLogResponseDto {
    return {
      id: log.id,
      userId: log.userId,
      action: log.action,
      resource: log.resource,
      result: log.result,
      details: log.details,
      metadata: log.metadata,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      previousHash: log.previousHash,
      currentHash: log.currentHash,
      hashChain: log.hashChain,
      createdAt: log.createdAt,
    };
  }
}
