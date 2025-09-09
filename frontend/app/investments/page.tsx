'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAuthStore } from '@/stores/auth-store'
import { 
  TrendingUp, 
  Target, 
  PieChart, 
  Wallet,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Settings,
  Sparkles,
  Brain,
  Zap,
  Trophy,
  Star,
  Shield,
  Clock,
  IndianRupee,
  BarChart3,
  LineChart,
  DollarSign,
  Building2,
  Home,
  GraduationCap,
  Plane,
  Car,
  Baby,
  Heart,
  Briefcase
} from 'lucide-react'

interface InvestmentGoal {
  id: string
  name: string
  target: number
  current: number
  monthly: number
  timeline: number
  priority: 'high' | 'medium' | 'low'
  category: 'emergency' | 'home' | 'education' | 'retirement' | 'vacation' | 'car' | 'wedding' | 'business'
  progress: number
  expectedReturn: number
  risk: 'low' | 'medium' | 'high'
  icon: any
}

interface Portfolio {
  totalValue: number
  totalInvested: number
  totalReturns: number
  returnPercentage: number
  allocation: {
    equity: number
    debt: number
    gold: number
    international: number
  }
  topFunds: Array<{
    name: string
    amount: number
    returns: number
    returnPercent: number
    category: string
  }>
}

interface AIRecommendation {
  type: 'rebalance' | 'invest' | 'withdraw' | 'optimize'
  title: string
  description: string
  impact: string
  confidence: number
  action: string
}

export default function InvestmentPage() {
  const { user } = useAuthStore()
  const [goals, setGoals] = useState<InvestmentGoal[]>([])
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const goalIcons = {
    emergency: Shield,
    home: Home,
    education: GraduationCap,
    retirement: Trophy,
    vacation: Plane,
    car: Car,
    wedding: Heart,
    business: Briefcase
  }

  useEffect(() => {
    // Mock data - in production, this would come from API
    const mockGoals: InvestmentGoal[] = [
      {
        id: '1',
        name: 'Emergency Fund',
        target: 500000,
        current: 375000,
        monthly: 15000,
        timeline: 8,
        priority: 'high',
        category: 'emergency',
        progress: 75,
        expectedReturn: 6,
        risk: 'low',
        icon: Shield
      },
      {
        id: '2',
        name: 'Home Down Payment',
        target: 2000000,
        current: 600000,
        monthly: 35000,
        timeline: 40,
        priority: 'high',
        category: 'home',
        progress: 30,
        expectedReturn: 12,
        risk: 'medium',
        icon: Home
      },
      {
        id: '3',
        name: 'Child Education',
        target: 1500000,
        current: 200000,
        monthly: 20000,
        timeline: 65,
        priority: 'medium',
        category: 'education',
        progress: 13,
        expectedReturn: 14,
        risk: 'high',
        icon: GraduationCap
      },
      {
        id: '4',
        name: 'Dream Vacation',
        target: 300000,
        current: 85000,
        monthly: 8000,
        timeline: 27,
        priority: 'low',
        category: 'vacation',
        progress: 28,
        expectedReturn: 10,
        risk: 'medium',
        icon: Plane
      }
    ]

    const mockPortfolio: Portfolio = {
      totalValue: 1260000,
      totalInvested: 1000000,
      totalReturns: 260000,
      returnPercentage: 26,
      allocation: {
        equity: 65,
        debt: 25,
        gold: 5,
        international: 5
      },
      topFunds: [
        {
          name: 'Axis Bluechip Fund',
          amount: 420000,
          returns: 89000,
          returnPercent: 26.8,
          category: 'Large Cap'
        },
        {
          name: 'Mirae Asset Large Cap',
          amount: 315000,
          returns: 67000,
          returnPercent: 27.1,
          category: 'Large Cap'
        },
        {
          name: 'HDFC Mid-Cap Opportunities',
          amount: 210000,
          returns: 58000,
          returnPercent: 38.1,
          category: 'Mid Cap'
        },
        {
          name: 'SBI Small Cap Fund',
          amount: 140000,
          returns: 42000,
          returnPercent: 42.9,
          category: 'Small Cap'
        }
      ]
    }

    const mockRecommendations: AIRecommendation[] = [
      {
        type: 'rebalance',
        title: 'Rebalance Portfolio',
        description: 'Your equity allocation is 5% higher than target. Consider moving some funds to debt.',
        impact: 'Reduce risk and maintain target allocation',
        confidence: 89,
        action: 'Rebalance Now'
      },
      {
        type: 'invest',
        title: 'Increase SIP Amount',
        description: 'You can afford to invest ₹5,000 more monthly based on your cash flow analysis.',
        impact: 'Additional ₹2.1L in 5 years',
        confidence: 92,
        action: 'Increase SIP'
      },
      {
        type: 'optimize',
        title: 'Switch to Direct Plans',
        description: 'Switch to direct mutual funds to save 1% in expense ratio annually.',
        impact: 'Save ₹12,600 annually',
        confidence: 95,
        action: 'Switch Now'
      }
    ]

    setGoals(mockGoals)
    setPortfolio(mockPortfolio)
    setRecommendations(mockRecommendations)
    setLoading(false)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`
    return `₹${num}`
  }

  if (loading || !portfolio) {
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
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Goal-Based Investing
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Build Wealth with{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Smart Investing
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Set your financial goals and let our AI create the perfect investment strategy. 
            Start with just ₹500 and watch your money grow intelligently.
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-primary mb-1 animate-count-up">
                {formatCurrency(portfolio.totalValue)}
              </div>
              <div className="flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4 text-success" />
                <span className="text-sm text-success font-medium">
                  +{portfolio.returnPercentage}% overall
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-success/20 to-secondary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Returns</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-success mb-1 animate-count-up">
                {formatCurrency(portfolio.totalReturns)}
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm text-success font-medium">
                  This year: ₹89,000
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly SIP</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-accent mb-1 animate-count-up">
                ₹78,000
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-sm text-accent font-medium">
                  Across 4 goals
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Goal Progress</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-secondary mb-1 animate-count-up">
                47%
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-secondary" />
                <span className="text-sm text-secondary font-medium">
                  Average completion
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Investment Goals */}
            <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-foreground">Investment Goals</CardTitle>
                      <CardDescription>Track progress towards your financial dreams</CardDescription>
                    </div>
                  </div>
                  <Button className="btn-hover bg-gradient-to-r from-primary to-secondary text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {goals.map((goal) => (
                    <div 
                      key={goal.id} 
                      className={`
                        p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                        ${selectedGoal === goal.id ? 
                          'border-primary bg-gradient-to-r from-primary/10 to-secondary/10' : 
                          'border-muted hover:border-primary/30 hover:bg-primary/5'
                        }
                      `}
                      onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`
                            w-14 h-14 rounded-2xl flex items-center justify-center
                            ${goal.priority === 'high' ? 'bg-gradient-to-br from-destructive/10 to-accent/10' :
                              goal.priority === 'medium' ? 'bg-gradient-to-br from-accent/10 to-primary/10' :
                              'bg-gradient-to-br from-primary/10 to-secondary/10'}
                          `}>
                            <goal.icon className={`
                              w-7 h-7
                              ${goal.priority === 'high' ? 'text-destructive' :
                                goal.priority === 'medium' ? 'text-accent' :
                                'text-primary'}
                            `} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">{goal.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Target: {formatCurrency(goal.target)}</span>
                              <span>•</span>
                              <span>{goal.timeline} months remaining</span>
                              <span>•</span>
                              <span className={`
                                px-2 py-1 rounded-full text-xs font-medium
                                ${goal.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                                  goal.priority === 'medium' ? 'bg-accent/10 text-accent' :
                                  'bg-primary/10 text-primary'}
                              `}>
                                {goal.priority} priority
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{goal.progress}%</div>
                          <div className="text-sm text-muted-foreground">complete</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{formatCurrency(goal.current)} / {formatCurrency(goal.target)}</span>
                        </div>
                        <Progress value={goal.progress} className="h-3" />
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Monthly SIP</span>
                            <div className="font-semibold text-foreground">{formatCurrency(goal.monthly)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected Return</span>
                            <div className="font-semibold text-success">{goal.expectedReturn}% p.a.</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Risk Level</span>
                            <div className={`
                              font-semibold capitalize
                              ${goal.risk === 'high' ? 'text-destructive' :
                                goal.risk === 'medium' ? 'text-accent' :
                                'text-success'}
                            `}>
                              {goal.risk}
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedGoal === goal.id && (
                        <div className="mt-6 pt-6 border-t border-muted/30">
                          <div className="flex gap-3">
                            <Button size="sm" className="btn-hover bg-gradient-to-r from-primary to-secondary text-white">
                              <Plus className="w-4 h-4 mr-1" />
                              Increase SIP
                            </Button>
                            <Button size="sm" variant="outline" className="btn-hover">
                              <Settings className="w-4 h-4 mr-1" />
                              Optimize
                            </Button>
                            <Button size="sm" variant="outline" className="btn-hover">
                              <BarChart3 className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Allocation */}
            <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl flex items-center justify-center">
                    <PieChart className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground">Portfolio Allocation</CardTitle>
                    <CardDescription>Diversified across asset classes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="text-3xl font-bold text-primary">{portfolio.allocation.equity}%</div>
                    <div className="text-sm text-muted-foreground">Equity</div>
                    <div className="text-xs text-success font-medium">+12.8% returns</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-secondary/5 to-accent/5">
                    <div className="text-3xl font-bold text-secondary">{portfolio.allocation.debt}%</div>
                    <div className="text-sm text-muted-foreground">Debt</div>
                    <div className="text-xs text-success font-medium">+7.2% returns</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/5 to-primary/5">
                    <div className="text-3xl font-bold text-accent">{portfolio.allocation.gold}%</div>
                    <div className="text-sm text-muted-foreground">Gold</div>
                    <div className="text-xs text-success font-medium">+8.9% returns</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5">
                    <div className="text-3xl font-bold text-primary">{portfolio.allocation.international}%</div>
                    <div className="text-sm text-muted-foreground">International</div>
                    <div className="text-xs text-success font-medium">+15.1% returns</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-6">
            <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground">AI Recommendations</CardTitle>
                    <CardDescription>Personalized investment advice</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 transition-all duration-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-success">{rec.impact}</div>
                              <div className="text-xs text-muted-foreground">{rec.confidence}% confidence</div>
                            </div>
                            <Button size="sm" className="btn-hover bg-gradient-to-r from-primary to-secondary text-white">
                              {rec.action}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-hover bg-gradient-to-br from-primary via-secondary to-accent border-0 shadow-xl text-white">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Start Investing Today</h3>
                  <p className="text-white/80 text-sm">
                    Begin your investment journey with as little as ₹500
                  </p>
                </div>
                <div className="space-y-3">
                  <Button className="w-full btn-hover bg-white text-primary hover:bg-white/90 font-semibold">
                    <Plus className="w-4 h-4 mr-2" />
                    Start New SIP
                  </Button>
                  <Button variant="outline" className="w-full border-white/40 text-white hover:bg-white/10">
                    <Target className="w-4 h-4 mr-2" />
                    Set New Goal
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/60">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>SEBI Regulated</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Instant Setup</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
