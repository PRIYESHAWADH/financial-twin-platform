'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Wifi,
  WifiOff,
  RefreshCw,
  CloudOff,
  Download,
  FileText,
  Calculator,
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Smartphone,
  Globe,
  Shield,
  Star,
  Heart,
  Sparkles,
  Target,
  Activity,
  Bookmark,
  Archive,
  Eye,
  HelpCircle,
  Settings,
  ArrowRight,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Share2,
  Copy,
  Info,
  Lightbulb,
  Users,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Home,
  Building2,
  Briefcase,
  GraduationCap,
  Coffee,
  Music,
  Camera,
  Video,
  Mic,
  Book,
  Headphones
} from 'lucide-react'

interface OfflineFeature {
  id: string
  title: string
  description: string
  icon: any
  available: boolean
  cached: boolean
  lastSync?: Date
}

interface CachedData {
  category: string
  items: number
  size: string
  lastUpdated: Date
}

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [syncProgress, setSyncProgress] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => {
      setIsOnline(true)
      attemptSync()
    }
    
    const handleOffline = () => {
      setIsOnline(false)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const attemptSync = async () => {
    setIsSyncing(true)
    setSyncProgress(0)
    
    // Simulate sync process
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSyncing(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const retryConnection = () => {
    setRetryCount(prev => prev + 1)
    // Attempt to reload the page
    window.location.reload()
  }

  const offlineFeatures: OfflineFeature[] = [
    {
      id: 'calculator',
      title: 'Tax Calculator',
      description: 'Calculate taxes offline with cached tax slabs',
      icon: Calculator,
      available: true,
      cached: true,
      lastSync: new Date('2024-06-20T10:00:00')
    },
    {
      id: 'documents',
      title: 'View Documents',
      description: 'Access previously downloaded documents',
      icon: FileText,
      available: true,
      cached: true,
      lastSync: new Date('2024-06-20T09:30:00')
    },
    {
      id: 'profile',
      title: 'Profile & Settings',
      description: 'View and edit your profile information',
      icon: Settings,
      available: true,
      cached: true,
      lastSync: new Date('2024-06-20T08:15:00')
    },
    {
      id: 'help',
      title: 'Help & Guides',
      description: 'Access cached help articles and guides',
      icon: HelpCircle,
      available: true,
      cached: true,
      lastSync: new Date('2024-06-19T16:00:00')
    },
    {
      id: 'ai-chat',
      title: 'AI Assistant',
      description: 'Limited offline AI with cached responses',
      icon: Brain,
      available: false,
      cached: false
    },
    {
      id: 'marketplace',
      title: 'CA Marketplace',
      description: 'Browse CAs (requires internet connection)',
      icon: Users,
      available: false,
      cached: false
    }
  ]

  const cachedData: CachedData[] = [
    {
      category: 'User Profile',
      items: 1,
      size: '2.3 KB',
      lastUpdated: new Date('2024-06-20T10:00:00')
    },
    {
      category: 'Tax Documents',
      items: 8,
      size: '15.7 MB',
      lastUpdated: new Date('2024-06-20T09:30:00')
    },
    {
      category: 'Tax Calculations',
      items: 12,
      size: '45.2 KB',
      lastUpdated: new Date('2024-06-20T08:15:00')
    },
    {
      category: 'Help Articles',
      items: 24,
      size: '892 KB',
      lastUpdated: new Date('2024-06-19T16:00:00')
    },
    {
      category: 'App Resources',
      items: 156,
      size: '4.2 MB',
      lastUpdated: new Date('2024-06-18T12:00:00')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-xl">
            <WifiOff className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            You're <span className="text-gray-600">Offline</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No internet connection detected. Don't worry! FinTwin works offline too. 
            Many features are still available with cached data.
          </p>
        </div>

        {/* Connection Status */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isOnline ? (
                    <Wifi className="w-5 h-5 text-green-600" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Connection Status
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? 'Back online! Syncing data...' : 'No internet connection'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={isOnline ? 'default' : 'destructive'} className="text-sm">
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryConnection}
                  disabled={isOnline || isSyncing}
                  className="btn-hover"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  Retry
                </Button>
              </div>
            </div>

            {/* Sync Progress */}
            {isSyncing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Syncing data...</span>
                  <span className="font-medium">{syncProgress}%</span>
                </div>
                <Progress value={syncProgress} className="h-2" />
              </div>
            )}

            {/* Retry Count */}
            {retryCount > 0 && !isOnline && (
              <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-700">
                    Connection attempt #{retryCount} failed. Check your internet connection.
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offline Features */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Available Offline</CardTitle>
                <CardDescription>Features you can use without internet</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offlineFeatures.map((feature) => {
                const Icon = feature.icon
                
                return (
                  <div
                    key={feature.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      feature.available 
                        ? 'border-green-100 bg-green-50/50 hover:bg-green-50 cursor-pointer' 
                        : 'border-gray-100 bg-gray-50/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        feature.available ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${feature.available ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{feature.title}</h4>
                          <Badge variant={feature.available ? 'default' : 'secondary'} className="text-xs">
                            {feature.available ? 'Available' : 'Offline'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {feature.description}
                        </p>
                        
                        {feature.cached && feature.lastSync && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Last synced: {feature.lastSync.toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {feature.available && (
                          <Button size="sm" className="mt-2 text-xs h-7 px-3">
                            Open
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Cached Data */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl flex items-center justify-center">
                <Archive className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Cached Data</CardTitle>
                <CardDescription>Your offline-accessible information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cachedData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-muted/50 hover:bg-muted/20 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{data.category}</h4>
                      <Badge variant="outline" className="text-xs">
                        {data.items} item{data.items > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Size: {data.size}</span>
                      <span>Updated: {data.lastUpdated.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <Button variant="outline" size="sm" className="text-xs h-7 px-3">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Offline Storage</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Your data is securely cached on your device for offline access. 
                    When you reconnect, we'll sync the latest updates automatically.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offline Tips */}
        <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Offline Tips</CardTitle>
                <CardDescription>Make the most of your offline experience</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: Calculator,
                  title: 'Use Tax Calculator',
                  description: 'Calculate taxes with cached tax slabs and rates'
                },
                {
                  icon: FileText,
                  title: 'Review Documents',
                  description: 'Access previously uploaded and processed documents'
                },
                {
                  icon: HelpCircle,
                  title: 'Read Help Guides',
                  description: 'Browse cached help articles and tutorials'
                },
                {
                  icon: Settings,
                  title: 'Update Profile',
                  description: 'Edit profile information (syncs when online)'
                }
              ].map((tip, index) => (
                <div key={index} className="p-4 rounded-xl border border-muted/50 hover:bg-muted/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <tip.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* PWA Benefits */}
        <Card className="card-hover bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 border-0 shadow-xl text-white animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl transform -translate-x-12 translate-y-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">FinTwin PWA Benefits</h3>
                  <p className="text-white/80 text-sm">Why our Progressive Web App is awesome</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <CloudOff className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="font-semibold mb-1">Offline First</div>
                  <div className="text-xs text-white/80">Works without internet</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Zap className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="font-semibold mb-1">Lightning Fast</div>
                  <div className="text-xs text-white/80">Instant app-like speed</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Shield className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="font-semibold mb-1">Secure & Private</div>
                  <div className="text-xs text-white/80">Your data stays safe</div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-white/90 text-sm mb-4">
                  Install FinTwin on your device for the best offline experience
                </p>
                <Button className="bg-white text-indigo-600 hover:bg-white/90 font-semibold">
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-muted-foreground text-sm">
            FinTwin works seamlessly online and offline. Your productivity never stops! 
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
            <Heart className="w-3 h-3 text-red-500" />
            <span>Made with love for the offline-first experience</span>
          </div>
        </div>
      </div>
    </div>
  )
}
