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
  Calculator,
  FileText,
  PiggyBank,
  Shield,
  Zap,
  Brain,
  Star,
  Clock,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Gift,
  Sparkles,
  IndianRupee,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  Heart,
  Home,
  GraduationCap,
  Plane,
  Plus
} from 'lucide-react'

interface SalaryWarriorData {
  taxProfile: {
    currentYear: string
    grossSalary: number
    standardDeduction: number
    professionalTax: number
    providentFund: number
    taxableIncome: number
    taxLiability: number
    taxDeducted: number
    refundDue: number
    effectiveRate: number
  }
  
  deductions: {
    section80C: {
      used: number
      limit: number
      available: number
      investments: DeductionItem[]
    }
    section80D: {
      used: number
      limit: number
      available: number
      premiums: DeductionItem[]
    }
    homeLoanInterest: {
      used: number
      limit: number
      available: number
    }
    hra: {
      eligible: boolean
      claimed: number
      potential: number
      rentPaid: number
    }
  }
  
  insights: AIInsight[]
  recommendations: TaxRecommendation[]
  goals: FinancialGoal[]
  documents: TaxDocument[]
  timeline: TimelineEvent[]
}

interface DeductionItem {
  type: string
  provider: string
  amount: number
  date: Date
  verified: boolean
}

interface AIInsight {
  id: string
  type: 'opportunity' | 'warning' | 'tip' | 'achievement'
  title: string
  description: string
  impact: number
  action?: string
  priority: 'low' | 'medium' | 'high'
}

interface TaxRecommendation {
  id: string
  title: string
  description: string
  savings: number
  effort: 'easy' | 'medium' | 'complex'
  timeframe: string
  steps: string[]
  category: '80C' | '80D' | 'HRA' | 'NPS' | 'Other'
}

interface FinancialGoal {
  id: string
  name: string
  target: number
  current: number
  deadline: Date
  priority: number
  taxBenefit: number
  category: 'emergency' | 'investment' | 'insurance' | 'tax_saving'
}

interface TaxDocument {
  id: string
  type: string
  name: string
  status: 'uploaded' | 'processing' | 'verified' | 'missing'
  uploadDate?: Date
  aiExtracted?: boolean
}

interface TimelineEvent {
  date: Date
  title: string
  type: 'deadline' | 'reminder' | 'achievement' | 'opportunity'
  description: string
  action?: string
}

export default function SalaryWarriorPage() {
  const { user } = useAuthStore()
  const [data, setData] = useState<SalaryWarriorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'filing' | 'optimize' | 'goals'>('overview')

  useEffect(() => {
    // Mock data - in production, this would come from API
    const mockData: SalaryWarriorData = {
      taxProfile: {
        currentYear: '2024-25',
        grossSalary: 1200000,
        standardDeduction: 50000,
        professionalTax: 2500,
        providentFund: 144000,
        taxableIncome: 1003500,
        taxLiability: 112875,
        taxDeducted: 125000,
        refundDue: 12125,
        effectiveRate: 11.24
      },
      
      deductions: {
        section80C: {
          used: 120000,
          limit: 150000,
          available: 30000,
          investments: [
            { type: 'PPF', provider: 'SBI', amount: 50000, date: new Date('2024-01-15'), verified: true },
            { type: 'ELSS', provider: 'Axis Mutual Fund', amount: 40000, date: new Date('2024-02-10'), verified: true },
            { type: 'Life Insurance', provider: 'LIC', amount: 30000, date: new Date('2024-03-01'), verified: true }
          ]
        },
        section80D: {
          used: 15000,
          limit: 25000,
          available: 10000,
          premiums: [
            { type: 'Health Insurance', provider: 'Star Health', amount: 15000, date: new Date('2024-04-01'), verified: true }
          ]
        },
        homeLoanInterest: {
          used: 85000,
          limit: 200000,
          available: 115000
        },
        hra: {
          eligible: true,
          claimed: 120000,
          potential: 144000,
          rentPaid: 180000
        }
      },
      
      insights: [
        {
          id: '1',
          type: 'opportunity',
          title: 'Save ₹7,800 with ELSS Investment',
          description: 'Invest ₹30,000 more in ELSS to complete your 80C limit and get tax benefits plus market returns.',
          impact: 7800,
          action: 'Invest Now',
          priority: 'high'
        },
        {
          id: '2',
          type: 'tip',
          title: 'HRA Optimization Available',
          description: 'You can claim ₹24,000 more in HRA deduction. Make sure you have proper rent receipts.',
          impact: 6240,
          action: 'Upload Receipts',
          priority: 'medium'
        },
        {
          id: '3',
          type: 'achievement',
          title: 'Great PPF Contribution!',
          description: 'Your PPF investment is on track. You\'ll build a strong retirement corpus with tax benefits.',
          impact: 0,
          priority: 'low'
        }
      ],
      
      recommendations: [
        {
          id: '1',
          title: 'Complete 80C Investment',
          description: 'Invest remaining ₹30,000 in ELSS mutual funds for tax saving and wealth creation',
          savings: 7800,
          effort: 'easy',
          timeframe: 'Before March 31',
          steps: [
            'Choose a good ELSS fund',
            'Set up SIP for remaining amount',
            'Upload investment proof'
          ],
          category: '80C'
        },
        {
          id: '2',
          title: 'Increase Health Insurance Coverage',
          description: 'Add your parents to get additional ₹25,000 deduction under 80D',
          savings: 6500,
          effort: 'medium',
          timeframe: 'Next policy renewal',
          steps: [
            'Compare family floater plans',
            'Include parents in policy',
            'Submit premium receipts'
          ],
          category: '80D'
        }
      ],
      
      goals: [
        {
          id: '1',
          name: 'Emergency Fund',
          target: 600000,
          current: 450000,
          deadline: new Date('2024-12-31'),
          priority: 1,
          taxBenefit: 0,
          category: 'emergency'
        },
        {
          id: '2',
          name: 'Home Down Payment',
          target: 2000000,
          current: 800000,
          deadline: new Date('2026-03-31'),
          priority: 2,
          taxBenefit: 200000,
          category: 'investment'
        }
      ],
      
      documents: [
        { id: '1', type: 'Form 16', name: 'Form16_2024.pdf', status: 'verified', uploadDate: new Date('2024-05-15'), aiExtracted: true },
        { id: '2', type: 'Investment Proof', name: 'PPF_Certificate.pdf', status: 'verified', uploadDate: new Date('2024-06-01'), aiExtracted: true },
        { id: '3', type: 'Rent Receipts', name: 'rent_receipts_2024.pdf', status: 'processing', uploadDate: new Date('2024-06-10'), aiExtracted: false },
        { id: '4', type: 'Medical Bills', name: '', status: 'missing' }
      ],
      
      timeline: [
        {
          date: new Date('2024-07-31'),
          title: 'ITR Filing Deadline',
          type: 'deadline',
          description: 'File your Income Tax Return for FY 2023-24',
          action: 'File Now'
        },
        {
          date: new Date('2024-12-31'),
          title: 'Tax Saving Deadline',
          type: 'deadline',
          description: 'Last date for tax-saving investments for FY 2024-25'
        },
        {
          date: new Date('2024-07-20'),
          title: 'ELSS Investment Reminder',
          type: 'reminder',
          description: 'Complete your 80C limit with ELSS investment'
        }
      ]
    }
    
    setData(mockData)
    setLoading(false)
  }, [])

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
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">
                    Welcome back, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user?.firstName}!</span>
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Your Salary Warrior command center - taxes made simple
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-success to-secondary text-white border-0 shadow-lg">
                <Trophy className="w-3 h-3 mr-1" />
                Tax Optimized
              </Badge>
              {data.taxProfile.refundDue > 0 && (
                <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 shadow-lg">
                  <Gift className="w-3 h-3 mr-1" />
                  Refund Due!
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-success/20 to-secondary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tax Refund</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-success/10 to-secondary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-success mb-1 animate-count-up">
                {formatCurrency(data.taxProfile.refundDue)}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-success font-medium">Expected in 2-3 weeks</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tax Saved This Year</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                  <PiggyBank className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-primary mb-1 animate-count-up">
                ₹35,100
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-medium">Through smart planning</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Deductions</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-accent mb-1 animate-count-up">
                ₹55,000
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm text-accent font-medium">More savings possible</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Effective Tax Rate</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-secondary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-secondary mb-1 animate-count-up">
                {data.taxProfile.effectiveRate}%
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-sm text-secondary font-medium">Below average!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
            {[
              { id: 'overview', label: 'Overview', icon: Brain },
              { id: 'filing', label: 'ITR Filing', icon: FileText },
              { id: 'optimize', label: 'Optimize Tax', icon: Zap },
              { id: 'goals', label: 'Goals', icon: Target }
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
          {activeTab === 'filing' && <ITRFilingTab data={data} />}
          {activeTab === 'optimize' && <OptimizationTab data={data} />}
          {activeTab === 'goals' && <GoalsTab data={data} />}
        </div>
      </div>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ data }: { data: SalaryWarriorData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* AI Insights */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">AI Financial Insights</CardTitle>
                <CardDescription>Personalized recommendations just for you</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.insights.map((insight) => (
                <div key={insight.id} className={`
                  p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                  ${insight.type === 'opportunity' ? 'border-success/20 bg-success/5' :
                    insight.type === 'warning' ? 'border-destructive/20 bg-destructive/5' :
                    insight.type === 'achievement' ? 'border-primary/20 bg-primary/5' :
                    'border-muted/20 bg-muted/5'}
                `}>
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${insight.type === 'opportunity' ? 'bg-success/10' :
                        insight.type === 'warning' ? 'bg-destructive/10' :
                        insight.type === 'achievement' ? 'bg-primary/10' :
                        'bg-muted/10'}
                    `}>
                      {insight.type === 'opportunity' && <Lightbulb className="w-4 h-4 text-success" />}
                      {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-destructive" />}
                      {insight.type === 'achievement' && <Trophy className="w-4 h-4 text-primary" />}
                      {insight.type === 'tip' && <Star className="w-4 h-4 text-accent" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{insight.title}</h4>
                      <p className="text-muted-foreground text-sm mb-2">{insight.description}</p>
                      {insight.impact > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-success">
                            Potential savings: ₹{insight.impact.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {insight.action && (
                        <Button size="sm" className="btn-hover bg-gradient-to-r from-primary to-secondary text-white">
                          {insight.action}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tax Breakdown */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Tax Calculation Breakdown</CardTitle>
                <CardDescription>Your tax computation for FY {data.taxProfile.currentYear}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <span className="font-medium">Gross Salary</span>
                <span className="font-bold">₹{data.taxProfile.grossSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-success/10">
                <span className="font-medium">Less: Deductions</span>
                <span className="font-bold text-success">-₹{(data.taxProfile.grossSalary - data.taxProfile.taxableIncome).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10 border-2 border-primary/20">
                <span className="font-medium">Taxable Income</span>
                <span className="font-bold text-primary">₹{data.taxProfile.taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-destructive/10">
                <span className="font-medium">Tax Liability</span>
                <span className="font-bold text-destructive">₹{data.taxProfile.taxLiability.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <span className="font-medium">TDS Deducted</span>
                <span className="font-bold">₹{data.taxProfile.taxDeducted.toLocaleString()}</span>
              </div>
              {data.taxProfile.refundDue > 0 ? (
                <div className="flex justify-between items-center p-3 rounded-lg bg-success/20 border-2 border-success/30">
                  <span className="font-medium text-success">Refund Due</span>
                  <span className="font-bold text-success">₹{data.taxProfile.refundDue.toLocaleString()}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center p-3 rounded-lg bg-destructive/20 border-2 border-destructive/30">
                  <span className="font-medium text-destructive">Additional Tax Due</span>
                  <span className="font-bold text-destructive">₹{Math.abs(data.taxProfile.refundDue).toLocaleString()}</span>
                </div>
              )}
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
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ready to File ITR?</h3>
              <p className="text-white/80 mb-6 text-sm">
                Your tax return is 95% ready. Complete filing in just 2 minutes!
              </p>
              <Button className="btn-hover w-full bg-white text-primary hover:bg-white/90 font-semibold">
                <FileText className="w-4 h-4 mr-2" />
                File ITR Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Upcoming Deadlines</CardTitle>
                <CardDescription>Don't miss important dates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.timeline.slice(0, 3).map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                    ${event.type === 'deadline' ? 'bg-destructive/10 text-destructive' :
                      event.type === 'reminder' ? 'bg-accent/10 text-accent' :
                      'bg-primary/10 text-primary'}
                  `}>
                    {event.date.getDate()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{event.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {event.date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents Status */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Document Status</CardTitle>
                <CardDescription>AI-extracted data ready</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors">
                  <div>
                    <div className="font-medium text-foreground text-sm">{doc.type}</div>
                    {doc.name && (
                      <div className="text-xs text-muted-foreground">{doc.name}</div>
                    )}
                  </div>
                  <Badge variant={
                    doc.status === 'verified' ? 'default' :
                    doc.status === 'processing' ? 'secondary' :
                    doc.status === 'missing' ? 'destructive' : 'outline'
                  } className="text-xs">
                    {doc.status === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {doc.status === 'processing' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                    {doc.status === 'missing' && <Upload className="w-3 h-3 mr-1" />}
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ITR Filing Tab (simplified placeholder)
function ITRFilingTab({ data }: { data: SalaryWarriorData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">ITR Filing Wizard</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Your tax return is pre-filled and ready to submit. Review and file in under 5 minutes!
          </p>
          <Button className="btn-hover bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 text-lg font-semibold">
            <Sparkles className="w-5 h-5 mr-2" />
            Start Filing Process
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Optimization Tab (simplified placeholder)
function OptimizationTab({ data }: { data: SalaryWarriorData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {data.recommendations.map((rec) => (
        <Card key={rec.id} className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground">{rec.title}</CardTitle>
              <Badge className="bg-success/10 text-success border-success/20">
                Save ₹{rec.savings.toLocaleString()}
              </Badge>
            </div>
            <CardDescription>{rec.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{rec.timeframe}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{rec.effort} effort</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Steps to complete:</h4>
                <ul className="space-y-1">
                  {rec.steps.map((step, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="btn-hover w-full bg-gradient-to-r from-primary to-secondary text-white">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Goals Tab (simplified placeholder)
function GoalsTab({ data }: { data: SalaryWarriorData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {data.goals.map((goal) => {
        const progress = (goal.current / goal.target) * 100
        const getGoalIcon = (category: string) => {
          switch (category) {
            case 'emergency': return Shield
            case 'investment': return Home
            case 'insurance': return Heart
            case 'tax_saving': return PiggyBank
            default: return Target
          }
        }
        
        const Icon = getGoalIcon(goal.category)
        
        return (
          <Card key={goal.id} className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">{goal.name}</CardTitle>
                  <CardDescription>Target: ₹{goal.target.toLocaleString()}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between text-sm mt-2 text-muted-foreground">
                    <span>₹{goal.current.toLocaleString()}</span>
                    <span>₹{goal.target.toLocaleString()}</span>
                  </div>
                </div>
                {goal.taxBenefit > 0 && (
                  <div className="bg-success/10 p-3 rounded-lg">
                    <div className="text-sm font-medium text-success">Tax Benefit Available</div>
                    <div className="text-sm text-muted-foreground">
                      Save up to ₹{goal.taxBenefit.toLocaleString()} in taxes
                    </div>
                  </div>
                )}
                <Button className="btn-hover w-full bg-gradient-to-r from-primary to-secondary text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Contribute Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
