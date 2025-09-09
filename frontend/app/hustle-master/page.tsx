'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuthStore } from '@/stores/auth-store'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Receipt,
  Users,
  Calendar,
  PieChart,
  FileText,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  ArrowRight,
  Zap,
  Brain,
  Sparkles,
  Target,
  CreditCard,
  Wallet,
  Building2,
  Calculator,
  BarChart3,
  LineChart,
  Gift,
  Star,
  Trophy,
  Shield,
  RefreshCw,
  Download,
  Upload,
  Mail,
  Phone,
  Globe,
  IndianRupee,
  Percent,
  Activity
} from 'lucide-react'

interface HustleMasterData {
  businessProfile: {
    businessName: string
    gstNumber: string
    businessType: 'freelancer' | 'consultant' | 'agency' | 'creator'
    registrationDate: Date
    currentQuarter: string
    totalRevenue: number
    netProfit: number
    gstLiability: number
    pendingInvoices: number
  }
  
  revenue: {
    thisMonth: number
    lastMonth: number
    thisQuarter: number
    lastQuarter: number
    growth: number
    trend: 'up' | 'down' | 'stable'
    breakdown: RevenueBreakdown[]
  }
  
  expenses: {
    thisMonth: number
    lastMonth: number
    businessPercentage: number
    categories: ExpenseCategory[]
    pendingCategorization: number
  }
  
  invoicing: {
    totalInvoices: number
    totalAmount: number
    pending: InvoiceStats
    overdue: InvoiceStats
    paid: InvoiceStats
    recentInvoices: Invoice[]
  }
  
  gst: {
    currentQuarter: string
    salesValue: number
    purchaseValue: number
    outputTax: number
    inputTaxCredit: number
    netLiability: number
    filingStatus: 'pending' | 'filed' | 'late'
    dueDate: Date
    complianceScore: number
  }
  
  clients: Client[]
  insights: BusinessInsight[]
  cashflow: CashflowData[]
  taxPot: {
    balance: number
    monthlyContribution: number
    targetBalance: number
    nextTaxDate: Date
  }
}

interface RevenueBreakdown {
  source: string
  amount: number
  percentage: number
  growth: number
}

interface ExpenseCategory {
  name: string
  amount: number
  percentage: number
  businessRelevant: number
  trend: 'up' | 'down' | 'stable'
  subcategories: string[]
}

interface InvoiceStats {
  count: number
  amount: number
  percentage: number
}

interface Invoice {
  id: string
  clientName: string
  amount: number
  date: Date
  dueDate: Date
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  gstApplicable: boolean
  paymentMethod?: string
}

interface Client {
  id: string
  name: string
  email: string
  totalBilled: number
  lastInvoice: Date
  status: 'active' | 'inactive' | 'prospect'
  paymentTerm: number
  outstandingAmount: number
  projects: number
}

interface BusinessInsight {
  id: string
  type: 'revenue' | 'expense' | 'gst' | 'client' | 'cashflow' | 'tax'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  action?: string
  metric?: {
    value: number
    unit: string
    trend: 'up' | 'down'
  }
}

interface CashflowData {
  month: string
  revenue: number
  expenses: number
  netCashflow: number
  gstPayment: number
  taxReserve: number
}

export default function HustleMasterPage() {
  const { user } = useAuthStore()
  const [data, setData] = useState<HustleMasterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'invoicing' | 'gst' | 'clients' | 'insights'>('overview')

  useEffect(() => {
    // Mock data - in production, this would come from API
    const mockData: HustleMasterData = {
      businessProfile: {
        businessName: `${user?.firstName}'s Creative Studio`,
        gstNumber: '27ABCDE1234F1Z5',
        businessType: 'freelancer',
        registrationDate: new Date('2023-04-01'),
        currentQuarter: 'Q1 FY25',
        totalRevenue: 2850000,
        netProfit: 1425000,
        gstLiability: 45000,
        pendingInvoices: 12
      },
      
      revenue: {
        thisMonth: 485000,
        lastMonth: 420000,
        thisQuarter: 1285000,
        lastQuarter: 1150000,
        growth: 15.5,
        trend: 'up',
        breakdown: [
          { source: 'Consulting Services', amount: 285000, percentage: 58.8, growth: 12.3 },
          { source: 'Design Projects', amount: 125000, percentage: 25.8, growth: 8.7 },
          { source: 'Content Creation', amount: 75000, percentage: 15.4, growth: 22.1 }
        ]
      },
      
      expenses: {
        thisMonth: 185000,
        lastMonth: 165000,
        businessPercentage: 78,
        categories: [
          { 
            name: 'Software & Tools', 
            amount: 45000, 
            percentage: 24.3, 
            businessRelevant: 95,
            trend: 'stable',
            subcategories: ['Adobe CC', 'Figma Pro', 'Notion']
          },
          { 
            name: 'Marketing & Ads', 
            amount: 35000, 
            percentage: 18.9, 
            businessRelevant: 100,
            trend: 'up',
            subcategories: ['Google Ads', 'LinkedIn Ads', 'Social Media']
          },
          { 
            name: 'Travel & Meetings', 
            amount: 28000, 
            percentage: 15.1, 
            businessRelevant: 60,
            trend: 'down',
            subcategories: ['Client Meetings', 'Co-working Space']
          },
          { 
            name: 'Equipment', 
            amount: 22000, 
            percentage: 11.9, 
            businessRelevant: 85,
            trend: 'stable',
            subcategories: ['Laptop', 'Camera', 'Accessories']
          }
        ],
        pendingCategorization: 8
      },
      
      invoicing: {
        totalInvoices: 156,
        totalAmount: 4250000,
        pending: { count: 8, amount: 325000, percentage: 35.2 },
        overdue: { count: 4, amount: 185000, percentage: 20.1 },
        paid: { count: 144, amount: 3740000, percentage: 44.7 },
        recentInvoices: [
          {
            id: 'INV-2024-089',
            clientName: 'TechCorp Solutions',
            amount: 125000,
            date: new Date('2024-06-15'),
            dueDate: new Date('2024-07-15'),
            status: 'sent',
            gstApplicable: true
          },
          {
            id: 'INV-2024-088',
            clientName: 'StartupXYZ',
            amount: 85000,
            date: new Date('2024-06-10'),
            dueDate: new Date('2024-07-10'),
            status: 'paid',
            gstApplicable: true,
            paymentMethod: 'Bank Transfer'
          },
          {
            id: 'INV-2024-087',
            clientName: 'Creative Agency',
            amount: 95000,
            date: new Date('2024-06-05'),
            dueDate: new Date('2024-06-20'),
            status: 'overdue',
            gstApplicable: true
          }
        ]
      },
      
      gst: {
        currentQuarter: 'Apr-Jun 2024',
        salesValue: 1285000,
        purchaseValue: 245000,
        outputTax: 231300,
        inputTaxCredit: 44100,
        netLiability: 187200,
        filingStatus: 'pending',
        dueDate: new Date('2024-07-20'),
        complianceScore: 92
      },
      
      clients: [
        {
          id: '1',
          name: 'TechCorp Solutions',
          email: 'projects@techcorp.com',
          totalBilled: 850000,
          lastInvoice: new Date('2024-06-15'),
          status: 'active',
          paymentTerm: 30,
          outstandingAmount: 125000,
          projects: 8
        },
        {
          id: '2',
          name: 'StartupXYZ',
          email: 'founder@startupxyz.com',
          totalBilled: 485000,
          lastInvoice: new Date('2024-06-10'),
          status: 'active',
          paymentTerm: 15,
          outstandingAmount: 0,
          projects: 3
        },
        {
          id: '3',
          name: 'Creative Agency',
          email: 'hello@creativeagency.in',
          totalBilled: 325000,
          lastInvoice: new Date('2024-06-05'),
          status: 'active',
          paymentTerm: 15,
          outstandingAmount: 95000,
          projects: 5
        }
      ],
      
      insights: [
        {
          id: '1',
          type: 'revenue',
          title: 'Revenue Growth Accelerating',
          description: 'Your monthly revenue grew 15.5% this month. Content creation services are showing highest growth at 22.1%.',
          impact: 'high',
          action: 'Scale Content Services',
          metric: { value: 15.5, unit: '%', trend: 'up' }
        },
        {
          id: '2',
          type: 'gst',
          title: 'GST Filing Due Soon',
          description: 'Your Q1 GST return is due on July 20th. Current liability is ₹1,87,200 with good ITC utilization.',
          impact: 'high',
          action: 'File GST Return',
          metric: { value: 187200, unit: '₹', trend: 'up' }
        },
        {
          id: '3',
          type: 'client',
          title: 'Payment Overdue Alert',
          description: '4 invoices totaling ₹1,85,000 are overdue. Creative Agency has ₹95,000 pending beyond terms.',
          impact: 'medium',
          action: 'Send Reminders',
          metric: { value: 185000, unit: '₹', trend: 'up' }
        },
        {
          id: '4',
          type: 'tax',
          title: 'Tax Pot on Track',
          description: 'Your tax reserve is well-funded at ₹2,85,000. Consider increasing monthly contribution for Q2.',
          impact: 'low',
          action: 'Review Contribution',
          metric: { value: 285000, unit: '₹', trend: 'up' }
        }
      ],
      
      cashflow: [
        { month: 'Jan', revenue: 420000, expenses: 165000, netCashflow: 255000, gstPayment: 45000, taxReserve: 65000 },
        { month: 'Feb', revenue: 385000, expenses: 155000, netCashflow: 230000, gstPayment: 42000, taxReserve: 58000 },
        { month: 'Mar', revenue: 480000, expenses: 175000, netCashflow: 305000, gstPayment: 48000, taxReserve: 72000 },
        { month: 'Apr', revenue: 420000, expenses: 165000, netCashflow: 255000, gstPayment: 45000, taxReserve: 65000 },
        { month: 'May', revenue: 380000, expenses: 160000, netCashflow: 220000, gstPayment: 41000, taxReserve: 57000 },
        { month: 'Jun', revenue: 485000, expenses: 185000, netCashflow: 300000, gstPayment: 52000, taxReserve: 73000 }
      ],
      
      taxPot: {
        balance: 285000,
        monthlyContribution: 65000,
        targetBalance: 350000,
        nextTaxDate: new Date('2024-07-15')
      }
    }
    
    setData(mockData)
    setLoading(false)
  }, [user])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
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
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">
                    <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{data.businessProfile.businessName}</span>
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Hustle Master Dashboard - Revenue & Growth Hub
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-success to-secondary text-white border-0 shadow-lg">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{data.revenue.growth}% Growth
              </Badge>
              <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg">
                <Trophy className="w-3 h-3 mr-1" />
                GST Compliant
              </Badge>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
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
                {formatCurrency(data.revenue.thisMonth)}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-success font-medium">
                  +{data.revenue.growth}% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit Margin</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                  <PieChart className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-primary mb-1 animate-count-up">
                {Math.round(((data.revenue.thisMonth - data.expenses.thisMonth) / data.revenue.thisMonth) * 100)}%
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-medium">
                  {formatCurrency(data.revenue.thisMonth - data.expenses.thisMonth)} profit
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoices</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-accent mb-1 animate-count-up">
                {formatCurrency(data.invoicing.pending.amount + data.invoicing.overdue.amount)}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm text-accent font-medium">
                  {data.invoicing.pending.count + data.invoicing.overdue.count} invoices
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tax Pot Balance</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-secondary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-secondary mb-1 animate-count-up">
                {formatCurrency(data.taxPot.balance)}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-sm text-secondary font-medium">
                  {Math.round((data.taxPot.balance / data.taxPot.targetBalance) * 100)}% of target
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
              { id: 'invoicing', label: 'Invoicing', icon: Receipt },
              { id: 'gst', label: 'GST & Tax', icon: Calculator },
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'insights', label: 'AI Insights', icon: Sparkles }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id as any)}
                className={`btn-hover ${activeTab === tab.id ? 'bg-gradient-to-r from-accent to-primary text-white shadow-md' : 'hover:bg-accent/5'}`}
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
          {activeTab === 'invoicing' && <InvoicingTab data={data} />}
          {activeTab === 'gst' && <GSTTab data={data} />}
          {activeTab === 'clients' && <ClientsTab data={data} />}
          {activeTab === 'insights' && <InsightsTab data={data} />}
        </div>
      </div>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ data }: { data: HustleMasterData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Revenue Breakdown */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-success/10 to-secondary/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-success" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Revenue Breakdown</CardTitle>
                <CardDescription>Monthly revenue by service type</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.revenue.breakdown.map((item, index) => (
                <div key={index} className="group p-4 rounded-xl hover:bg-success/5 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-success to-secondary rounded-full"></div>
                      <span className="font-medium text-foreground">{item.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">₹{item.amount.toLocaleString()}</div>
                      <div className="text-sm text-success">+{item.growth}%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>{item.percentage}% of total revenue</span>
                    <span>Growth: {item.growth}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cashflow Chart */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
                <LineChart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">6-Month Cashflow Trend</CardTitle>
                <CardDescription>Revenue, expenses, and net cashflow</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.cashflow.map((month, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-4 rounded-xl hover:bg-primary/5 transition-colors">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">{month.month}</div>
                    <div className="text-lg font-bold text-foreground">₹{(month.revenue / 100000).toFixed(1)}L</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Expenses</div>
                    <div className="text-lg font-bold text-destructive">₹{(month.expenses / 100000).toFixed(1)}L</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Net</div>
                    <div className="text-lg font-bold text-success">₹{(month.netCashflow / 100000).toFixed(1)}L</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Tax Reserve</div>
                    <div className="text-lg font-bold text-secondary">₹{(month.taxReserve / 1000).toFixed(0)}K</div>
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
        <Card className="card-hover bg-gradient-to-br from-accent via-primary to-secondary border-0 shadow-xl text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create New Invoice</h3>
              <p className="text-white/80 mb-6 text-sm">
                Generate professional invoices with automatic GST calculation
              </p>
              <Button className="btn-hover w-full bg-white text-primary hover:bg-white/90 font-semibold">
                <Receipt className="w-4 h-4 mr-2" />
                New Invoice
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* GST Filing Status */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center">
                <Calculator className="w-4 h-4 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">GST Filing</CardTitle>
                <CardDescription>Q1 FY25 Status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Filing Status</span>
                <Badge variant={data.gst.filingStatus === 'filed' ? 'default' : 'destructive'}>
                  {data.gst.filingStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <span className="text-sm font-medium">{data.gst.dueDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Net Liability</span>
                <span className="text-sm font-bold text-destructive">₹{data.gst.netLiability.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Compliance Score</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-success">{data.gst.complianceScore}%</span>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
              <Button className="btn-hover w-full bg-gradient-to-r from-accent to-primary text-white">
                <FileText className="w-4 h-4 mr-2" />
                File GST Return
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Recent Activity</CardTitle>
                <CardDescription>Latest business updates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium">Payment Received</div>
                  <div className="text-xs text-muted-foreground">StartupXYZ paid ₹85,000</div>
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium">Invoice Sent</div>
                  <div className="text-xs text-muted-foreground">INV-2024-089 to TechCorp</div>
                  <div className="text-xs text-muted-foreground">1 day ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                <div className="w-2 h-2 bg-destructive rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium">Payment Overdue</div>
                  <div className="text-xs text-muted-foreground">Creative Agency ₹95,000</div>
                  <div className="text-xs text-muted-foreground">3 days ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Placeholder tabs (simplified for brevity)
function InvoicingTab({ data }: { data: HustleMasterData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Receipt className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Smart Invoicing Hub</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Create, track, and manage invoices with automatic GST calculation and payment reminders
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="btn-hover bg-gradient-to-r from-accent to-primary text-white px-8 py-4">
              <Plus className="w-5 h-5 mr-2" />
              Create Invoice
            </Button>
            <Button variant="outline" className="btn-hover border-accent/20 hover:bg-accent/5 px-8 py-4">
              <Download className="w-5 h-5 mr-2" />
              Export Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function GSTTab({ data }: { data: HustleMasterData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Calculator className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">GST & Tax Management</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Automated GST compliance, return filing, and tax optimization for freelancers
          </p>
          <Button className="btn-hover bg-gradient-to-r from-primary to-secondary text-white px-8 py-4">
            <Sparkles className="w-5 h-5 mr-2" />
            Auto-Generate GST Return
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientsTab({ data }: { data: HustleMasterData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Client Relationship Hub</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Manage clients, track projects, and optimize payment collection
          </p>
          <Button className="btn-hover bg-gradient-to-r from-secondary to-accent text-white px-8 py-4">
            <Users className="w-5 h-5 mr-2" />
            Manage Clients
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function InsightsTab({ data }: { data: HustleMasterData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {data.insights.map((insight) => (
        <Card key={insight.id} className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground">{insight.title}</CardTitle>
              <Badge variant={
                insight.impact === 'high' ? 'destructive' :
                insight.impact === 'medium' ? 'secondary' : 'outline'
              }>
                {insight.impact} impact
              </Badge>
            </div>
            <CardDescription>{insight.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {insight.metric && (
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-primary">
                  {insight.metric.unit === '₹' ? '₹' : ''}{insight.metric.value.toLocaleString()}{insight.metric.unit === '%' ? '%' : ''}
                </div>
                {insight.metric.trend === 'up' ? (
                  <TrendingUp className="w-6 h-6 text-success" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-destructive" />
                )}
              </div>
            )}
            {insight.action && (
              <Button className="btn-hover bg-gradient-to-r from-accent to-primary text-white">
                {insight.action}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
