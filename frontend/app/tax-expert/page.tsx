'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuthStore } from '@/stores/auth-store'
import { 
  Scale,
  Users,
  TrendingUp,
  TrendingDown,
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
  ExternalLink,
  BookOpen,
  Briefcase,
  Building2,
  GraduationCap,
  Heart,
  Home,
  Plane,
  Receipt,
  Lightbulb,
  MessageSquare,
  Video,
  Headphones,
  Megaphone,
  UserCheck,
  UserPlus,
  UserX,
  AlertCircle,
  Info,
  HelpCircle,
  Bookmark,
  Archive,
  Share2,
  Copy,
  Printer,
  FileOutput,
  FileInput,
  Layers,
  List,
  Calendar as CalendarIcon,
  Bell,
  BellRing
} from 'lucide-react'

interface TaxExpertData {
  practice: {
    firmName: string
    caNumber: string
    udinPrefix: string
    establishedYear: number
    totalClients: number
    activeClients: number
    monthlyRevenue: number
    annualRevenue: number
    practiceScore: number
    specializations: string[]
    certifications: string[]
  }
  
  dashboard: {
    todayTasks: number
    completedTasks: number
    pendingReturns: number
    overdueItems: number
    monthlyEarnings: number
    clientSatisfaction: number
    avgResponseTime: number // hours
    completionRate: number
  }
  
  clients: ClientData[]
  workingPapers: WorkingPaper[]
  research: ResearchItem[]
  deadlines: DeadlineItem[]
  
  analytics: {
    clientGrowth: GrowthData[]
    revenueBreakdown: RevenueData[]
    serviceDistribution: ServiceData[]
    efficiency: EfficiencyMetric[]
    satisfaction: SatisfactionData[]
  }
  
  marketplace: {
    rating: number
    reviews: number
    totalLeads: number
    conversionRate: number
    profileViews: number
    inquiries: MarketplaceInquiry[]
  }
  
  insights: PracticeInsight[]
  notifications: NotificationItem[]
  automation: AutomationRule[]
}

interface ClientData {
  id: string
  name: string
  type: 'individual' | 'business' | 'ngo' | 'trust'
  status: 'active' | 'inactive' | 'onboarding' | 'churned'
  onboardingDate: Date
  lastActivity: Date
  totalBilled: number
  outstandingAmount: number
  services: ClientService[]
  documents: ClientDocument[]
  communication: CommunicationLog[]
  satisfaction: number
  nextDeadline?: Date
  riskLevel: 'low' | 'medium' | 'high'
  notes: string
}

interface ClientService {
  id: string
  type: 'itr_filing' | 'gst_return' | 'audit' | 'consultation' | 'roc_filing' | 'tax_planning'
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold'
  startDate: Date
  dueDate: Date
  amount: number
  description: string
  progress: number
}

interface ClientDocument {
  id: string
  name: string
  type: string
  uploadDate: Date
  size: number
  status: 'pending' | 'processing' | 'verified' | 'rejected'
  extractedData?: any
  aiConfidence?: number
}

interface CommunicationLog {
  id: string
  type: 'email' | 'call' | 'meeting' | 'whatsapp' | 'system'
  direction: 'inbound' | 'outbound'
  subject: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read' | 'replied'
  priority: 'low' | 'medium' | 'high'
}

interface WorkingPaper {
  id: string
  clientId: string
  type: 'itr' | 'audit' | 'gst' | 'tax_planning' | 'consultation'
  title: string
  assessmentYear: string
  status: 'draft' | 'in_review' | 'completed' | 'filed'
  createdDate: Date
  lastModified: Date
  sections: WorkingPaperSection[]
  aiGenerated: boolean
  reviewNotes: string[]
  signedBy?: string
  udin?: string
}

interface WorkingPaperSection {
  id: string
  title: string
  content: string
  status: 'pending' | 'completed' | 'review_required'
  aiSuggestions: AISuggestion[]
  attachments: string[]
  lastUpdated: Date
}

interface AISuggestion {
  type: 'calculation' | 'deduction' | 'compliance' | 'optimization'
  description: string
  confidence: number
  impact: 'low' | 'medium' | 'high'
  source: string
}

interface ResearchItem {
  id: string
  query: string
  type: 'case_law' | 'notification' | 'circular' | 'act' | 'ruling'
  results: ResearchResult[]
  relevanceScore: number
  bookmarked: boolean
  sharedWith: string[]
  createdDate: Date
}

interface ResearchResult {
  title: string
  source: string
  date: Date
  relevance: number
  summary: string
  fullText: string
  citations: string[]
  tags: string[]
}

interface DeadlineItem {
  id: string
  clientId?: string
  title: string
  type: 'filing' | 'payment' | 'compliance' | 'follow_up' | 'review'
  dueDate: Date
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  description: string
  estimatedTime: number // hours
  assignedTo?: string
  dependencies: string[]
  reminders: ReminderSettings
}

interface ReminderSettings {
  enabled: boolean
  advance: number[] // days before due date
  methods: ('email' | 'sms' | 'push' | 'whatsapp')[]
}

interface GrowthData {
  month: string
  newClients: number
  churned: number
  netGrowth: number
  revenue: number
}

interface RevenueData {
  service: string
  amount: number
  percentage: number
  growth: number
  clients: number
}

interface ServiceData {
  name: string
  count: number
  revenue: number
  avgFee: number
  satisfaction: number
}

interface EfficiencyMetric {
  metric: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  benchmark: number
}

interface SatisfactionData {
  month: string
  score: number
  responses: number
  feedback: string[]
}

interface MarketplaceInquiry {
  id: string
  clientName: string
  service: string
  budget: number
  urgency: 'low' | 'medium' | 'high'
  location: string
  receivedDate: Date
  status: 'new' | 'responded' | 'converted' | 'lost'
  response?: string
}

interface PracticeInsight {
  id: string
  type: 'efficiency' | 'growth' | 'client_satisfaction' | 'revenue' | 'compliance'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  recommendation: string
  metric?: {
    value: number
    unit: string
    trend: 'up' | 'down'
  }
  action?: string
}

interface NotificationItem {
  id: string
  type: 'deadline' | 'client_message' | 'system' | 'marketplace' | 'compliance'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
}

interface AutomationRule {
  id: string
  name: string
  trigger: string
  actions: string[]
  enabled: boolean
  lastExecuted?: Date
  executionCount: number
}

export default function TaxExpertPage() {
  const { user } = useAuthStore()
  const [data, setData] = useState<TaxExpertData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'research' | 'marketplace' | 'analytics'>('overview')
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  useEffect(() => {
    // Mock data - in production, this would come from API
    const mockData: TaxExpertData = {
      practice: {
        firmName: 'Sharma & Associates',
        caNumber: 'CA-12345',
        udinPrefix: '24012345',
        establishedYear: 2018,
        totalClients: 485,
        activeClients: 456,
        monthlyRevenue: 2850000,
        annualRevenue: 28500000,
        practiceScore: 96,
        specializations: ['Income Tax', 'GST', 'Corporate Law', 'International Taxation', 'Tax Planning'],
        certifications: ['DISA', 'Valuation', 'IFRS', 'Forensic Audit']
      },
      
      dashboard: {
        todayTasks: 24,
        completedTasks: 18,
        pendingReturns: 156,
        overdueItems: 8,
        monthlyEarnings: 2850000,
        clientSatisfaction: 4.8,
        avgResponseTime: 2.5,
        completionRate: 98.5
      },
      
      clients: [
        {
          id: '1',
          name: 'TechCorp Solutions Pvt Ltd',
          type: 'business',
          status: 'active',
          onboardingDate: new Date('2023-04-15'),
          lastActivity: new Date('2024-06-20'),
          totalBilled: 1250000,
          outstandingAmount: 285000,
          satisfaction: 4.9,
          nextDeadline: new Date('2024-07-15'),
          riskLevel: 'low',
          notes: 'High-value client, timely payments, expanding business',
          services: [
            {
              id: 's1',
              type: 'audit',
              status: 'in_progress',
              startDate: new Date('2024-06-01'),
              dueDate: new Date('2024-07-30'),
              amount: 450000,
              description: 'Annual Audit FY 2023-24',
              progress: 65
            },
            {
              id: 's2',
              type: 'gst_return',
              status: 'completed',
              startDate: new Date('2024-06-01'),
              dueDate: new Date('2024-06-20'),
              amount: 25000,
              description: 'GST Return May 2024',
              progress: 100
            }
          ],
          documents: [
            {
              id: 'd1',
              name: 'Balance Sheet FY24.pdf',
              type: 'Financial Statement',
              uploadDate: new Date('2024-06-15'),
              size: 2048000,
              status: 'verified',
              aiConfidence: 95
            }
          ],
          communication: [
            {
              id: 'c1',
              type: 'email',
              direction: 'outbound',
              subject: 'Audit progress update',
              timestamp: new Date('2024-06-20'),
              status: 'read',
              priority: 'medium'
            }
          ]
        },
        {
          id: '2',
          name: 'Rajesh Kumar',
          type: 'individual',
          status: 'active',
          onboardingDate: new Date('2022-03-10'),
          lastActivity: new Date('2024-06-18'),
          totalBilled: 185000,
          outstandingAmount: 0,
          satisfaction: 4.7,
          nextDeadline: new Date('2024-07-31'),
          riskLevel: 'low',
          notes: 'Salaried individual, regular ITR client',
          services: [
            {
              id: 's3',
              type: 'itr_filing',
              status: 'pending',
              startDate: new Date('2024-06-15'),
              dueDate: new Date('2024-07-31'),
              amount: 15000,
              description: 'ITR Filing AY 2024-25',
              progress: 25
            }
          ],
          documents: [],
          communication: []
        }
      ],
      
      workingPapers: [
        {
          id: 'wp1',
          clientId: '1',
          type: 'audit',
          title: 'Audit Working Papers - TechCorp Solutions',
          assessmentYear: '2023-24',
          status: 'in_review',
          createdDate: new Date('2024-06-01'),
          lastModified: new Date('2024-06-20'),
          aiGenerated: true,
          reviewNotes: ['Revenue recognition needs review', 'Fixed asset depreciation verified'],
          sections: [
            {
              id: 'sec1',
              title: 'Revenue Recognition',
              content: 'Detailed analysis of revenue streams...',
              status: 'completed',
              aiSuggestions: [
                {
                  type: 'compliance',
                  description: 'Consider AS-9 compliance for revenue recognition',
                  confidence: 85,
                  impact: 'medium',
                  source: 'Accounting Standards'
                }
              ],
              attachments: ['revenue_analysis.xlsx'],
              lastUpdated: new Date('2024-06-20')
            }
          ]
        }
      ],
      
      research: [
        {
          id: 'r1',
          query: 'TDS on software license fees to non-residents',
          type: 'ruling',
          relevanceScore: 92,
          bookmarked: true,
          sharedWith: ['team@sharmaassociates.com'],
          createdDate: new Date('2024-06-19'),
          results: [
            {
              title: 'Mumbai ITAT Ruling - XYZ Corp vs DCIT',
              source: 'Income Tax Appellate Tribunal',
              date: new Date('2024-05-15'),
              relevance: 95,
              summary: 'TDS @ 10% applicable on software license fees paid to non-residents...',
              fullText: 'Detailed ruling text...',
              citations: ['Section 195', 'Section 9(1)(vi)'],
              tags: ['TDS', 'Software', 'Non-resident', 'ITAT']
            }
          ]
        }
      ],
      
      deadlines: [
        {
          id: 'dl1',
          clientId: '1',
          title: 'Audit Report Submission',
          type: 'filing',
          dueDate: new Date('2024-07-30'),
          priority: 'high',
          status: 'in_progress',
          description: 'Submit audit report for TechCorp Solutions',
          estimatedTime: 8,
          dependencies: ['working_papers_review'],
          reminders: {
            enabled: true,
            advance: [7, 3, 1],
            methods: ['email', 'push']
          }
        },
        {
          id: 'dl2',
          title: 'GST Return Filing - Multiple Clients',
          type: 'filing',
          dueDate: new Date('2024-07-20'),
          priority: 'critical',
          status: 'pending',
          description: 'File GST returns for 45 clients',
          estimatedTime: 24,
          dependencies: [],
          reminders: {
            enabled: true,
            advance: [5, 2, 1],
            methods: ['email', 'sms', 'push']
          }
        }
      ],
      
      analytics: {
        clientGrowth: [
          { month: 'Jan', newClients: 12, churned: 2, netGrowth: 10, revenue: 2400000 },
          { month: 'Feb', newClients: 8, churned: 1, netGrowth: 7, revenue: 2550000 },
          { month: 'Mar', newClients: 15, churned: 3, netGrowth: 12, revenue: 2700000 },
          { month: 'Apr', newClients: 18, churned: 2, netGrowth: 16, revenue: 2650000 },
          { month: 'May', newClients: 22, churned: 4, netGrowth: 18, revenue: 2800000 },
          { month: 'Jun', newClients: 25, churned: 1, netGrowth: 24, revenue: 2850000 }
        ],
        revenueBreakdown: [
          { service: 'Income Tax Returns', amount: 1140000, percentage: 40, growth: 15, clients: 285 },
          { service: 'GST Services', amount: 855000, percentage: 30, growth: 22, clients: 156 },
          { service: 'Audit Services', amount: 570000, percentage: 20, growth: 8, clients: 34 },
          { service: 'Tax Planning', amount: 285000, percentage: 10, growth: 35, clients: 42 }
        ],
        serviceDistribution: [
          { name: 'ITR Filing', count: 285, revenue: 1140000, avgFee: 4000, satisfaction: 4.8 },
          { name: 'GST Returns', count: 156, revenue: 855000, avgFee: 5500, satisfaction: 4.7 },
          { name: 'Audits', count: 34, revenue: 570000, avgFee: 16750, satisfaction: 4.9 },
          { name: 'Consultations', count: 128, revenue: 285000, avgFee: 2225, satisfaction: 4.6 }
        ],
        efficiency: [
          { metric: 'Avg. Turnaround Time', value: 3.2, unit: 'days', trend: 'down', benchmark: 5.0 },
          { metric: 'Client Response Time', value: 2.5, unit: 'hours', trend: 'down', benchmark: 4.0 },
          { metric: 'First-time Right Rate', value: 98.5, unit: '%', trend: 'up', benchmark: 95.0 },
          { metric: 'Utilization Rate', value: 87, unit: '%', trend: 'up', benchmark: 80.0 }
        ],
        satisfaction: [
          { month: 'Jan', score: 4.6, responses: 45, feedback: ['Good service', 'Timely delivery'] },
          { month: 'Feb', score: 4.7, responses: 52, feedback: ['Professional approach', 'Clear communication'] },
          { month: 'Mar', score: 4.8, responses: 58, feedback: ['Excellent knowledge', 'Quick responses'] },
          { month: 'Apr', score: 4.7, responses: 61, feedback: ['Reliable service', 'Cost effective'] },
          { month: 'May', score: 4.8, responses: 67, feedback: ['Expert guidance', 'Proactive advice'] },
          { month: 'Jun', score: 4.8, responses: 72, feedback: ['Outstanding service', 'Highly recommended'] }
        ]
      },
      
      marketplace: {
        rating: 4.8,
        reviews: 124,
        totalLeads: 186,
        conversionRate: 68,
        profileViews: 2450,
        inquiries: [
          {
            id: 'mq1',
            clientName: 'Startup ABC',
            service: 'Company Registration + Compliance',
            budget: 150000,
            urgency: 'high',
            location: 'Mumbai',
            receivedDate: new Date('2024-06-20'),
            status: 'new'
          },
          {
            id: 'mq2',
            clientName: 'Export House XYZ',
            service: 'GST + Export Documentation',
            budget: 75000,
            urgency: 'medium',
            location: 'Delhi',
            receivedDate: new Date('2024-06-19'),
            status: 'responded',
            response: 'Detailed proposal sent with timeline and fee structure'
          }
        ]
      },
      
      insights: [
        {
          id: 'i1',
          type: 'efficiency',
          title: 'Response Time Improving',
          description: 'Your average client response time has improved by 30% this month, enhancing client satisfaction.',
          impact: 'high',
          recommendation: 'Continue using AI-powered email templates and automated follow-ups.',
          metric: { value: 2.5, unit: 'hours', trend: 'down' },
          action: 'View Templates'
        },
        {
          id: 'i2',
          type: 'growth',
          title: 'Strong Client Acquisition',
          description: 'Added 25 new clients this month, highest growth in practice history.',
          impact: 'high',
          recommendation: 'Consider expanding team to handle increased workload efficiently.',
          metric: { value: 25, unit: 'clients', trend: 'up' },
          action: 'Hiring Plan'
        },
        {
          id: 'i3',
          type: 'revenue',
          title: 'Tax Planning Services Growing',
          description: 'Tax planning consultations show 35% growth with highest margins.',
          impact: 'medium',
          recommendation: 'Focus marketing efforts on high-net-worth individuals and businesses.',
          metric: { value: 35, unit: '%', trend: 'up' },
          action: 'Marketing Strategy'
        }
      ],
      
      notifications: [
        {
          id: 'n1',
          type: 'deadline',
          title: 'GST Filing Due Tomorrow',
          message: '45 clients have GST returns due tomorrow. 8 are still pending.',
          timestamp: new Date('2024-06-19'),
          read: false,
          priority: 'high',
          actionUrl: '/deadlines'
        },
        {
          id: 'n2',
          type: 'marketplace',
          title: 'New Lead: Startup ABC',
          message: 'High-value lead for company registration services. Budget: ₹1.5L',
          timestamp: new Date('2024-06-20'),
          read: false,
          priority: 'medium',
          actionUrl: '/marketplace'
        }
      ],
      
      automation: [
        {
          id: 'auto1',
          name: 'New Client Onboarding',
          trigger: 'Client signs engagement letter',
          actions: ['Send welcome email', 'Create project folder', 'Schedule kick-off call'],
          enabled: true,
          lastExecuted: new Date('2024-06-20'),
          executionCount: 156
        },
        {
          id: 'auto2',
          name: 'Deadline Reminders',
          trigger: '7 days before deadline',
          actions: ['Send client reminder', 'Update task status', 'Notify team'],
          enabled: true,
          lastExecuted: new Date('2024-06-19'),
          executionCount: 2840
        }
      ]
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
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                      {data.practice.firmName}
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    CA Practice Command Center - Excellence in Professional Services
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white border-0 shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                {data.marketplace.rating}/5 Rating
              </Badge>
              <Badge className="bg-gradient-to-r from-success to-secondary text-white border-0 shadow-lg">
                <TrendingUp className="w-3 h-3 mr-1" />
                {data.practice.activeClients} Active Clients
              </Badge>
              <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 shadow-lg">
                <Award className="w-3 h-3 mr-1" />
                Practice Score: {data.practice.practiceScore}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600/10 to-purple-800/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-purple-600 mb-1 animate-count-up">
                {formatCurrency(data.dashboard.monthlyEarnings)}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                <span className="text-sm text-purple-600 font-medium">
                  {formatCurrency(data.practice.annualRevenue)} annually
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-success/20 to-secondary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Client Satisfaction</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-success/10 to-secondary/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-success" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-success mb-1 animate-count-up">
                {data.dashboard.clientSatisfaction}/5
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-success font-medium">
                  From {data.marketplace.reviews} reviews
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-accent mb-1 animate-count-up">
                {data.dashboard.completionRate}%
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm text-accent font-medium">
                  {data.dashboard.completedTasks}/{data.dashboard.todayTasks} today
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl opacity-60"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">Response Time</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-primary mb-1 animate-count-up">
                {data.dashboard.avgResponseTime}h
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-medium">
                  30% faster than benchmark
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
              { id: 'clients', label: 'Client Portfolio', icon: Users },
              { id: 'research', label: 'AI Research', icon: BookOpen },
              { id: 'marketplace', label: 'Marketplace', icon: Globe },
              { id: 'analytics', label: 'Practice Analytics', icon: BarChart3 }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id as any)}
                className={`btn-hover ${activeTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md' : 'hover:bg-purple-50'}`}
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
          {activeTab === 'clients' && <ClientsTab data={data} />}
          {activeTab === 'research' && <ResearchTab data={data} />}
          {activeTab === 'marketplace' && <MarketplaceTab data={data} />}
          {activeTab === 'analytics' && <AnalyticsTab data={data} />}
        </div>
      </div>
    </div>
  )
}

// Overview Tab Component
function OverviewTab({ data }: { data: TaxExpertData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* AI Insights */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600/10 to-purple-800/10 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Practice Intelligence</CardTitle>
                <CardDescription>AI-powered insights for practice optimization</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.insights.map((insight) => (
                <div key={insight.id} className={`
                  p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                  ${insight.impact === 'high' ? 'border-purple-600/20 bg-purple-50/50' :
                    insight.impact === 'medium' ? 'border-accent/20 bg-accent/5' :
                    'border-success/20 bg-success/5'}
                `}>
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${insight.impact === 'high' ? 'bg-purple-600/10' :
                        insight.impact === 'medium' ? 'bg-accent/10' :
                        'bg-success/10'}
                    `}>
                      {insight.type === 'efficiency' && <Zap className="w-4 h-4 text-purple-600" />}
                      {insight.type === 'growth' && <TrendingUp className="w-4 h-4 text-success" />}
                      {insight.type === 'revenue' && <DollarSign className="w-4 h-4 text-accent" />}
                      {insight.type === 'client_satisfaction' && <Heart className="w-4 h-4 text-success" />}
                      {insight.type === 'compliance' && <Shield className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{insight.title}</h4>
                      <p className="text-muted-foreground text-sm mb-2">{insight.description}</p>
                      {insight.metric && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-purple-600">
                            {insight.metric.value}{insight.metric.unit}
                          </span>
                          {insight.metric.trend === 'up' ? (
                            <TrendingUp className="w-3 h-3 text-success" />
                          ) : insight.metric.trend === 'down' ? (
                            <TrendingDown className="w-3 h-3 text-destructive" />
                          ) : null}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground italic mb-2">{insight.recommendation}</p>
                      {insight.action && (
                        <Button size="sm" className="btn-hover bg-gradient-to-r from-purple-600 to-purple-800 text-white">
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

        {/* Today's Agenda */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Today's Priority Tasks</CardTitle>
                <CardDescription>Critical deadlines and high-priority activities</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.deadlines.slice(0, 5).map((deadline) => (
                <div key={deadline.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-accent/5 transition-colors">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${deadline.priority === 'critical' ? 'bg-destructive/10' :
                      deadline.priority === 'high' ? 'bg-accent/10' :
                      deadline.priority === 'medium' ? 'bg-primary/10' :
                      'bg-success/10'}
                  `}>
                    {deadline.type === 'filing' && <FileText className="w-4 h-4 text-accent" />}
                    {deadline.type === 'payment' && <CreditCard className="w-4 h-4 text-primary" />}
                    {deadline.type === 'compliance' && <Shield className="w-4 h-4 text-purple-600" />}
                    {deadline.type === 'follow_up' && <Phone className="w-4 h-4 text-success" />}
                    {deadline.type === 'review' && <Eye className="w-4 h-4 text-secondary" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{deadline.title}</h4>
                    <p className="text-sm text-muted-foreground">{deadline.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Due: {deadline.dueDate.toLocaleDateString()}</span>
                      <span>Est: {deadline.estimatedTime}h</span>
                      <Badge variant={
                        deadline.priority === 'critical' ? 'destructive' :
                        deadline.priority === 'high' ? 'secondary' :
                        'outline'
                      } className="text-xs">
                        {deadline.priority}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="btn-hover">
                    Start
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Client Activity */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Recent Client Activity</CardTitle>
                <CardDescription>Latest interactions and updates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.clients.slice(0, 5).map((client) => (
                <div key={client.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${client.type === 'business' ? 'bg-primary/10 text-primary' :
                      client.type === 'individual' ? 'bg-success/10 text-success' :
                      'bg-accent/10 text-accent'}
                  `}>
                    {client.type === 'business' ? <Building2 className="w-4 h-4" /> :
                     client.type === 'individual' ? <Users className="w-4 h-4" /> :
                     <Users className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">{client.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Last activity: {client.lastActivity.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">
                      {client.outstandingAmount > 0 ? `₹${(client.outstandingAmount / 1000).toFixed(0)}K` : 'Paid'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {client.services.length} services
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(client.satisfaction) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                      />
                    ))}
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
        <Card className="card-hover bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 border-0 shadow-xl text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Add New Client</h3>
              <p className="text-white/80 mb-6 text-sm">
                Onboard new clients with AI-powered document processing
              </p>
              <Button className="btn-hover w-full bg-white text-purple-600 hover:bg-white/90 font-semibold">
                <UserPlus className="w-4 h-4 mr-2" />
                Start Onboarding
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Notifications</CardTitle>
                <CardDescription>{data.notifications.filter(n => !n.read).length} unread</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className={`
                  flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer
                  ${notification.read ? 'hover:bg-muted/5' : 'bg-accent/5 hover:bg-accent/10'}
                `}>
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center mt-0.5
                    ${notification.priority === 'high' ? 'bg-destructive/10' :
                      notification.priority === 'medium' ? 'bg-accent/10' :
                      'bg-primary/10'}
                  `}>
                    {notification.type === 'deadline' && <Clock className="w-3 h-3 text-destructive" />}
                    {notification.type === 'marketplace' && <Globe className="w-3 h-3 text-accent" />}
                    {notification.type === 'client_message' && <MessageSquare className="w-3 h-3 text-primary" />}
                    {notification.type === 'system' && <Settings className="w-3 h-3 text-muted-foreground" />}
                    {notification.type === 'compliance' && <Shield className="w-3 h-3 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {notification.message}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {notification.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Practice Performance */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-success/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-success" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Practice Score</CardTitle>
                <CardDescription>Overall performance metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-success mb-2">{data.practice.practiceScore}%</div>
                <Progress value={data.practice.practiceScore} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-purple-50">
                  <div className="text-lg font-bold text-purple-600">{data.marketplace.rating}</div>
                  <div className="text-xs text-muted-foreground">Client Rating</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-success/10">
                  <div className="text-lg font-bold text-success">{data.marketplace.conversionRate}%</div>
                  <div className="text-xs text-muted-foreground">Lead Conversion</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Specializations:</h4>
                <div className="flex flex-wrap gap-1">
                  {data.practice.specializations.slice(0, 3).map((spec, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-purple-50 border-purple-200">
                      {spec}
                    </Badge>
                  ))}
                  {data.practice.specializations.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-muted/30">
                      +{data.practice.specializations.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Quick Stats</CardTitle>
                <CardDescription>Key practice metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Returns</span>
                <span className="font-bold text-destructive">{data.dashboard.pendingReturns}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Clients</span>
                <span className="font-bold text-success">{data.practice.activeClients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overdue Items</span>
                <span className="font-bold text-accent">{data.dashboard.overdueItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Profile Views</span>
                <span className="font-bold text-primary">{data.marketplace.profileViews}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Placeholder tabs (simplified for brevity)
function ClientsTab({ data }: { data: TaxExpertData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600/10 to-purple-800/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Client Portfolio Management</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Comprehensive client management with AI-powered insights, automated workflows, and real-time collaboration
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">{data.practice.activeClients}</div>
              <div className="text-sm text-muted-foreground">Active Clients</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-2xl font-bold text-success">{data.dashboard.clientSatisfaction}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/10">
              <div className="text-2xl font-bold text-accent">{data.dashboard.avgResponseTime}h</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
          </div>
          <Button className="btn-hover bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-4">
            <Users className="w-5 h-5 mr-2" />
            Manage Clients
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function ResearchTab({ data }: { data: TaxExpertData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">AI Legal Research Assistant</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Intelligent legal research with natural language queries, automated case law analysis, and real-time updates
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-accent/10">
              <div className="text-3xl font-bold text-accent">50K+</div>
              <div className="text-sm text-muted-foreground">Legal Documents</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>
          <Button className="btn-hover bg-gradient-to-r from-accent to-primary text-white px-8 py-4">
            <Sparkles className="w-5 h-5 mr-2" />
            Start Research Query
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function MarketplaceTab({ data }: { data: TaxExpertData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Globe className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">FinTwin CA Marketplace</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Connect with quality clients, showcase your expertise, and grow your practice with AI-powered matching
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">{data.marketplace.rating}/5</div>
              <div className="text-sm text-muted-foreground">Your Rating</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-2xl font-bold text-success">{data.marketplace.totalLeads}</div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/10">
              <div className="text-2xl font-bold text-accent">{data.marketplace.conversionRate}%</div>
              <div className="text-sm text-muted-foreground">Conversion</div>
            </div>
          </div>
          <Button className="btn-hover bg-gradient-to-r from-primary to-secondary text-white px-8 py-4">
            <Globe className="w-5 h-5 mr-2" />
            Manage Marketplace Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsTab({ data }: { data: TaxExpertData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Practice Analytics & Intelligence</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Comprehensive practice analytics with revenue forecasting, client insights, and performance benchmarking
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-secondary/10">
              <div className="text-3xl font-bold text-secondary">₹{(data.practice.annualRevenue / 10000000).toFixed(1)}Cr</div>
              <div className="text-sm text-muted-foreground">Annual Revenue</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/10">
              <div className="text-3xl font-bold text-accent">{data.analytics.efficiency[2].value}%</div>
              <div className="text-sm text-muted-foreground">Efficiency Score</div>
            </div>
          </div>
          <Button className="btn-hover bg-gradient-to-r from-secondary to-accent text-white px-8 py-4">
            <BarChart3 className="w-5 h-5 mr-2" />
            View Detailed Analytics
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
