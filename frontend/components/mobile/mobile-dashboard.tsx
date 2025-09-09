'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuthStore } from '@/stores/auth-store'
import { QuickActions } from './quick-actions'
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  Calendar,
  FileText,
  Zap,
  Brain,
  Sparkles,
  ArrowRight,
  Eye,
  MoreHorizontal,
  Bell,
  Star,
  Users,
  Building2,
  Receipt,
  Calculator,
  Scale,
  Heart,
  Shield,
  Gift,
  Trophy,
  Activity,
  Globe,
  Briefcase,
  PiggyBank,
  CreditCard,
  BarChart3,
  LineChart,
  PieChart,
  Home,
  Car,
  GraduationCap,
  Plane,
  Wallet,
  Phone,
  Mail,
  MessageSquare,
  Video,
  ChevronRight,
  Plus,
  Minus,
  Info,
  ExternalLink,
  RefreshCw,
  Download,
  Share2,
  Settings,
  HelpCircle,
  X
} from 'lucide-react'

interface MobileDashboardProps {
  className?: string
}

interface DashboardData {
  user: {
    name: string
    persona: string
    completionScore: number
    lastActive: Date
  }
  
  summary: {
    totalSavings: number
    pendingTasks: number
    nextDeadline: Date
    aiInsights: number
  }
  
  quickStats: QuickStat[]
  insights: AIInsight[]
  tasks: Task[]
  deadlines: Deadline[]
  notifications: Notification[]
  trends: TrendData[]
}

interface QuickStat {
  id: string
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: any
  color: string
  description: string
}

interface AIInsight {
  id: string
  type: 'opportunity' | 'warning' | 'tip' | 'achievement'
  title: string
  description: string
  impact: number
  confidence: number
  action?: {
    label: string
    href: string
  }
}

interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: Date
  progress: number
  category: string
  estimated: number // minutes
}

interface Deadline {
  id: string
  title: string
  date: Date
  type: 'tax' | 'compliance' | 'payment' | 'document'
  urgency: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: Date
  read: boolean
  action?: {
    label: string
    href: string
  }
}

interface TrendData {
  period: string
  value: number
  category: string
}

export function MobileDashboard({ className }: MobileDashboardProps) {
  const { user } = useAuthStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setRefreshing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockData: DashboardData = {
      user: {
        name: user?.firstName + ' ' + user?.lastName || 'User',
        persona: user?.primaryPersona || 'salary_warrior',
        completionScore: 85,
        lastActive: new Date()
      },
      
      summary: {
        totalSavings: 125000,
        pendingTasks: 8,
        nextDeadline: new Date('2024-07-15'),
        aiInsights: 12
      },
      
      quickStats: [
        {
          id: 'savings',
          title: 'Total Tax Savings',
          value: '₹1.25L',
          change: 23.5,
          trend: 'up',
          icon: PiggyBank,
          color: 'text-green-600',
          description: 'AI-optimized savings this year'
        },
        {
          id: 'completion',
          title: 'Profile Completion',
          value: '85%',
          change: 15,
          trend: 'up',
          icon: Target,
          color: 'text-blue-600',
          description: 'Complete for better insights'
        },
        {
          id: 'deadlines',
          title: 'Upcoming Deadlines',
          value: '3',
          change: -2,
          trend: 'down',
          icon: Clock,
          color: 'text-orange-600',
          description: 'Next: GST filing on July 20'
        },
        {
          id: 'documents',
          title: 'Documents Processed',
          value: '24',
          change: 8,
          trend: 'up',
          icon: FileText,
          color: 'text-purple-600',
          description: 'AI-extracted and verified'
        }
      ],
      
      insights: [
        {
          id: '1',
          type: 'opportunity',
          title: 'Save ₹15,000 More',
          description: 'Invest ₹50,000 in ELSS before March 31 to maximize tax savings under Section 80C.',
          impact: 15000,
          confidence: 94,
          action: {
            label: 'View Options',
            href: '/investments'
          }
        },
        {
          id: '2',
          type: 'warning',
          title: 'GST Filing Due Soon',
          description: 'Your quarterly GST return is due in 5 days. Ensure all invoices are updated.',
          impact: 0,
          confidence: 100,
          action: {
            label: 'File Now',
            href: '/gst-filing'
          }
        },
        {
          id: '3',
          type: 'achievement',
          title: 'Compliance Score: 96%',
          description: 'Excellent! You\'re ahead of 85% of taxpayers in compliance.',
          impact: 0,
          confidence: 100
        },
        {
          id: '4',
          type: 'tip',
          title: 'HRA Optimization',
          description: 'You can claim ₹12,000 more in HRA deduction with proper rent receipts.',
          impact: 3120,
          confidence: 87,
          action: {
            label: 'Learn More',
            href: '/hra-guide'
          }
        }
      ],
      
      tasks: [
        {
          id: '1',
          title: 'Upload Form 16',
          description: 'Upload your latest Form 16 for accurate tax calculation',
          priority: 'high',
          dueDate: new Date('2024-07-20'),
          progress: 0,
          category: 'Documents',
          estimated: 5
        },
        {
          id: '2',
          title: 'Review Investment Options',
          description: 'AI has found 3 tax-saving investment opportunities',
          priority: 'medium',
          dueDate: new Date('2024-07-25'),
          progress: 30,
          category: 'Planning',
          estimated: 15
        },
        {
          id: '3',
          title: 'GST Return Filing',
          description: 'File quarterly GST return with auto-generated data',
          priority: 'urgent',
          dueDate: new Date('2024-07-18'),
          progress: 75,
          category: 'Compliance',
          estimated: 20
        }
      ],
      
      deadlines: [
        {
          id: '1',
          title: 'GST Return Q1',
          date: new Date('2024-07-20'),
          type: 'compliance',
          urgency: 'high',
          description: 'Quarterly GST return filing deadline'
        },
        {
          id: '2',
          title: 'ITR Filing',
          date: new Date('2024-07-31'),
          type: 'tax',
          urgency: 'critical',
          description: 'Income Tax Return filing deadline'
        },
        {
          id: '3',
          title: 'TDS Payment',
          date: new Date('2024-07-07'),
          type: 'payment',
          urgency: 'medium',
          description: 'TDS payment due for June'
        }
      ],
      
      notifications: [
        {
          id: '1',
          title: 'Document Processed',
          message: 'Your Form 16 has been processed successfully with 95% confidence',
          type: 'success',
          timestamp: new Date('2024-06-20T10:30:00'),
          read: false,
          action: {
            label: 'View Details',
            href: '/documents/form16'
          }
        },
        {
          id: '2',
          title: 'New Tax Saving Opportunity',
          message: 'AI found a way to save ₹8,500 more on your taxes',
          type: 'info',
          timestamp: new Date('2024-06-20T09:15:00'),
          read: false,
          action: {
            label: 'Explore',
            href: '/opportunities'
          }
        },
        {
          id: '3',
          title: 'Reminder: GST Filing',
          message: 'Your GST return is due in 3 days',
          type: 'warning',
          timestamp: new Date('2024-06-19T16:00:00'),
          read: true
        }
      ],
      
      trends: [
        { period: 'Jan', value: 85000, category: 'savings' },
        { period: 'Feb', value: 92000, category: 'savings' },
        { period: 'Mar', value: 78000, category: 'savings' },
        { period: 'Apr', value: 105000, category: 'savings' },
        { period: 'May', value: 118000, category: 'savings' },
        { period: 'Jun', value: 125000, category: 'savings' }
      ]
    }
    
    setData(mockData)
    setLoading(false)
    setRefreshing(false)
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
    return `₹${amount.toLocaleString()}`
  }

  const getPersonaGreeting = (persona: string) => {
    const greetings = {
      salary_warrior: 'Ready to optimize your taxes?',
      hustle_master: 'Let\'s grow your business!',
      business_builder: 'Scale your enterprise smartly',
      tax_expert: 'Manage your practice efficiently',
      corporate_commander: 'Command your finances',
      wealth_guardian: 'Protect and grow your wealth'
    }
    return greetings[persona as keyof typeof greetings] || 'Welcome to FinTwin!'
  }

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const getDeadlineUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-blue-600 bg-blue-50'
      default: return 'text-green-600 bg-green-50'
    }
  }

  if (loading) {
    return (
      <div className={`space-y-4 animate-pulse ${className}`}>
        <div className="h-32 bg-muted rounded-xl"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-muted rounded-lg"></div>
          <div className="h-24 bg-muted rounded-lg"></div>
        </div>
        <div className="h-48 bg-muted rounded-xl"></div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Welcome Header */}
      <Card className="card-hover bg-gradient-to-br from-primary via-secondary to-accent border-0 shadow-xl text-white overflow-hidden">
        <CardContent className="p-6 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl transform -translate-x-12 translate-y-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  Hello, {data.user.name.split(' ')[0]}! 👋
                </h2>
                <p className="text-white/80 text-sm">
                  {getPersonaGreeting(data.user.persona)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
                onClick={loadDashboardData}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(data.summary.totalSavings)}</div>
                <div className="text-xs text-white/70">Total Savings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{data.summary.pendingTasks}</div>
                <div className="text-xs text-white/70">Pending Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{data.summary.aiInsights}</div>
                <div className="text-xs text-white/70">AI Insights</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/80">Profile Completion</span>
                <span className="font-bold">{data.user.completionScore}%</span>
              </div>
              <Progress value={data.user.completionScore} className="h-2 bg-white/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        {data.quickStats.map((stat) => {
          const Icon = stat.icon
          
          return (
            <Card key={stat.id} className="card-hover border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : stat.trend === 'down' ? (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    ) : null}
                    <span className={stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
                  </div>
                </div>
                
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground leading-tight">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* AI Insights */}
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">AI Insights</CardTitle>
                <CardDescription className="text-sm">Personalized recommendations</CardDescription>
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {data.insights.length} new
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {data.insights.slice(0, 3).map((insight) => (
              <div 
                key={insight.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selectedInsight === insight.id 
                    ? 'border-primary/30 bg-primary/5' 
                    : insight.type === 'opportunity' ? 'border-green-100 bg-green-50/50 hover:bg-green-50' :
                      insight.type === 'warning' ? 'border-orange-100 bg-orange-50/50 hover:bg-orange-50' :
                      insight.type === 'achievement' ? 'border-blue-100 bg-blue-50/50 hover:bg-blue-50' :
                      'border-purple-100 bg-purple-50/50 hover:bg-purple-50'
                }`}
                onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    insight.type === 'opportunity' ? 'bg-green-100 text-green-600' :
                    insight.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                    insight.type === 'achievement' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {insight.type === 'opportunity' && <Target className="w-4 h-4" />}
                    {insight.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                    {insight.type === 'achievement' && <Trophy className="w-4 h-4" />}
                    {insight.type === 'tip' && <Sparkles className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-foreground text-sm">{insight.title}</h4>
                      <div className="flex items-center gap-2">
                        {insight.impact > 0 && (
                          <Badge className="bg-success/10 text-success border-success/20 text-xs">
                            +{formatCurrency(insight.impact)}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% sure
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {insight.description}
                    </p>
                    
                    {insight.action && (
                      <Button 
                        size="sm" 
                        className="bg-primary/10 text-primary hover:bg-primary/20 border-0 text-xs h-7 px-3"
                      >
                        {insight.action.label}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {data.insights.length > 3 && (
              <Button variant="outline" className="w-full btn-hover">
                View All {data.insights.length} Insights
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Pending Tasks</CardTitle>
                <CardDescription className="text-sm">Complete to stay compliant</CardDescription>
              </div>
            </div>
            <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
              {data.tasks.length} tasks
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {data.tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="p-4 rounded-xl border border-muted/50 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground text-sm">{task.title}</h4>
                      <Badge className={`text-xs border ${getTaskPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground ml-3">
                    {task.estimated}min
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-1.5" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Due: {task.dueDate.toLocaleDateString()}
                    </span>
                    <Button size="sm" className="text-xs h-6 px-2">
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full btn-hover">
              View All Tasks
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Upcoming Deadlines</CardTitle>
                <CardDescription className="text-sm">Don't miss important dates</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {data.deadlines.slice(0, 3).map((deadline) => {
              const daysLeft = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              
              return (
                <div key={deadline.id} className={`p-4 rounded-xl ${getDeadlineUrgencyColor(deadline.urgency)} border`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{deadline.title}</h4>
                    <Badge className={`text-xs ${
                      daysLeft <= 3 ? 'bg-red-100 text-red-700' :
                      daysLeft <= 7 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {deadline.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">
                      {deadline.date.toLocaleDateString()}
                    </span>
                    <Button size="sm" className="text-xs h-6 px-2">
                      Start
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                <CardDescription className="text-sm">Latest updates and alerts</CardDescription>
              </div>
            </div>
            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              {data.notifications.filter(n => !n.read).length} new
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {data.notifications.slice(0, 3).map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-xl border transition-colors ${
                  notification.read ? 'border-muted/30 bg-muted/10' : 'border-blue-100 bg-blue-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    notification.type === 'success' ? 'bg-green-100 text-green-600' :
                    notification.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                    notification.type === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {notification.type === 'success' && <CheckCircle className="w-3 h-3" />}
                    {notification.type === 'warning' && <AlertTriangle className="w-3 h-3" />}
                    {notification.type === 'error' && <X className="w-3 h-3" />}
                    {notification.type === 'info' && <Info className="w-3 h-3" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-foreground text-sm leading-tight">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleTimeString()}
                      </span>
                      {notification.action && (
                        <Button size="sm" className="text-xs h-6 px-2">
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full btn-hover">
              View All Notifications
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
