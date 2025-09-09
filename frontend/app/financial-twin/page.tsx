'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  PiggyBank,
  Building2
} from 'lucide-react'

interface FinancialData {
  totalIncome: number
  totalExpenses: number
  netWorth: number
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
  cashflow: Array<{
    month: string
    income: number
    expenses: number
    savings: number
  }>
  categories: Array<{
    name: string
    amount: number
    percentage: number
    trend: 'up' | 'down'
  }>
  insights: Array<{
    type: 'warning' | 'success' | 'info'
    title: string
    description: string
    action?: string
  }>
  goals: Array<{
    id: string
    name: string
    target: number
    current: number
    deadline: string
    progress: number
  }>
}

export default function FinancialTwinPage() {
  const { user } = useAuthStore()
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('6M')

  useEffect(() => {
    // Simulate API call to fetch financial data
    const fetchFinancialData = async () => {
      try {
        // Mock data - in production, this would come from the backend
        const mockData: FinancialData = {
          totalIncome: 1250000,
          totalExpenses: 875000,
          netWorth: 375000,
          monthlyIncome: 85000,
          monthlyExpenses: 65000,
          savingsRate: 23.5,
          cashflow: [
            { month: 'Jan', income: 80000, expenses: 60000, savings: 20000 },
            { month: 'Feb', income: 85000, expenses: 65000, savings: 20000 },
            { month: 'Mar', income: 90000, expenses: 70000, savings: 20000 },
            { month: 'Apr', income: 85000, expenses: 62000, savings: 23000 },
            { month: 'May', income: 88000, expenses: 68000, savings: 20000 },
            { month: 'Jun', income: 92000, expenses: 71000, savings: 21000 }
          ],
          categories: [
            { name: 'Food & Dining', amount: 15000, percentage: 23, trend: 'up' },
            { name: 'Transportation', amount: 12000, percentage: 18, trend: 'down' },
            { name: 'Entertainment', amount: 8000, percentage: 12, trend: 'up' },
            { name: 'Shopping', amount: 10000, percentage: 15, trend: 'down' },
            { name: 'Bills & Utilities', amount: 20000, percentage: 32, trend: 'up' }
          ],
          insights: [
            {
              type: 'warning',
              title: 'High Food Expenses',
              description: 'Your food expenses are 15% higher than last month. Consider meal planning to reduce costs.',
              action: 'View Tips'
            },
            {
              type: 'success',
              title: 'Savings Goal Achieved',
              description: 'Congratulations! You\'ve exceeded your monthly savings target by ₹2,000.',
              action: 'Set New Goal'
            },
            {
              type: 'info',
              title: 'Tax Optimization Opportunity',
              description: 'You can save ₹15,000 in taxes by investing in ELSS funds before March 31st.',
              action: 'Learn More'
            }
          ],
          goals: [
            {
              id: '1',
              name: 'Emergency Fund',
              target: 500000,
              current: 375000,
              deadline: '2024-12-31',
              progress: 75
            },
            {
              id: '2',
              name: 'Home Down Payment',
              target: 2000000,
              current: 800000,
              deadline: '2025-06-30',
              progress: 40
            },
            {
              id: '3',
              name: 'Vacation Fund',
              target: 100000,
              current: 45000,
              deadline: '2024-08-15',
              progress: 45
            }
          ]
        }
        
        setFinancialData(mockData)
      } catch (error) {
        console.error('Error fetching financial data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFinancialData()
  }, [selectedPeriod])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!financialData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Financial Data Available</h1>
          <p className="text-gray-600 mb-6">Connect your accounts or upload documents to get started.</p>
          <Button>Connect Account</Button>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground leading-tight">
                  Welcome back, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user?.firstName}!</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Your AI Financial Twin is analyzing your data 24/7
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
              {['1M', '3M', '6M', '1Y'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className={`btn-hover ${selectedPeriod === period ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' : 'hover:bg-primary/5'}`}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-success/20 to-secondary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-success/10 to-secondary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-success mb-1 animate-count-up">
                {formatCurrency(financialData.totalIncome)}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <p className="text-sm text-success font-medium">
                  +12.5% from last period
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-destructive/20 to-accent/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-destructive/10 to-accent/10 rounded-xl flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-destructive mb-1 animate-count-up">
                {formatCurrency(financialData.totalExpenses)}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                <p className="text-sm text-destructive font-medium">
                  +8.2% from last period
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Worth</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-primary mb-1 animate-count-up">
                {formatCurrency(financialData.netWorth)}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <p className="text-sm text-primary font-medium">
                  +15.3% from last period
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl flex items-center justify-center">
                <PiggyBank className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-accent mb-1 animate-count-up">
                {formatPercentage(financialData.savingsRate)}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <p className="text-sm text-accent font-medium">
                  Target: 20% ✓ Exceeded!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Cashflow Chart */}
          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">Monthly Cashflow</CardTitle>
                  <CardDescription className="text-muted-foreground">Income vs Expenses with AI insights</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialData.cashflow.map((month, index) => (
                  <div key={month.month} className="group p-4 rounded-xl hover:bg-primary/5 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <span className="text-sm font-bold text-primary">{month.month}</span>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-foreground">{month.month} 2024</div>
                          <div className="text-sm text-muted-foreground">
                            <span className="text-success font-medium">{formatCurrency(month.income)}</span> income • 
                            <span className="text-destructive font-medium ml-1">{formatCurrency(month.expenses)}</span> expenses
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-success">
                          {formatCurrency(month.savings)}
                        </div>
                        <div className="text-sm text-muted-foreground">saved</div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 w-full bg-muted/30 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-success to-secondary h-2 rounded-full transition-all duration-500 animate-chart-grow" 
                        style={{ width: `${(month.savings / month.income) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.categories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div>
                      <div className="text-sm font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">
                        {formatPercentage(category.percentage)} of total
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium">
                      {formatCurrency(category.amount)}
                    </div>
                    {category.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-red-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI Insights & Recommendations</CardTitle>
            <CardDescription>Personalized financial advice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border">
                  <div className="flex-shrink-0">
                    {insight.type === 'warning' && (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    )}
                    {insight.type === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {insight.type === 'info' && (
                      <Target className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {insight.description}
                    </p>
                    {insight.action && (
                      <Button variant="outline" size="sm">
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Goals</CardTitle>
            <CardDescription>Track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.goals.map((goal) => (
                <div key={goal.id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {goal.name}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatPercentage(goal.progress)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatCurrency(goal.current)} / {formatCurrency(goal.target)}</span>
                    <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}