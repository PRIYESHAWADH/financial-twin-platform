'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuthStore } from '@/stores/auth-store'
import { 
  Search, 
  MapPin, 
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock, 
  CheckCircle,
  Plus,
  Filter,
  ArrowRight,
  ArrowLeft,
  Zap,
  Brain,
  Sparkles,
  Target,
  Shield,
  Award,
  Trophy,
  Gift,
  Activity,
  Globe,
  Phone,
  Mail,
  MessageSquare,
  Video,
  Calendar,
  FileText,
  Briefcase,
  Building2,
  GraduationCap,
  Heart,
  Home,
  Plane,
  Receipt,
  Calculator,
  Scale,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Grid3x3,
  Eye,
  Share2,
  Bookmark,
  Send,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  Info,
  HelpCircle,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  UserCheck,
  UserPlus,
  UserX,
  Verified
} from 'lucide-react'

interface MarketplaceData {
  userProfile: {
    type: 'client' | 'ca'
    name: string
    location: string
    requirements?: ClientRequirements
    practice?: CAPractice
  }
  
  recommendations: AIRecommendation[]
  featuredCAs: CAProfile[]
  clientRequests: ClientRequest[]
  
  categories: ServiceCategory[]
  filters: FilterOptions
  
  analytics: {
    totalCAs: number
    totalClients: number
    successfulMatches: number
    avgResponseTime: number
    satisfactionScore: number
    totalTransactions: number
    avgProjectValue: number
  }
  
  insights: MarketplaceInsight[]
  testimonials: Testimonial[]
  trends: MarketTrend[]
}

interface ClientRequirements {
  services: string[]
  budget: {
    min: number
    max: number
  }
  timeline: string
  complexity: 'simple' | 'moderate' | 'complex'
  preferences: {
    experience: number // years
    rating: number
    location: 'local' | 'remote' | 'hybrid'
    language: string[]
    specializations: string[]
  }
}

interface CAPractice {
  firmName: string
  caNumber: string
  experience: number
  rating: number
  completedProjects: number
  specializations: string[]
  certifications: string[]
  hourlyRate: number
  availability: 'immediate' | 'within_week' | 'within_month'
  responseTime: number // hours
}

interface AIRecommendation {
  id: string
  type: 'ca_match' | 'service_suggestion' | 'pricing_insight' | 'timing_advice'
  title: string
  description: string
  confidence: number
  reasoning: string[]
  action?: {
    label: string
    url: string
  }
  metadata?: any
}

interface CAProfile {
  id: string
  name: string
  firmName: string
  photo: string
  caNumber: string
  experience: number
  rating: number
  reviewCount: number
  location: string
  specializations: string[]
  certifications: string[]
  
  pricing: {
  hourlyRate: number
    fixedPackages: ServicePackage[]
  }
  
  availability: {
    status: 'available' | 'busy' | 'booked'
    nextSlot: Date
    responseTime: number
  }
  
  metrics: {
    completedProjects: number
    clientRetention: number
    onTimeDelivery: number
    satisfactionScore: number
  }
  
  portfolio: PortfolioItem[]
  testimonials: Review[]
  
  aiScore: {
    overall: number
    expertise: number
    communication: number
    reliability: number
    value: number
  }
}

interface ServicePackage {
  id: string
  name: string
  description: string
  price: number
  duration: string
  inclusions: string[]
  popular?: boolean
}

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  clientSize: 'individual' | 'small_business' | 'enterprise'
  duration: string
  results: string[]
  technologies?: string[]
}

interface Review {
  id: string
  clientName: string
  rating: number
  comment: string
  date: Date
  service: string
  verified: boolean
}

interface ClientRequest {
  id: string
  title: string
  description: string
  category: string
  budget: number
  timeline: string
  location: string
  urgency: 'low' | 'medium' | 'high'
  requirements: string[]
  postedDate: Date
  applicants: number
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  client: {
    name: string
    rating: number
    previousProjects: number
  }
}

interface ServiceCategory {
  id: string
  name: string
  icon: string
  description: string
  subcategories: string[]
  avgPrice: number
  demandLevel: 'low' | 'medium' | 'high'
  cas: number
}

interface FilterOptions {
  location: string[]
  specializations: string[]
  experience: number[]
  rating: number[]
  pricing: number[]
  availability: string[]
  certifications: string[]
}

interface MarketplaceInsight {
  id: string
  type: 'demand' | 'pricing' | 'competition' | 'opportunity'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  trend: 'up' | 'down' | 'stable'
  data: any
}

interface Testimonial {
  id: string
  clientName: string
  caName: string
  service: string
  rating: number
  comment: string
  savings?: number
  duration: string
  verified: boolean
}

interface MarketTrend {
  category: string
  growth: number
  demand: number
  avgPrice: number
  description: string
}

export default function CAMarketplacePage() {
  const { user } = useAuthStore()
  const [data, setData] = useState<MarketplaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'analytics' | 'profile'>('discover')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedFilters, setSelectedFilters] = useState<any>({})

  useEffect(() => {
    // Mock data - in production, this would come from API
    const mockData: MarketplaceData = {
      userProfile: {
        type: 'client',
        name: user?.firstName + ' ' + user?.lastName || 'User',
        location: 'Mumbai, Maharashtra',
        requirements: {
          services: ['ITR Filing', 'Tax Planning'],
          budget: { min: 10000, max: 50000 },
          timeline: 'Within 2 weeks',
          complexity: 'moderate',
          preferences: {
            experience: 5,
            rating: 4.5,
            location: 'hybrid',
            language: ['English', 'Hindi'],
            specializations: ['Income Tax', 'Investment Planning']
          }
        }
      },
      
      recommendations: [
        {
          id: 'r1',
          type: 'ca_match',
          title: 'Perfect Match: CA Rajesh Sharma',
          description: 'Based on your requirements, CA Rajesh Sharma is an ideal match with 98% compatibility.',
          confidence: 98,
          reasoning: [
            'Specializes in Income Tax and Investment Planning',
            '8 years experience (above your 5-year requirement)',
            'Located in Mumbai with hybrid consultation options',
            'Average project cost ₹25,000 (within your budget)',
            '4.9 rating with 150+ reviews'
          ],
          action: {
            label: 'View Profile',
            url: '/ca/rajesh-sharma'
          }
        },
        {
          id: 'r2',
          type: 'pricing_insight',
          title: 'Optimal Pricing Strategy',
          description: 'Based on market analysis, your budget is well-positioned for quality services.',
          confidence: 87,
          reasoning: [
            'Your budget range covers 78% of available CAs',
            'Premium CAs (4.5+ rating) average ₹35,000 for similar projects',
            'Current market has high CA availability',
            'Best value CAs typically charge ₹20,000-₹30,000'
          ]
        },
        {
          id: 'r3',
          type: 'timing_advice',
          title: 'Optimal Project Timing',
          description: 'Starting your project now offers the best CA availability and competitive pricing.',
          confidence: 92,
          reasoning: [
            'Pre-tax season availability is highest',
            '15% more CAs available compared to peak season',
            'Response times 40% faster than average',
            'Negotiation flexibility is currently high'
          ]
        }
      ],
      
      featuredCAs: [
        {
          id: 'ca1',
          name: 'Rajesh Sharma',
          firmName: 'Sharma & Associates',
          photo: '/avatars/ca-rajesh.jpg',
          caNumber: 'CA-12345',
          experience: 8,
            rating: 4.9,
            reviewCount: 156,
          location: 'Mumbai, Maharashtra',
          specializations: ['Income Tax', 'GST', 'Investment Planning', 'Corporate Tax'],
          certifications: ['DISA', 'Valuation', 'IFRS'],
          
          pricing: {
            hourlyRate: 2500,
            fixedPackages: [
              {
                id: 'pkg1',
                name: 'Individual ITR Filing',
                description: 'Complete ITR filing with tax optimization',
                price: 15000,
                duration: '7-10 days',
                inclusions: ['Form 16 analysis', 'Deduction optimization', 'E-filing', 'Acknowledgment'],
                popular: true
              },
              {
                id: 'pkg2',
                name: 'Tax Planning Consultation',
                description: 'Comprehensive tax planning and investment advice',
                price: 25000,
                duration: '2 weeks',
                inclusions: ['Portfolio analysis', 'Tax-saving recommendations', 'Investment strategy', 'Follow-up session']
              }
            ]
          },
          
          availability: {
            status: 'available',
            nextSlot: new Date('2024-06-25'),
            responseTime: 2
          },
          
          metrics: {
            completedProjects: 450,
            clientRetention: 89,
            onTimeDelivery: 96,
            satisfactionScore: 4.9
          },
          
          portfolio: [
            {
              id: 'p1',
              title: 'Tax Optimization for Tech Startup',
              description: 'Comprehensive tax planning resulting in 35% tax savings',
              category: 'Tax Planning',
              clientSize: 'small_business',
              duration: '3 weeks',
              results: ['₹8L tax savings', '100% compliance', 'Optimized structure']
            }
          ],
          
          testimonials: [
            {
              id: 't1',
              clientName: 'Priya Patel',
              rating: 5,
              comment: 'Excellent service! Saved me ₹45,000 in taxes and explained everything clearly.',
              date: new Date('2024-05-15'),
              service: 'ITR Filing',
              verified: true
            }
          ],
          
          aiScore: {
            overall: 94,
            expertise: 96,
            communication: 92,
            reliability: 95,
            value: 91
          }
        },
        {
          id: 'ca2',
          name: 'Priya Agarwal',
          firmName: 'Agarwal Tax Consultants',
          photo: '/avatars/ca-priya.jpg',
          caNumber: 'CA-67890',
            experience: 6,
          rating: 4.8,
          reviewCount: 89,
          location: 'Delhi, NCR',
          specializations: ['GST', 'Business Tax', 'Startup Compliance', 'Digital Services'],
          certifications: ['GST Practitioner', 'DISA'],
          
          pricing: {
            hourlyRate: 2200,
            fixedPackages: [
              {
                id: 'pkg3',
                name: 'GST Registration & Setup',
                description: 'Complete GST registration and initial compliance setup',
                price: 12000,
                duration: '5-7 days',
                inclusions: ['GST registration', 'Return setup', 'Initial filing', 'Training session']
              }
            ]
          },
          
          availability: {
            status: 'available',
            nextSlot: new Date('2024-06-23'),
            responseTime: 1.5
          },
          
          metrics: {
            completedProjects: 280,
            clientRetention: 85,
            onTimeDelivery: 94,
            satisfactionScore: 4.8
          },
          
          portfolio: [],
          testimonials: [],
          
          aiScore: {
            overall: 89,
            expertise: 91,
            communication: 94,
            reliability: 88,
            value: 86
          }
        }
      ],
      
      clientRequests: [
        {
          id: 'cr1',
          title: 'Audit Services for Manufacturing Company',
          description: 'Need statutory audit for mid-size manufacturing company with ₹50Cr turnover.',
          category: 'Audit',
          budget: 250000,
          timeline: '2 months',
          location: 'Chennai, Tamil Nadu',
          urgency: 'high',
          requirements: ['Manufacturing experience', 'Statutory audit expertise', 'On-site availability'],
          postedDate: new Date('2024-06-20'),
          applicants: 12,
          status: 'open',
          client: {
            name: 'TechManufacturing Ltd',
            rating: 4.6,
            previousProjects: 8
          }
        },
        {
          id: 'cr2', 
          title: 'GST Compliance for E-commerce Startup',
          description: 'Looking for ongoing GST compliance support for rapidly growing e-commerce business.',
          category: 'GST',
          budget: 80000,
          timeline: 'Ongoing',
          location: 'Bangalore, Karnataka',
          urgency: 'medium',
          requirements: ['E-commerce GST expertise', 'Monthly compliance', 'Digital-first approach'],
          postedDate: new Date('2024-06-19'),
          applicants: 8,
          status: 'open',
          client: {
            name: 'EcomNext Pvt Ltd',
            rating: 4.4,
            previousProjects: 3
          }
        }
      ],
      
      categories: [
        {
          id: 'itr',
          name: 'Income Tax Returns',
          icon: 'Receipt',
          description: 'Individual and business ITR filing services',
          subcategories: ['Salaried ITR', 'Business ITR', 'Professional ITR', 'Capital Gains'],
          avgPrice: 8500,
          demandLevel: 'high',
          cas: 1250
        },
        {
          id: 'gst',
          name: 'GST Services',
          icon: 'Calculator',
          description: 'GST registration, filing, and compliance',
          subcategories: ['GST Registration', 'Monthly Returns', 'Annual Returns', 'GST Audit'],
          avgPrice: 15000,
          demandLevel: 'high',
          cas: 980
        },
        {
          id: 'audit',
          name: 'Audit Services',
          icon: 'Scale',
          description: 'Statutory, internal, and specialized audits',
          subcategories: ['Statutory Audit', 'Tax Audit', 'Internal Audit', 'Due Diligence'],
          avgPrice: 125000,
          demandLevel: 'medium',
          cas: 450
        },
        {
          id: 'planning',
          name: 'Tax Planning',
          icon: 'Target',
          description: 'Strategic tax planning and optimization',
          subcategories: ['Investment Planning', 'Tax Optimization', 'Retirement Planning', 'Estate Planning'],
          avgPrice: 35000,
          demandLevel: 'medium',
          cas: 320
        }
      ],
      
      filters: {
        location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'],
        specializations: ['Income Tax', 'GST', 'Audit', 'Corporate Law', 'International Tax', 'Valuation'],
        experience: [1, 3, 5, 10, 15, 20],
        rating: [3.0, 3.5, 4.0, 4.5, 5.0],
        pricing: [5000, 10000, 25000, 50000, 100000],
        availability: ['Immediate', 'Within Week', 'Within Month'],
        certifications: ['DISA', 'Valuation', 'IFRS', 'CISA', 'CFA']
      },
      
      analytics: {
        totalCAs: 15420,
        totalClients: 125680,
        successfulMatches: 89450,
        avgResponseTime: 2.3,
        satisfactionScore: 4.7,
        totalTransactions: 245600,
        avgProjectValue: 28500
      },
      
      insights: [
        {
          id: 'ins1',
          type: 'demand',
          title: 'High Demand for GST Services',
          description: 'GST services seeing 45% increase in demand with filing season approaching.',
          impact: 'high',
          trend: 'up',
          data: { growth: 45, category: 'GST' }
        },
        {
          id: 'ins2',
          type: 'pricing',
          title: 'Competitive Pricing Window',
          description: 'Current pricing 12% below peak season averages, favorable for clients.',
          impact: 'medium',
          trend: 'down',
          data: { discount: 12, category: 'ITR' }
        }
      ],
      
      testimonials: [
        {
          id: 'test1',
          clientName: 'Amit Kumar',
          caName: 'Rajesh Sharma',
          service: 'Tax Planning',
          rating: 5,
          comment: 'Outstanding service! Saved ₹2.5L in taxes through smart planning.',
          savings: 250000,
          duration: '3 weeks',
          verified: true
        },
        {
          id: 'test2',
          clientName: 'TechCorp Solutions',
          caName: 'Priya Agarwal',
          service: 'GST Compliance',
          rating: 4.8,
          comment: 'Efficient and knowledgeable. Made GST compliance hassle-free.',
          duration: '6 months ongoing',
          verified: true
        }
      ],
      
      trends: [
        {
          category: 'Income Tax',
          growth: 23,
          demand: 85,
          avgPrice: 12500,
          description: 'Strong growth driven by increased compliance awareness'
        },
        {
          category: 'GST Services',
          growth: 31,
          demand: 92,
          avgPrice: 18000,
          description: 'Highest demand category with continuous regulatory updates'
        },
        {
          category: 'Audit Services',
          growth: 15,
          demand: 68,
          avgPrice: 145000,
          description: 'Steady demand from growing enterprise sector'
        }
      ]
    }
    
    setData(mockData)
    setLoading(false)
  }, [user])

  const formatCurrency = (amount: number) => {
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
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
                      FinTwin CA Marketplace
                    </span>
        </h1>
                  <p className="text-lg text-muted-foreground">
                    AI-Powered CA Matching Platform - Find Your Perfect Tax Expert
        </p>
                </div>
              </div>
      </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-0 shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                {data.analytics.satisfactionScore}/5 Platform Rating
              </Badge>
              <Badge className="bg-gradient-to-r from-success to-secondary text-white border-0 shadow-lg">
                <Users className="w-3 h-3 mr-1" />
                {data.analytics.totalCAs.toLocaleString()} Expert CAs
              </Badge>
              <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 shadow-lg">
                <CheckCircle className="w-3 h-3 mr-1" />
                {data.analytics.successfulMatches.toLocaleString()} Successful Matches
              </Badge>
            </div>
          </div>
        </div>

        {/* AI-Powered Search */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600/10 to-purple-700/10 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">AI-Powered CA Discovery</h3>
                <p className="text-muted-foreground">Find the perfect CA match using intelligent search and recommendations</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
          <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Describe your tax needs (e.g., 'ITR filing for startup with GST registration')"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-muted bg-white/60 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
          </div>
          
              <div>
                <select className="w-full py-3 px-4 rounded-xl border border-muted bg-white/60 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all">
            <option value="">All Locations</option>
                  {data.filters.location.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
              </div>
              
              <div className="flex gap-2">
                <Button className="btn-hover flex-1 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Search
                </Button>
                <Button variant="outline" className="btn-hover border-indigo-600/20 hover:bg-indigo-50">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
            {[
              { id: 'discover', label: 'Discover CAs', icon: Search },
              { id: 'requests', label: 'Client Requests', icon: FileText },
              { id: 'analytics', label: 'Market Insights', icon: TrendingUp },
              { id: 'profile', label: 'My Profile', icon: Users }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id as any)}
                className={`btn-hover ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-md' : 'hover:bg-indigo-50'}`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {activeTab === 'discover' && <DiscoverTab data={data} />}
          {activeTab === 'requests' && <RequestsTab data={data} />}
          {activeTab === 'analytics' && <AnalyticsTab data={data} />}
          {activeTab === 'profile' && <ProfileTab data={data} />}
          </div>
        </div>
      </div>
  )
}

// Discover Tab Component
function DiscoverTab({ data }: { data: MarketplaceData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* AI Recommendations */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600/10 to-purple-700/10 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                <CardTitle className="text-xl font-bold text-foreground">AI Recommendations for You</CardTitle>
                <CardDescription>Personalized matches based on your requirements</CardDescription>
                    </div>
                  </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600/10 to-purple-700/10 rounded-lg flex items-center justify-center">
                      {rec.type === 'ca_match' && <UserCheck className="w-4 h-4 text-indigo-600" />}
                      {rec.type === 'pricing_insight' && <DollarSign className="w-4 h-4 text-success" />}
                      {rec.type === 'timing_advice' && <Clock className="w-4 h-4 text-accent" />}
                      {rec.type === 'service_suggestion' && <Lightbulb className="w-4 h-4 text-yellow-500" />}
                </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{rec.title}</h4>
                        <Badge className="bg-indigo-600 text-white border-0 text-xs">
                          {rec.confidence}% match
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{rec.description}</p>
                      <div className="mb-3">
                        <div className="text-xs font-medium text-foreground mb-1">Why this recommendation:</div>
                        <ul className="space-y-1">
                          {rec.reasoning.slice(0, 3).map((reason, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {rec.action && (
                        <Button size="sm" className="btn-hover bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                          {rec.action.label}
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

        {/* Featured CAs */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
                <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-success/10 to-secondary/10 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-success" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">Top Matched CAs</CardTitle>
                  <CardDescription>Best CAs based on your requirements</CardDescription>
                </div>
              </div>
              <Button variant="outline" className="btn-hover border-indigo-600/20 hover:bg-indigo-50">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.featuredCAs.map((ca) => (
                <Card key={ca.id} className="card-hover border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/60">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-600/10 to-purple-700/10 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-indigo-600">
                          {ca.name.split(' ').map(n => n[0]).join('')}
                  </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-foreground">{ca.name}</h3>
                          <Verified className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{ca.firmName}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{ca.rating}</span>
                            <span className="text-xs text-muted-foreground">({ca.reviewCount})</span>
                          </div>
                          <Badge variant="outline" className="text-xs bg-success/10 border-success/20">
                            {ca.experience}y exp
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{ca.location}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>Responds in {ca.availability.responseTime}h</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-indigo-600">
                          AI Score: {ca.aiScore.overall}
                        </div>
                        <div className="text-xs text-success">Perfect Match</div>
                      </div>
                </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-foreground mb-2">Specializations:</div>
                  <div className="flex flex-wrap gap-1">
                        {ca.specializations.slice(0, 3).map((spec, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-indigo-50 border-indigo-200">
                        {spec}
                          </Badge>
                        ))}
                        {ca.specializations.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-muted/30">
                            +{ca.specializations.length - 3}
                          </Badge>
                    )}
                  </div>
                </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium text-foreground mb-2">Popular Package:</div>
                      <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {ca.pricing.fixedPackages[0]?.name}
                          </span>
                          <span className="text-lg font-bold text-indigo-600">
                            ₹{ca.pricing.fixedPackages[0]?.price.toLocaleString()}
                          </span>
                    </div>
                        <div className="text-xs text-muted-foreground">
                          {ca.pricing.fixedPackages[0]?.duration}
                  </div>
                    </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                      <div className="p-2 rounded-lg bg-success/10">
                        <div className="text-sm font-bold text-success">{ca.metrics.completedProjects}</div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                      <div className="p-2 rounded-lg bg-primary/10">
                        <div className="text-sm font-bold text-primary">{ca.metrics.clientRetention}%</div>
                        <div className="text-xs text-muted-foreground">Retention</div>
                      </div>
                      <div className="p-2 rounded-lg bg-accent/10">
                        <div className="text-sm font-bold text-accent">{ca.metrics.onTimeDelivery}%</div>
                        <div className="text-xs text-muted-foreground">On-time</div>
                      </div>
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <div className="text-sm font-bold text-secondary">{ca.metrics.satisfactionScore}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>

                    <div className="flex gap-2">
                      <Button className="btn-hover flex-1 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" className="btn-hover border-indigo-600/20 hover:bg-indigo-50">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" className="btn-hover border-indigo-600/20 hover:bg-indigo-50">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Categories */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl flex items-center justify-center">
                <Grid3x3 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                <CardTitle className="text-xl font-bold text-foreground">Service Categories</CardTitle>
                <CardDescription>Browse CAs by service specialization</CardDescription>
                    </div>
                  </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.categories.map((category) => (
                <Card key={category.id} className="card-hover border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/60">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      {category.icon === 'Receipt' && <Receipt className="w-6 h-6 text-accent" />}
                      {category.icon === 'Calculator' && <Calculator className="w-6 h-6 text-primary" />}
                      {category.icon === 'Scale' && <Scale className="w-6 h-6 text-purple-600" />}
                      {category.icon === 'Target' && <Target className="w-6 h-6 text-success" />}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{category.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Avg Price:</span>
                        <span className="font-bold text-accent">₹{category.avgPrice.toLocaleString()}</span>
                  </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">CAs Available:</span>
                        <span className="font-bold text-primary">{category.cas}</span>
                      </div>
                      <Badge variant={category.demandLevel === 'high' ? 'default' : 'outline'} className="text-xs">
                        {category.demandLevel} demand
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
                </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card className="card-hover bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800 border-0 shadow-xl text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Post Your Requirement</h3>
              <p className="text-white/80 mb-6 text-sm">
                Get personalized proposals from qualified CAs
              </p>
              <Button className="btn-hover w-full bg-white text-indigo-600 hover:bg-white/90 font-semibold">
                <FileText className="w-4 h-4 mr-2" />
                Post Requirement
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-success/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Market Trends</CardTitle>
                <CardDescription>Current market insights</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.trends.map((trend, index) => (
                <div key={index} className="p-3 rounded-lg hover:bg-success/5 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{trend.category}</span>
                    <Badge className="bg-success/10 text-success border-success/20 text-xs">
                      +{trend.growth}%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{trend.description}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Avg Price: ₹{trend.avgPrice.toLocaleString()}</span>
                    <span>Demand: {trend.demand}%</span>
                  </div>
                  <Progress value={trend.demand} className="h-1 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Client Stories</CardTitle>
                <CardDescription>Success testimonials</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.testimonials.map((testimonial) => (
                <div key={testimonial.id} className="p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(testimonial.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    {testimonial.verified && <Verified className="w-3 h-3 text-blue-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-2">"{testimonial.comment}"</p>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-medium text-foreground">{testimonial.clientName}</div>
                      <div className="text-muted-foreground">worked with {testimonial.caName}</div>
                    </div>
                    {testimonial.savings && (
                      <div className="text-success font-bold">
                        Saved ₹{(testimonial.savings / 100000).toFixed(1)}L
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Stats */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">Platform Stats</CardTitle>
                <CardDescription>Real-time marketplace metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expert CAs</span>
                <span className="font-bold text-indigo-600">{data.analytics.totalCAs.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Clients</span>
                <span className="font-bold text-success">{data.analytics.totalClients.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Response</span>
                <span className="font-bold text-accent">{data.analytics.avgResponseTime}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="font-bold text-primary">
                  {Math.round((data.analytics.successfulMatches / data.analytics.totalTransactions) * 100)}%
                    </span>
                  </div>
                  </div>
          </CardContent>
        </Card>
                </div>
              </div>
  )
}

// Placeholder tabs (simplified for brevity)
function RequestsTab({ data }: { data: MarketplaceData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600/10 to-purple-700/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Active Client Requests</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Browse and respond to client requirements posted on the platform
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-indigo-50">
              <div className="text-2xl font-bold text-indigo-600">{data.clientRequests.length}</div>
              <div className="text-sm text-muted-foreground">Open Requests</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-2xl font-bold text-success">₹{(data.clientRequests.reduce((sum, req) => sum + req.budget, 0) / 100000).toFixed(1)}L</div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/10">
              <div className="text-2xl font-bold text-accent">{data.analytics.avgResponseTime}h</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
          </div>
          <Button className="btn-hover bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-4">
            <FileText className="w-5 h-5 mr-2" />
            Browse All Requests
          </Button>
            </CardContent>
          </Card>
      </div>
  )
}

function AnalyticsTab({ data }: { data: MarketplaceData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-success/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Market Intelligence Dashboard</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Comprehensive market analytics, pricing insights, and demand forecasting
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-3xl font-bold text-success">{data.analytics.satisfactionScore}</div>
              <div className="text-sm text-muted-foreground">Platform Rating</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-indigo-50">
              <div className="text-3xl font-bold text-indigo-600">₹{(data.analytics.avgProjectValue / 1000).toFixed(0)}K</div>
              <div className="text-sm text-muted-foreground">Avg Project Value</div>
            </div>
          </div>
          <Button className="btn-hover bg-gradient-to-r from-success to-secondary text-white px-8 py-4">
            <TrendingUp className="w-5 h-5 mr-2" />
            View Detailed Analytics
          </Button>
        </CardContent>
      </Card>
        </div>
  )
}

function ProfileTab({ data }: { data: MarketplaceData }) {
  return (
    <div className="space-y-6">
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Your Marketplace Profile</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Manage your profile, preferences, and marketplace activity
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">{data.userProfile.type === 'client' ? 'Client' : 'CA'}</div>
              <div className="text-sm text-muted-foreground">Profile Type</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/10">
              <div className="text-2xl font-bold text-accent">{data.userProfile.location}</div>
              <div className="text-sm text-muted-foreground">Location</div>
            </div>
          </div>
          <Button className="btn-hover bg-gradient-to-r from-primary to-accent text-white px-8 py-4">
            <Settings className="w-5 h-5 mr-2" />
            Manage Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}