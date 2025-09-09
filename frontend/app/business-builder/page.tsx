'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuthStore } from '@/stores/auth-store'
import { 
  Building2,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  PieChart,
  BarChart3,
  LineChart,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Brain,
  Sparkles,
  Target,
  Shield,
  Award,
  Trophy,
  Gift,
  Star,
  Activity,
  FileText,
  CreditCard,
  Wallet,
  Calculator,
  Globe,
  Phone,
  Mail,
  MapPin,
  Database,
  Server,
  Link,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

interface BusinessBuilderData {
  companyProfile: {
    name: string
    type: 'private_limited' | 'llp' | 'partnership' | 'proprietorship'
    cin: string
    gstNumber: string
    incorporationDate: Date
    totalEmployees: number
    monthlyRevenue: number
    totalAssets: number
    complianceScore: number
    entities: Entity[]
  }
  
  dashboard: {
    cashBalance: number
    monthlyBurn: number
    monthlyRevenue: number
    runway: number // months
    profitMargin: number
    growthRate: number
    outstandingReceivables: number
    payables: number
    inventoryValue: number
  }
  
  financials: {
    revenue: FinancialData[]
    expenses: FinancialData[]
    profitLoss: ProfitLossData
    balanceSheet: BalanceSheetData
    cashflow: CashflowData[]
    kpis: KPIData[]
  }
  
  compliance: {
    gst: ComplianceItem
    tds: ComplianceItem
    pf: ComplianceItem
    esi: ComplianceItem
    roc: ComplianceItem
    overall: number
    upcomingDeadlines: DeadlineItem[]
  }
  
  payroll: {
    totalEmployees: number
    monthlyPayroll: number
    complianceStatus: 'compliant' | 'pending' | 'overdue'
    recentPayslips: PayslipData[]
    taxDeductions: TaxDeductionData
  }
  
  insights: BusinessInsight[]
  integrations: IntegrationData[]
  boardPack: BoardPackData
}

interface Entity {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive'
  revenue: number
  employees: number
}

interface FinancialData {
  month: string
  amount: number
  growth: number
  category: string
}

interface ProfitLossData {
  revenue: number
  grossProfit: number
  operatingExpenses: number
  ebitda: number
  netProfit: number
  margins: {
    gross: number
    operating: number
    net: number
  }
}

interface BalanceSheetData {
  assets: {
    current: number
    fixed: number
    total: number
  }
  liabilities: {
    current: number
    longTerm: number
    total: number
  }
  equity: number
}

interface CashflowData {
  month: string
  operating: number
  investing: number
  financing: number
  net: number
}

interface KPIData {
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  target: number
  variance: number
}

interface ComplianceItem {
  status: 'compliant' | 'pending' | 'overdue'
  lastFiled: Date
  nextDue: Date
  penalty: number
  score: number
}

interface DeadlineItem {
  type: string
  description: string
  dueDate: Date
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed'
}

interface PayslipData {
  employeeId: string
  name: string
  department: string
  grossSalary: number
  deductions: number
  netSalary: number
  month: string
}

interface TaxDeductionData {
  tds: number
  pf: number
  esi: number
  professionalTax: number
  total: number
}

interface BusinessInsight {
  id: string
  type: 'financial' | 'operational' | 'compliance' | 'growth' | 'risk'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  recommendation: string
  metric?: {
    value: number
    unit: string
    trend: 'up' | 'down'
  }
}

interface IntegrationData {
  name: string
  type: 'erp' | 'bank' | 'payments' | 'hr' | 'accounting'
  status: 'connected' | 'disconnected' | 'error'
  lastSync: Date
  recordsCount: number
}

interface BoardPackData {
  lastGenerated: Date
  monthsCovered: string
  slides: number
  keyMetrics: {
    revenue: number
    growth: number
    burn: number
    runway: number
  }
}

export default function BusinessBuilderPage() {
  const { user } = useAuthStore()
  const [data, setData] = useState<BusinessBuilderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'compliance' | 'payroll' | 'reports'>('overview')
  const [selectedEntity, setSelectedEntity] = useState<string>('all')

  useEffect(() => {
    // Mock data - in production, this would come from API
    const mockData: BusinessBuilderData = {
      companyProfile: {
        name: 'TechVenture Solutions Pvt Ltd',
        type: 'private_limited',
        cin: 'U72900MH2023PTC123456',
        gstNumber: '27ABCDE1234F1Z5',
        incorporationDate: new Date('2023-04-15'),
        totalEmployees: 45,
        monthlyRevenue: 8500000,
        totalAssets: 25000000,
        complianceScore: 94,
        entities: [
          { id: '1', name: 'TechVenture Solutions Pvt Ltd', type: 'Holding Company', status: 'active', revenue: 8500000, employees: 35 },
          { id: '2', name: 'TechVenture Digital Services LLP', type: 'Subsidiary', status: 'active', revenue: 2800000, employees: 10 }
        ]
      },
      
      dashboard: {
        cashBalance: 12500000,
        monthlyBurn: 4200000,
        monthlyRevenue: 8500000,
        runway: 18,
        profitMargin: 22.5,
        growthRate: 35.8,
        outstandingReceivables: 6800000,
        payables: 3200000,
        inventoryValue: 1500000
      },
      
      financials: {
        revenue: [
          { month: 'Jan', amount: 7200000, growth: 15.2, category: 'Software Services' },
          { month: 'Feb', amount: 7800000, growth: 18.3, category: 'Software Services' },
          { month: 'Mar', amount: 8200000, growth: 22.1, category: 'Software Services' },
          { month: 'Apr', amount: 8500000, growth: 25.8, category: 'Software Services' },
          { month: 'May', amount: 9100000, growth: 32.4, category: 'Software Services' },
          { month: 'Jun', amount: 9800000, growth: 35.8, category: 'Software Services' }
        ],
        expenses: [
          { month: 'Jan', amount: 5400000, growth: 8.5, category: 'Operating' },
          { month: 'Feb', amount: 5700000, growth: 12.2, category: 'Operating' },
          { month: 'Mar', amount: 6000000, growth: 15.1, category: 'Operating' },
          { month: 'Apr', amount: 6200000, growth: 18.8, category: 'Operating' },
          { month: 'May', amount: 6500000, growth: 22.3, category: 'Operating' },
          { month: 'Jun', amount: 6800000, growth: 25.1, category: 'Operating' }
        ],
        profitLoss: {
          revenue: 51600000,
          grossProfit: 38700000,
          operatingExpenses: 25800000,
          ebitda: 12900000,
          netProfit: 9675000,
          margins: {
            gross: 75,
            operating: 25,
            net: 18.7
          }
        },
        balanceSheet: {
          assets: {
            current: 18500000,
            fixed: 6500000,
            total: 25000000
          },
          liabilities: {
            current: 8200000,
            longTerm: 3800000,
            total: 12000000
          },
          equity: 13000000
        },
        cashflow: [
          { month: 'Jan', operating: 1200000, investing: -500000, financing: 200000, net: 900000 },
          { month: 'Feb', operating: 1400000, investing: -300000, financing: 0, net: 1100000 },
          { month: 'Mar', operating: 1600000, investing: -800000, financing: 500000, net: 1300000 },
          { month: 'Apr', operating: 1800000, investing: -200000, financing: 0, net: 1600000 },
          { month: 'May', operating: 2000000, investing: -400000, financing: -300000, net: 1300000 },
          { month: 'Jun', operating: 2200000, investing: -600000, financing: 0, net: 1600000 }
        ],
        kpis: [
          { name: 'Monthly Recurring Revenue', value: 8500000, unit: '₹', trend: 'up', target: 10000000, variance: 15 },
          { name: 'Customer Acquisition Cost', value: 25000, unit: '₹', trend: 'down', target: 20000, variance: -25 },
          { name: 'Employee Productivity', value: 188889, unit: '₹/emp', trend: 'up', target: 200000, variance: 6 },
          { name: 'Gross Margin', value: 75, unit: '%', trend: 'up', target: 75, variance: 0 }
        ]
      },
      
      compliance: {
        gst: { status: 'compliant', lastFiled: new Date('2024-06-20'), nextDue: new Date('2024-07-20'), penalty: 0, score: 98 },
        tds: { status: 'compliant', lastFiled: new Date('2024-06-07'), nextDue: new Date('2024-07-07'), penalty: 0, score: 95 },
        pf: { status: 'pending', lastFiled: new Date('2024-05-15'), nextDue: new Date('2024-06-15'), penalty: 0, score: 85 },
        esi: { status: 'compliant', lastFiled: new Date('2024-06-21'), nextDue: new Date('2024-07-21'), penalty: 0, score: 92 },
        roc: { status: 'compliant', lastFiled: new Date('2024-05-30'), nextDue: new Date('2024-09-30'), penalty: 0, score: 96 },
        overall: 94,
        upcomingDeadlines: [
          { type: 'TDS Return', description: 'File TDS return for June 2024', dueDate: new Date('2024-07-07'), priority: 'high', status: 'pending' },
          { type: 'GST Return', description: 'GSTR-3B for June 2024', dueDate: new Date('2024-07-20'), priority: 'high', status: 'pending' },
          { type: 'PF Return', description: 'Monthly PF return', dueDate: new Date('2024-07-15'), priority: 'medium', status: 'pending' }
        ]
      },
      
      payroll: {
        totalEmployees: 45,
        monthlyPayroll: 3200000,
        complianceStatus: 'compliant',
        recentPayslips: [
          { employeeId: 'EMP001', name: 'Rahul Sharma', department: 'Engineering', grossSalary: 120000, deductions: 25000, netSalary: 95000, month: 'June 2024' },
          { employeeId: 'EMP002', name: 'Priya Patel', department: 'Product', grossSalary: 110000, deductions: 22000, netSalary: 88000, month: 'June 2024' },
          { employeeId: 'EMP003', name: 'Amit Kumar', department: 'Sales', grossSalary: 85000, deductions: 18000, netSalary: 67000, month: 'June 2024' }
        ],
        taxDeductions: {
          tds: 480000,
          pf: 384000,
          esi: 96000,
          professionalTax: 45000,
          total: 1005000
        }
      },
      
      insights: [
        {
          id: '1',
          type: 'growth',
          title: 'Revenue Growth Accelerating',
          description: 'Your monthly revenue growth has accelerated to 35.8%, driven by strong demand for your software services.',
          impact: 'high',
          recommendation: 'Consider scaling your team and infrastructure to meet growing demand.',
          metric: { value: 35.8, unit: '%', trend: 'up' }
        },
        {
          id: '2',
          type: 'financial',
          title: 'Healthy Cash Runway',
          description: 'With current burn rate, you have 18 months of cash runway. Strong position for strategic investments.',
          impact: 'medium',
          recommendation: 'Evaluate opportunities for expansion or technology investments.',
          metric: { value: 18, unit: 'months', trend: 'up' }
        },
        {
          id: '3',
          type: 'operational',
          title: 'Outstanding Receivables High',
          description: 'Receivables at ₹68L represent 80% of monthly revenue. Consider tightening collection processes.',
          impact: 'medium',
          recommendation: 'Implement automated follow-up systems and review payment terms.',
          metric: { value: 6800000, unit: '₹', trend: 'up' }
        },
        {
          id: '4',
          type: 'compliance',
          title: 'Excellent Compliance Score',
          description: 'Your overall compliance score of 94% reflects strong governance and risk management.',
          impact: 'low',
          recommendation: 'Continue maintaining high standards and consider automation for 100% compliance.',
          metric: { value: 94, unit: '%', trend: 'up' }
        }
      ],
      
      integrations: [
        { name: 'Tally ERP 9', type: 'erp', status: 'connected', lastSync: new Date(), recordsCount: 15420 },
        { name: 'HDFC Bank', type: 'bank', status: 'connected', lastSync: new Date(), recordsCount: 2850 },
        { name: 'Razorpay', type: 'payments', status: 'connected', lastSync: new Date(), recordsCount: 1240 },
        { name: 'Zoho People', type: 'hr', status: 'connected', lastSync: new Date(), recordsCount: 45 },
        { name: 'QuickBooks', type: 'accounting', status: 'error', lastSync: new Date('2024-06-15'), recordsCount: 0 }
      ],
      
      boardPack: {
        lastGenerated: new Date('2024-06-30'),
        monthsCovered: 'Jan-Jun 2024',
        slides: 25,
        keyMetrics: {
          revenue: 51600000,
          growth: 35.8,
          burn: 4200000,
          runway: 18
        }
      }
    }
    
    setData(mockData)
    setLoading(false)
  }, [user])

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
    return `₹${amount.toLocaleString()}`
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {data.companyProfile.name}
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Business Builder Command Center - Scale with Intelligence
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-success to-secondary text-white border-0 shadow-lg">
                <TrendingUp className="w-3 h-3 mr-1" />
                {data.dashboard.growthRate}% Growth
              </Badge>
              <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg">
                <Shield className="w-3 h-3 mr-1" />
                {data.compliance.overall}% Compliance
              </Badge>
              <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 shadow-lg">
                <Award className="w-3 h-3 mr-1" />
                {data.companyProfile.totalEmployees} Team
              </Badge>
            </div>
          </div>
        </div>

        {/* Executive Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-success/20 to-secondary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-success/10 to-secondary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-success mb-1 animate-count-up">
                {formatCurrency(data.dashboard.monthlyRevenue)}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-success font-medium">
                  +{data.dashboard.growthRate}% YoY
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cash Runway</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-primary mb-1 animate-count-up">
                {data.dashboard.runway} months
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-medium">
                  {formatCurrency(data.dashboard.cashBalance)} balance
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Profit Margin</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center">
                  <PieChart className="w-4 h-4 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-accent mb-1 animate-count-up">
                {data.dashboard.profitMargin}%
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm text-accent font-medium">
                  Strong profitability
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Team Size</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-secondary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-secondary mb-1 animate-count-up">
                {data.companyProfile.totalEmployees}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-sm text-secondary font-medium">
                  {formatCurrency(data.payroll.monthlyPayroll)} payroll
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
            {[
              { id: 'overview', label: 'Overview', icon: Brain },
              { id: 'financials', label: 'Financials', icon: BarChart3 },
              { id: 'compliance', label: 'Compliance', icon: Shield },
              { id: 'payroll', label: 'Payroll', icon: Users },
              { id: 'reports', label: 'Board Pack', icon: FileText }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id as any)}
                className={`btn-hover ${activeTab === tab.id ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' : 'hover:bg-primary/5'}`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {activeTab === 'overview' && <OverviewTab data={data} />}
          {activeTab === 'financials' && <FinancialsTab data={data} />}
          {activeTab === 'compliance' && <ComplianceTab data={data} />}
          {activeTab === 'payroll' && <PayrollTab data={data} />}
          {activeTab === 'reports' && <ReportsTab data={data} />}
        </div>
      </div>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ data }: { data: BusinessBuilderData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Key Insights */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">AI Business Insights</CardTitle>
                <CardDescription>Strategic recommendations for growth</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.insights.slice(0, 4).map((insight) => (
                <div key={insight.id} className={`
                  p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                  ${insight.impact === 'high' ? 'border-destructive/20 bg-destructive/5' :
                    insight.impact === 'medium' ? 'border-accent/20 bg-accent/5' :
                    'border-success/20 bg-success/5'}
                `}>
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${insight.impact === 'high' ? 'bg-destructive/10' :
                        insight.impact === 'medium' ? 'bg-accent/10' :
                        'bg-success/10'}
                    `}>
                      {insight.type === 'growth' && <TrendingUp className="w-4 h-4 text-success" />}
                      {insight.type === 'financial' && <DollarSign className="w-4 h-4 text-primary" />}
                      {insight.type === 'operational' && <Settings className="w-4 h-4 text-accent" />}
                      {insight.type === 'compliance' && <Shield className="w-4 h-4 text-secondary" />}
                      {insight.type === 'risk' && <AlertTriangle className="w-4 h-4 text-destructive" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{insight.title}</h4>
                      <p className="text-muted-foreground text-sm mb-2">{insight.description}</p>
                      {insight.metric && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-primary">
                            {insight.metric.unit === '₹' ? '₹' : ''}{insight.metric.value.toLocaleString()}{insight.metric.unit === '%' ? '%' : insight.metric.unit === 'months' ? ' months' : ''}
                          </span>
                          {insight.metric.trend === 'up' ? (
                            <TrendingUp className="w-3 h-3 text-success" />
                          ) : insight.metric.trend === 'down' ? (
                            <TrendingDown className="w-3 h-3 text-destructive" />
                          ) : null}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground italic">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue & Growth Chart */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-success/10 to-secondary/10 rounded-xl flex items-center justify-center">
                <LineChart className="w-5 h-5 text-success" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Revenue Growth Trajectory</CardTitle>
                <CardDescription>6-month revenue and growth analysis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.financials.revenue.map((month, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 rounded-xl hover:bg-success/5 transition-colors">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">{month.month}</div>
                    <div className="text-lg font-bold text-foreground">{(month.amount / 100000).toFixed(1)}L</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Growth</div>
                    <div className="text-lg font-bold text-success">+{month.growth}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="text-sm font-medium text-primary">{month.category}</div>
                  </div>
                  <div className="text-center">
                    <Progress value={(month.amount / 10000000) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card className="card-hover bg-gradient-to-br from-primary via-secondary to-accent border-0 shadow-xl text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Generate Board Pack</h3>
              <p className="text-white/80 mb-6 text-sm">
                Auto-generate investor presentation with latest metrics
              </p>
              <Button className="btn-hover w-full bg-white text-primary hover:bg-white/90 font-semibold">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Board Pack
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Entity Switcher */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Business Entities</CardTitle>
                <CardDescription>Multi-entity overview</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.companyProfile.entities.map((entity) => (
                <div key={entity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors">
                  <div>
                    <div className="font-medium text-foreground text-sm">{entity.name}</div>
                    <div className="text-xs text-muted-foreground">{entity.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">₹{(entity.revenue / 100000).toFixed(1)}L</div>
                    <div className="text-xs text-muted-foreground">{entity.employees} emp</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Integrations */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Data Integrations</CardTitle>
                <CardDescription>Connected systems</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.integrations.map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center
                      ${integration.status === 'connected' ? 'bg-success/10' :
                        integration.status === 'error' ? 'bg-destructive/10' :
                        'bg-muted/10'}
                    `}>
                      {integration.status === 'connected' && <CheckCircle className="w-3 h-3 text-success" />}
                      {integration.status === 'error' && <AlertTriangle className="w-3 h-3 text-destructive" />}
                      {integration.status === 'disconnected' && <RefreshCw className="w-3 h-3 text-muted-foreground" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{integration.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{integration.type}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {integration.recordsCount.toLocaleString()} records
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Score */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Compliance Health</CardTitle>
                <CardDescription>Overall score: {data.compliance.overall}%</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={data.compliance.overall} className="h-3" />
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-lg bg-success/10">
                  <div className="text-2xl font-bold text-success">{data.compliance.gst.score}%</div>
                  <div className="text-xs text-muted-foreground">GST</div>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <div className="text-2xl font-bold text-primary">{data.compliance.roc.score}%</div>
                  <div className="text-xs text-muted-foreground">ROC</div>
                </div>
              </div>
              {data.compliance.upcomingDeadlines.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-foreground mb-2">Next Deadline:</div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/5">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <div>
                      <div className="text-sm font-medium text-destructive">
                        {data.compliance.upcomingDeadlines[0].type}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Due: {data.compliance.upcomingDeadlines[0].dueDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Placeholder tabs (simplified for brevity)
function FinancialsTab({ data }: { data: BusinessBuilderData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Financial Analytics Hub</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Comprehensive P&L, Balance Sheet, Cash Flow analysis with AI-powered insights
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-2xl font-bold text-success">₹{(data.financials.profitLoss.revenue / 10000000).toFixed(1)}Cr</div>
              <div className="text-sm text-muted-foreground">Revenue</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">{data.financials.profitLoss.margins.net}%</div>
              <div className="text-sm text-muted-foreground">Net Margin</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/10">
              <div className="text-2xl font-bold text-accent">₹{(data.financials.profitLoss.ebitda / 10000000).toFixed(1)}Cr</div>
              <div className="text-sm text-muted-foreground">EBITDA</div>
            </div>
          </div>
          <Button className="btn-hover bg-gradient-to-r from-primary to-secondary text-white px-8 py-4">
            <BarChart3 className="w-5 h-5 mr-2" />
            View Detailed Analytics
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function ComplianceTab({ data }: { data: BusinessBuilderData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Compliance Command Center</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Automated compliance tracking, deadline management, and regulatory filings
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-3xl font-bold text-success">{data.compliance.overall}%</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-3xl font-bold text-primary">{data.compliance.upcomingDeadlines.length}</div>
              <div className="text-sm text-muted-foreground">Pending Filings</div>
            </div>
          </div>
          <Button className="btn-hover bg-gradient-to-r from-secondary to-accent text-white px-8 py-4">
            <Shield className="w-5 h-5 mr-2" />
            Manage Compliance
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function PayrollTab({ data }: { data: BusinessBuilderData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Payroll Management Hub</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Automated payroll processing, tax calculations, and compliance reporting
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-accent/10">
              <div className="text-2xl font-bold text-accent">{data.payroll.totalEmployees}</div>
              <div className="text-sm text-muted-foreground">Employees</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">₹{(data.payroll.monthlyPayroll / 100000).toFixed(1)}L</div>
              <div className="text-sm text-muted-foreground">Monthly Payroll</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-2xl font-bold text-success">₹{(data.payroll.taxDeductions.total / 100000).toFixed(1)}L</div>
              <div className="text-sm text-muted-foreground">Tax Deductions</div>
            </div>
          </div>
          <Button className="btn-hover bg-gradient-to-r from-accent to-primary text-white px-8 py-4">
            <Users className="w-5 h-5 mr-2" />
            Process Payroll
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportsTab({ data }: { data: BusinessBuilderData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">AI Board Pack Generator</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Auto-generate investor presentations with key metrics, insights, and strategic recommendations
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-3xl font-bold text-primary">{data.boardPack.slides}</div>
              <div className="text-sm text-muted-foreground">Slides Generated</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-3xl font-bold text-success">{data.boardPack.monthsCovered}</div>
              <div className="text-sm text-muted-foreground">Period Covered</div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Button className="btn-hover bg-gradient-to-r from-primary to-secondary text-white px-8 py-4">
              <Sparkles className="w-5 h-5 mr-2" />
              Generate New Pack
            </Button>
            <Button variant="outline" className="btn-hover border-primary/20 hover:bg-primary/5 px-8 py-4">
              <Download className="w-5 h-5 mr-2" />
              Download Latest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
