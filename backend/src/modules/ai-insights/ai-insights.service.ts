import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { RAGService } from '../rag/rag.service';
import { ConfigService } from '@nestjs/config';
import { CreateAIInsightDto } from './dto/create-ai-insight.dto';
import { AIInsightResponseDto } from './dto/ai-insight-response.dto';
import { AIInsightType, AIInsightPriority } from '@prisma/client';

@Injectable()
export class AIInsightsService {
  private readonly logger = new Logger(AIInsightsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ragService: RAGService,
    private readonly configService: ConfigService,
  ) {}

  async generateFinancialInsights(userId: string): Promise<AIInsightResponseDto[]> {
    try {
      this.logger.log(`Generating financial insights for user: ${userId}`);

      // Get user's financial data
      const financialData = await this.getUserFinancialData(userId);
      
      // Generate different types of insights
      const insights = await Promise.all([
        this.generateTaxOptimizationInsights(userId, financialData),
        this.generateExpenseAnalysisInsights(userId, financialData),
        this.generateInvestmentInsights(userId, financialData),
        this.generateCashFlowInsights(userId, financialData),
        this.generateRiskAssessmentInsights(userId, financialData),
      ]);

      // Flatten and filter insights
      const allInsights = insights.flat().filter(insight => insight !== null);

      // Store insights in database
      const storedInsights = await Promise.all(
        allInsights.map(insight => this.storeInsight(userId, insight))
      );

      this.logger.log(`Generated ${storedInsights.length} insights for user: ${userId}`);
      return storedInsights;
    } catch (error) {
      this.logger.error(`Failed to generate insights for user ${userId}:`, error);
      throw error;
    }
  }

  private async generateTaxOptimizationInsights(userId: string, financialData: any): Promise<any[]> {
    const insights = [];

    try {
      // Analyze income and deductions
      const income = this.calculateTotalIncome(financialData);
      const currentDeductions = this.calculateCurrentDeductions(financialData);
      const taxSlab = this.determineTaxSlab(income);

      // Section 80C optimization
      const section80CLimit = 150000;
      const current80C = currentDeductions.section80C || 0;
      const potential80CSavings = Math.min(section80CLimit - current80C, income * 0.1);

      if (potential80CSavings > 0) {
        insights.push({
          type: AIInsightType.TAX_OPTIMIZATION,
          priority: AIInsightPriority.HIGH,
          title: 'Section 80C Tax Savings Opportunity',
          description: `You can save ₹${Math.round(potential80CSavings * 0.3)} in taxes by investing ₹${Math.round(potential80CSavings)} in ELSS funds under Section 80C.`,
          recommendation: 'Consider investing in ELSS mutual funds to maximize your Section 80C deduction.',
          confidence: 0.92,
          actionable: true,
          estimatedSavings: Math.round(potential80CSavings * 0.3),
          deadline: 'March 31, 2024',
          citations: ['Section 80C, Income Tax Act, 1961'],
          metadata: {
            currentDeduction: current80C,
            maxDeduction: section80CLimit,
            potentialInvestment: Math.round(potential80CSavings),
            taxSlab: taxSlab
          }
        });
      }

      // HRA optimization
      const hraOptimization = this.analyzeHRAOptimization(financialData);
      if (hraOptimization.potentialSavings > 0) {
        insights.push({
          type: AIInsightType.TAX_OPTIMIZATION,
          priority: AIInsightPriority.MEDIUM,
          title: 'HRA Optimization Opportunity',
          description: `You can save ₹${Math.round(hraOptimization.potentialSavings)} by optimizing your HRA claim.`,
          recommendation: hraOptimization.recommendation,
          confidence: 0.85,
          actionable: true,
          estimatedSavings: Math.round(hraOptimization.potentialSavings),
          citations: ['Section 10(13A), Income Tax Act, 1961'],
          metadata: hraOptimization.metadata
        });
      }

      // Medical insurance optimization
      const medicalInsuranceOptimization = this.analyzeMedicalInsurance(financialData);
      if (medicalInsuranceOptimization.potentialSavings > 0) {
        insights.push({
          type: AIInsightType.TAX_OPTIMIZATION,
          priority: AIInsightPriority.MEDIUM,
          title: 'Medical Insurance Tax Benefit',
          description: `You can save ₹${Math.round(medicalInsuranceOptimization.potentialSavings)} by claiming medical insurance premium under Section 80D.`,
          recommendation: 'Consider purchasing health insurance for yourself and family members to maximize Section 80D deduction.',
          confidence: 0.88,
          actionable: true,
          estimatedSavings: Math.round(medicalInsuranceOptimization.potentialSavings),
          citations: ['Section 80D, Income Tax Act, 1961'],
          metadata: medicalInsuranceOptimization.metadata
        });
      }

    } catch (error) {
      this.logger.error('Error generating tax optimization insights:', error);
    }

    return insights;
  }

  private async generateExpenseAnalysisInsights(userId: string, financialData: any): Promise<any[]> {
    const insights = [];

    try {
      const expenses = this.categorizeExpenses(financialData);
      const monthlyAverage = this.calculateMonthlyAverage(expenses);
      const trends = this.analyzeExpenseTrends(expenses);

      // High spending categories
      const highSpendingCategories = Object.entries(monthlyAverage)
        .filter(([category, amount]) => (amount as number) > 10000)
        .sort(([,a], [,b]) => (b as number) - (a as number));

      for (const [category, amount] of highSpendingCategories.slice(0, 3)) {
        const trend = trends[category] || 0;
        const trendText = trend > 0.1 ? 'increasing' : trend < -0.1 ? 'decreasing' : 'stable';
        
        insights.push({
          type: AIInsightType.EXPENSE_ANALYSIS,
          priority: trend > 0.1 ? AIInsightPriority.HIGH : AIInsightPriority.MEDIUM,
          title: `${category} Spending Analysis`,
          description: `Your ${category} expenses are ₹${Math.round(amount as number)} per month and ${trendText} by ${Math.round(Math.abs(trend) * 100)}%.`,
          recommendation: this.getExpenseRecommendation(category, amount as number, trend),
          confidence: 0.78,
          actionable: true,
          metadata: {
            category,
            monthlyAmount: Math.round(amount as number),
            trend: trend,
            trendText
          }
        });
      }

      // Budget recommendations
      const totalMonthlyExpenses = Object.values(monthlyAverage).reduce((sum: number, amount: unknown) => sum + (amount as number), 0);
      const income = this.calculateTotalIncome(financialData);
      const savingsRate = income > 0 ? (income - (totalMonthlyExpenses as number)) / income : 0;

      if (savingsRate < 0.2) {
        insights.push({
          type: AIInsightType.EXPENSE_ANALYSIS,
          priority: AIInsightPriority.HIGH,
          title: 'Low Savings Rate Alert',
          description: `Your current savings rate is ${Math.round(savingsRate * 100)}%, which is below the recommended 20%.`,
          recommendation: 'Consider reducing discretionary expenses and increasing your savings rate to build a stronger financial foundation.',
          confidence: 0.85,
          actionable: true,
          metadata: {
            currentSavingsRate: savingsRate,
            recommendedSavingsRate: 0.2,
            monthlyIncome: income,
            monthlyExpenses: totalMonthlyExpenses
          }
        });
      }

    } catch (error) {
      this.logger.error('Error generating expense analysis insights:', error);
    }

    return insights;
  }

  private async generateInvestmentInsights(userId: string, financialData: any): Promise<any[]> {
    const insights = [];

    try {
      const investments = this.extractInvestments(financialData);
      const portfolio = this.analyzePortfolio(investments);

      // Portfolio diversification
      if (portfolio.equityAllocation > 0.8) {
        insights.push({
          type: AIInsightType.INVESTMENT_ADVICE,
          priority: AIInsightPriority.MEDIUM,
          title: 'Portfolio Diversification',
          description: `Your portfolio is ${Math.round(portfolio.equityAllocation * 100)}% equity, which may be too aggressive for your risk profile.`,
          recommendation: 'Consider adding debt funds or bonds to diversify your portfolio and reduce risk.',
          confidence: 0.82,
          actionable: true,
          metadata: {
            equityAllocation: portfolio.equityAllocation,
            debtAllocation: portfolio.debtAllocation,
            recommendedEquityAllocation: 0.7
          }
        });
      }

      // SIP recommendations
      const monthlyIncome = this.calculateTotalIncome(financialData) / 12;
      const recommendedSIP = monthlyIncome * 0.2; // 20% of monthly income
      const currentSIP = this.calculateCurrentSIP(investments);

      if (currentSIP < recommendedSIP * 0.5) {
        insights.push({
          type: AIInsightType.INVESTMENT_ADVICE,
          priority: AIInsightPriority.HIGH,
          title: 'SIP Investment Opportunity',
          description: `You can start a SIP of ₹${Math.round(recommendedSIP)} per month to build wealth systematically.`,
          recommendation: 'Start a Systematic Investment Plan (SIP) in diversified equity funds for long-term wealth creation.',
          confidence: 0.88,
          actionable: true,
          estimatedReturns: Math.round(recommendedSIP * 12 * 0.12), // 12% annual return
          metadata: {
            recommendedSIP: Math.round(recommendedSIP),
            currentSIP: currentSIP,
            monthlyIncome: monthlyIncome
          }
        });
      }

      // Emergency fund
      const emergencyFund = this.calculateEmergencyFund(financialData);
      const monthlyExpenses = this.calculateMonthlyExpenses(financialData);
      const recommendedEmergencyFund = monthlyExpenses * 6;

      if (emergencyFund < recommendedEmergencyFund * 0.5) {
        insights.push({
          type: AIInsightType.INVESTMENT_ADVICE,
          priority: AIInsightPriority.HIGH,
          title: 'Emergency Fund Required',
          description: `You need to build an emergency fund of ₹${Math.round(recommendedEmergencyFund)} (6 months of expenses).`,
          recommendation: 'Build an emergency fund in a liquid fund or high-yield savings account before investing in other instruments.',
          confidence: 0.95,
          actionable: true,
          metadata: {
            currentEmergencyFund: emergencyFund,
            recommendedEmergencyFund: Math.round(recommendedEmergencyFund),
            monthlyExpenses: monthlyExpenses
          }
        });
      }

    } catch (error) {
      this.logger.error('Error generating investment insights:', error);
    }

    return insights;
  }

  private async generateCashFlowInsights(userId: string, financialData: any): Promise<any[]> {
    const insights = [];

    try {
      const cashFlow = this.analyzeCashFlow(financialData);
      const predictions = this.predictCashFlow(cashFlow);

      // Cash flow trends
      if (predictions.trend < -0.1) {
        insights.push({
          type: AIInsightType.CASH_FLOW_ANALYSIS,
          priority: AIInsightPriority.HIGH,
          title: 'Negative Cash Flow Trend',
          description: `Your cash flow is declining by ${Math.round(Math.abs(predictions.trend) * 100)}% monthly.`,
          recommendation: 'Review your expenses and income sources to improve cash flow.',
          confidence: 0.75,
          actionable: true,
          metadata: {
            trend: predictions.trend,
            predictedBalance: predictions.predictedBalance,
            monthsAhead: predictions.monthsAhead
          }
        });
      }

      // Seasonal patterns
      const seasonalPatterns = this.identifySeasonalPatterns(cashFlow);
      if (seasonalPatterns.length > 0) {
        insights.push({
          type: AIInsightType.CASH_FLOW_ANALYSIS,
          priority: AIInsightPriority.MEDIUM,
          title: 'Seasonal Cash Flow Patterns',
          description: `Your cash flow shows seasonal patterns that you can plan for.`,
          recommendation: 'Plan your expenses and investments based on seasonal cash flow patterns.',
          confidence: 0.70,
          actionable: true,
          metadata: {
            patterns: seasonalPatterns
          }
        });
      }

    } catch (error) {
      this.logger.error('Error generating cash flow insights:', error);
    }

    return insights;
  }

  private async generateRiskAssessmentInsights(userId: string, financialData: any): Promise<any[]> {
    const insights = [];

    try {
      const riskProfile = this.assessRiskProfile(financialData);
      const riskFactors = this.identifyRiskFactors(financialData);

      // High-risk factors
      const highRiskFactors = riskFactors.filter(factor => factor.severity === 'HIGH');
      if (highRiskFactors.length > 0) {
        insights.push({
          type: AIInsightType.RISK_ASSESSMENT,
          priority: AIInsightPriority.HIGH,
          title: 'High Risk Factors Identified',
          description: `Your financial profile has ${highRiskFactors.length} high-risk factors that need attention.`,
          recommendation: 'Address high-risk factors to improve your financial stability.',
          confidence: 0.85,
          actionable: true,
          metadata: {
            riskFactors: highRiskFactors,
            overallRiskScore: riskProfile.overallScore
          }
        });
      }

      // Insurance gaps
      const insuranceGaps = this.identifyInsuranceGaps(financialData);
      if (insuranceGaps.length > 0) {
        insights.push({
          type: AIInsightType.RISK_ASSESSMENT,
          priority: AIInsightPriority.MEDIUM,
          title: 'Insurance Coverage Gaps',
          description: `You have ${insuranceGaps.length} insurance coverage gaps that should be addressed.`,
          recommendation: 'Consider purchasing appropriate insurance policies to protect against financial risks.',
          confidence: 0.80,
          actionable: true,
          metadata: {
            gaps: insuranceGaps
          }
        });
      }

    } catch (error) {
      this.logger.error('Error generating risk assessment insights:', error);
    }

    return insights;
  }

  private async storeInsight(userId: string, insight: any): Promise<AIInsightResponseDto> {
    const storedInsight = await this.prisma.aIInsight.create({
      data: {
        userId,
        insightType: insight.type,
        priority: insight.priority,
        title: insight.title,
        description: insight.description,
        recommendation: insight.recommendation,
        confidence: insight.confidence,
        actionable: insight.actionable,
        estimatedSavings: insight.estimatedSavings,
        deadline: insight.deadline,
        citations: insight.citations,
        metadata: insight.metadata,
        generatedAt: new Date(),
      },
    });

    return this.mapToResponseDto(storedInsight);
  }

  private async getUserFinancialData(userId: string): Promise<any> {
    const financialData = await this.prisma.financialData.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return financialData.map(data => ({
      ...(data.processedData as any),
      dataType: data.dataType,
      source: data.source,
    }));
  }

  private calculateTotalIncome(financialData: any[]): number {
    return financialData.reduce((total, data) => {
      if (data.transactions) {
        const income = data.transactions
          .filter((t: any) => t.amount > 0)
          .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
        return total + income;
      }
      return total;
    }, 0);
  }

  private calculateCurrentDeductions(financialData: any[]): any {
    // Mock implementation - in real scenario, this would analyze actual deductions
    return {
      section80C: 50000,
      section80D: 25000,
      section24: 200000,
    };
  }

  private determineTaxSlab(income: number): string {
    if (income <= 250000) return '0%';
    if (income <= 500000) return '5%';
    if (income <= 1000000) return '20%';
    return '30%';
  }

  private analyzeHRAOptimization(financialData: any[]): any {
    // Mock implementation
    return {
      potentialSavings: 15000,
      recommendation: 'Consider providing rent receipts to maximize HRA exemption.',
      metadata: {
        currentHRA: 20000,
        rentPaid: 25000,
        potentialExemption: 20000
      }
    };
  }

  private analyzeMedicalInsurance(financialData: any[]): any {
    // Mock implementation
    return {
      potentialSavings: 7500,
      metadata: {
        currentPremium: 0,
        maxDeduction: 25000
      }
    };
  }

  private categorizeExpenses(financialData: any[]): any {
    const expenses = {};
    
    financialData.forEach(data => {
      if (data.transactions) {
        data.transactions.forEach((transaction: any) => {
          if (transaction.amount < 0) {
            const category = transaction.category || 'Others';
            expenses[category] = (expenses[category] || 0) + Math.abs(transaction.amount);
          }
        });
      }
    });

    return expenses;
  }

  private calculateMonthlyAverage(expenses: any): any {
    const monthlyAverage = {};
    Object.entries(expenses).forEach(([category, amount]) => {
      monthlyAverage[category] = (amount as number) / 12; // Assuming 12 months of data
    });
    return monthlyAverage;
  }

  private analyzeExpenseTrends(expenses: any): any {
    // Mock implementation - in real scenario, this would analyze historical trends
    const trends = {};
    Object.keys(expenses).forEach(category => {
      trends[category] = Math.random() * 0.4 - 0.2; // Random trend between -20% and +20%
    });
    return trends;
  }

  private getExpenseRecommendation(category: string, amount: number, trend: number): string {
    if (trend > 0.1) {
      return `Your ${category} expenses are increasing. Consider setting a budget and tracking expenses more closely.`;
    } else if (amount > 20000) {
      return `Your ${category} expenses are high. Look for ways to optimize or reduce these costs.`;
    } else {
      return `Your ${category} expenses are within reasonable limits. Continue monitoring for any unusual increases.`;
    }
  }

  private extractInvestments(financialData: any[]): any[] {
    const investments = [];
    
    financialData.forEach(data => {
      if (data.holdings) {
        investments.push(...data.holdings);
      }
      if (data.portfolio) {
        investments.push(...data.portfolio);
      }
    });

    return investments;
  }

  private analyzePortfolio(investments: any[]): any {
    const totalValue = investments.reduce((sum, inv) => sum + (inv.value || inv.amount || 0), 0);
    const equityValue = investments
      .filter(inv => inv.type === 'equity' || inv.category === 'equity')
      .reduce((sum, inv) => sum + (inv.value || inv.amount || 0), 0);
    
    return {
      totalValue,
      equityAllocation: totalValue > 0 ? equityValue / totalValue : 0,
      debtAllocation: totalValue > 0 ? (totalValue - equityValue) / totalValue : 0,
    };
  }

  private calculateCurrentSIP(investments: any[]): number {
    // Mock implementation
    return 5000; // Current SIP amount
  }

  private calculateEmergencyFund(financialData: any[]): number {
    // Mock implementation
    return 50000; // Current emergency fund
  }

  private calculateMonthlyExpenses(financialData: any[]): number {
    const totalExpenses = this.calculateTotalIncome(financialData) * 0.7; // Assume 70% expenses
    return totalExpenses / 12;
  }

  private analyzeCashFlow(financialData: any[]): any {
    // Mock implementation
    return {
      monthlyIncome: 50000,
      monthlyExpenses: 35000,
      netCashFlow: 15000,
      trend: -0.05, // 5% decline
    };
  }

  private predictCashFlow(cashFlow: any): any {
    // Mock implementation
    return {
      trend: cashFlow.trend,
      predictedBalance: 100000,
      monthsAhead: 6,
    };
  }

  private identifySeasonalPatterns(cashFlow: any): any[] {
    // Mock implementation
    return [
      { month: 'December', pattern: 'High expenses due to holidays' },
      { month: 'March', pattern: 'High income due to bonuses' },
    ];
  }

  private assessRiskProfile(financialData: any[]): any {
    // Mock implementation
    return {
      overallScore: 0.6, // Medium risk
      factors: ['High debt-to-income ratio', 'Insufficient emergency fund'],
    };
  }

  private identifyRiskFactors(financialData: any[]): any[] {
    // Mock implementation
    return [
      { factor: 'High debt-to-income ratio', severity: 'HIGH' },
      { factor: 'Insufficient emergency fund', severity: 'MEDIUM' },
    ];
  }

  private identifyInsuranceGaps(financialData: any[]): any[] {
    // Mock implementation
    return [
      { type: 'Life Insurance', coverage: 'Insufficient' },
      { type: 'Health Insurance', coverage: 'Missing' },
    ];
  }

  private mapToResponseDto(insight: any): AIInsightResponseDto {
    return {
      id: insight.id,
      userId: insight.userId,
      type: insight.type,
      insightType: insight.insightType,
      priority: insight.priority,
      title: insight.title,
      description: insight.description,
      recommendation: insight.recommendation,
      confidence: insight.confidence,
      actionable: insight.actionable,
      estimatedSavings: insight.estimatedSavings,
      deadline: insight.deadline,
      citations: insight.citations,
      metadata: insight.metadata,
      generatedAt: insight.generatedAt,
      createdAt: insight.createdAt,
      updatedAt: insight.updatedAt,
    };
  }

  async getInsights(userId: string): Promise<AIInsightResponseDto[]> {
    const insights = await this.prisma.aIInsight.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
    });

    return insights.map(insight => this.mapToResponseDto(insight));
  }

  async getInsightById(userId: string, insightId: string): Promise<AIInsightResponseDto> {
    const insight = await this.prisma.aIInsight.findFirst({
      where: {
        id: insightId,
        userId,
      },
    });

    if (!insight) {
      throw new Error('Insight not found');
    }

    return this.mapToResponseDto(insight);
  }

  async markInsightAsRead(userId: string, insightId: string): Promise<void> {
    await this.prisma.aIInsight.updateMany({
      where: {
        id: insightId,
        userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getInsightSummary(userId: string): Promise<any> {
    const insights = await this.prisma.aIInsight.findMany({
      where: { userId },
    });

    const summary = {
      total: insights.length,
      unread: insights.filter(i => !i.isRead).length,
      byType: {},
      byPriority: {},
      totalSavings: insights.reduce((sum, i) => sum + (i.estimatedSavings || 0), 0),
    };

    insights.forEach(insight => {
      summary.byType[insight.insightType] = (summary.byType[insight.insightType] || 0) + 1;
      summary.byPriority[insight.priority] = (summary.byPriority[insight.priority] || 0) + 1;
    });

    return summary;
  }
}
