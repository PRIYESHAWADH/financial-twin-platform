'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAuthStore } from '@/stores/auth-store'
import { 
  FileText, 
  Calculator, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles,
  Brain,
  ArrowRight,
  ArrowLeft,
  Download,
  RefreshCw,
  Zap,
  Shield,
  Clock,
  Trophy,
  Star,
  PieChart,
  TrendingUp,
  Target,
  Lightbulb
} from 'lucide-react'

interface TaxFilingStep {
  id: string
  title: string
  description: string
  completed: boolean
  current: boolean
  icon: any
}

interface TaxData {
  financialYear: string
  income: {
    salary: number
    business: number
    capitalGains: number
    other: number
    total: number
  }
  deductions: {
    section80C: number
    section80D: number
    homeLoanInterest: number
    other: number
    total: number
  }
  taxLiability: {
    grossTax: number
    tds: number
    advanceTax: number
    netPayable: number
    refund: number
  }
  suggestions: Array<{
    type: 'deduction' | 'investment' | 'planning'
    title: string
    description: string
    impact: number
    actionText: string
  }>
}

export default function TaxFilingPage() {
  const { user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [taxData, setTaxData] = useState<TaxData | null>(null)
  const [loading, setLoading] = useState(false)
  const [filing, setFiling] = useState(false)

  const steps: TaxFilingStep[] = [
    {
      id: 'connect',
      title: 'Connect Accounts',
      description: 'AI fetches your financial data automatically',
      completed: true,
      current: false,
      icon: Brain
    },
    {
      id: 'analyze',
      title: 'AI Analysis',
      description: 'Smart categorization and optimization',
      completed: true,
      current: false,
      icon: Sparkles
    },
    {
      id: 'review',
      title: 'Review & Optimize',
      description: 'Verify details and maximize savings',
      completed: false,
      current: true,
      icon: Calculator
    },
    {
      id: 'file',
      title: 'File ITR',
      description: 'One-click filing with e-verification',
      completed: false,
      current: false,
      icon: FileText
    }
  ]

  useEffect(() => {
    // Simulate AI analysis
    const mockTaxData: TaxData = {
      financialYear: '2023-24',
      income: {
        salary: 1200000,
        business: 300000,
        capitalGains: 50000,
        other: 25000,
        total: 1575000
      },
      deductions: {
        section80C: 150000,
        section80D: 25000,
        homeLoanInterest: 100000,
        other: 50000,
        total: 325000
      },
      taxLiability: {
        grossTax: 187500,
        tds: 120000,
        advanceTax: 50000,
        netPayable: 17500,
        refund: 0
      },
      suggestions: [
        {
          type: 'investment',
          title: 'Invest ₹50,000 in ELSS',
          description: 'Complete your 80C limit and save ₹15,000 in taxes',
          impact: 15000,
          actionText: 'Invest Now'
        },
        {
          type: 'deduction',
          title: 'Claim Health Insurance Premium',
          description: 'Add your parents\' health insurance for additional deduction',
          impact: 12000,
          actionText: 'Add Details'
        },
        {
          type: 'planning',
          title: 'Switch to New Tax Regime',
          description: 'You could save ₹8,000 by switching to the new tax regime',
          impact: 8000,
          actionText: 'Compare'
        }
      ]
    }
    setTaxData(mockTaxData)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleFileTax = async () => {
    setFiling(true)
    
    // Simulate filing process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setFiling(false)
    setCurrentStep(3)
    
    // Update steps
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      completed: index <= 3,
      current: index === 3
    }))
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  if (!taxData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
              <div className="h-64 bg-muted rounded mb-6"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Tax Filing
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            File Your ITR in{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              5 Minutes
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI has analyzed your financial data and prepared your tax return. 
            Review, optimize, and file with just a few clicks.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <Progress value={progress} className="h-3 bg-muted/30" />
            <div className="flex justify-between mt-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all duration-300
                    ${step.completed ? 'bg-gradient-to-br from-success to-secondary text-white shadow-lg' : 
                      step.current ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg animate-pulse' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    {step.completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-medium ${step.current ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Tax Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Income Summary */}
              <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-secondary/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-foreground">Income Summary</CardTitle>
                      <CardDescription>Financial Year {taxData.financialYear}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-success/5 to-secondary/5">
                      <div className="text-2xl font-bold text-success">{formatCurrency(taxData.income.salary)}</div>
                      <div className="text-sm text-muted-foreground">Salary Income</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                      <div className="text-2xl font-bold text-primary">{formatCurrency(taxData.income.business)}</div>
                      <div className="text-sm text-muted-foreground">Business Income</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/5 to-primary/5">
                      <div className="text-2xl font-bold text-accent">{formatCurrency(taxData.income.capitalGains)}</div>
                      <div className="text-sm text-muted-foreground">Capital Gains</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-secondary/5 to-accent/5">
                      <div className="text-2xl font-bold text-secondary">{formatCurrency(taxData.income.other)}</div>
                      <div className="text-sm text-muted-foreground">Other Income</div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-foreground">Total Gross Income</span>
                      <span className="text-3xl font-bold text-primary">{formatCurrency(taxData.income.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tax Calculation */}
              <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-foreground">Tax Calculation</CardTitle>
                      <CardDescription>Optimized by AI for maximum savings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-muted/30">
                      <span className="font-medium">Gross Total Income</span>
                      <span className="font-bold">{formatCurrency(taxData.income.total)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-success/10 to-secondary/10">
                      <span className="font-medium">Total Deductions</span>
                      <span className="font-bold text-success">-{formatCurrency(taxData.deductions.total)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
                      <span className="font-medium">Taxable Income</span>
                      <span className="font-bold text-primary">{formatCurrency(taxData.income.total - taxData.deductions.total)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-destructive/10 to-accent/10">
                      <span className="font-medium">Tax Payable</span>
                      <span className="font-bold text-destructive">{formatCurrency(taxData.taxLiability.netPayable)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Suggestions */}
            <div className="space-y-6">
              <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">AI Suggestions</CardTitle>
                      <CardDescription>Save more on taxes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {taxData.suggestions.map((suggestion, index) => (
                      <div key={index} className="p-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-all duration-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">{suggestion.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-success">Save {formatCurrency(suggestion.impact)}</span>
                              <Button size="sm" className="btn-hover bg-gradient-to-r from-primary to-secondary text-white">
                                {suggestion.actionText}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* File Tax Button */}
              <Card className="card-hover bg-gradient-to-br from-primary via-secondary to-accent border-0 shadow-xl text-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Ready to File!</h3>
                  <p className="text-white/80 mb-6">
                    Your ITR is prepared and optimized. File now to avoid last-minute rush.
                  </p>
                  <Button 
                    onClick={handleFileTax}
                    disabled={filing}
                    className="btn-hover w-full bg-white text-primary hover:bg-white/90 font-bold py-4 text-lg"
                  >
                    {filing ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Filing ITR...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        File ITR Now
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                  <div className="flex items-center justify-center gap-4 mt-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>Secure Filing</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Instant Processing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
