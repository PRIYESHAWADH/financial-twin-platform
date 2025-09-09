'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { performanceMonitor } from '@/lib/performance/monitoring'
import { performanceOptimizer } from '@/lib/performance/optimization'
import { 
  Activity,
  Zap,
  Target,
  Clock,
  Eye,
  Gauge,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  RefreshCw,
  Download,
  BarChart3,
  LineChart,
  PieChart,
  Monitor,
  Smartphone,
  Wifi,
  WifiOff,
  Server,
  Database,
  Image,
  Code,
  Globe,
  Shield,
  Sparkles,
  Brain,
  Lightbulb,
  Wrench,
  Star,
  Award,
  Trophy,
  Heart,
  ThumbsUp,
  ArrowRight,
  ExternalLink,
  Play,
  Pause,
  Square,
  MoreHorizontal
} from 'lucide-react'

interface PerformanceDashboardProps {
  className?: string
  isVisible?: boolean
}

interface PerformanceScore {
  overall: number
  fcp: number
  lcp: number
  fid: number
  cls: number
  ttfb: number
}

interface OptimizationSuggestion {
  id: string
  type: 'critical' | 'important' | 'minor'
  category: 'loading' | 'rendering' | 'interaction' | 'seo'
  title: string
  description: string
  impact: number
  effort: 'low' | 'medium' | 'high'
  implemented: boolean
}

export function PerformanceDashboard({ className, isVisible = false }: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<any>({})
  const [score, setScore] = useState<PerformanceScore>({
    overall: 0,
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0
  })
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [networkInfo, setNetworkInfo] = useState<any>({})
  const [deviceInfo, setDeviceInfo] = useState<any>({})
  const [isOptimizing, setIsOptimizing] = useState(false)

  useEffect(() => {
    if (isVisible) {
      loadPerformanceData()
      startRealTimeMonitoring()
    }

    return () => {
      stopRealTimeMonitoring()
    }
  }, [isVisible])

  const loadPerformanceData = async () => {
    try {
      // Get current performance metrics
      const currentMetrics = performanceMonitor.getMetrics()
      setMetrics(currentMetrics)

      // Calculate performance scores
      const newScore = calculatePerformanceScore(currentMetrics)
      setScore(newScore)

      // Get optimization suggestions
      const optimizations = performanceMonitor.getOptimizationSuggestions()
      setSuggestions(optimizations.map(opt => ({ ...opt, implemented: false })))

      // Get network and device information
      updateNetworkInfo()
      updateDeviceInfo()

      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to load performance data:', error)
    }
  }

  const calculatePerformanceScore = (metrics: any): PerformanceScore => {
    const scores = {
      overall: 0,
      fcp: calculateMetricScore(metrics.fcp, 1800), // Good: <1.8s
      lcp: calculateMetricScore(metrics.lcp, 2500), // Good: <2.5s
      fid: calculateMetricScore(metrics.fid, 100), // Good: <100ms
      cls: calculateMetricScore(metrics.cls, 0.1, true), // Good: <0.1 (lower is better)
      ttfb: calculateMetricScore(metrics.ttfb, 600) // Good: <600ms
    }

    scores.overall = Math.round((scores.fcp + scores.lcp + scores.fid + scores.cls + scores.ttfb) / 5)

    return scores
  }

  const calculateMetricScore = (value: number, threshold: number, lowerIsBetter = false): number => {
    if (value === undefined || value === null) return 0

    if (lowerIsBetter) {
      return Math.max(0, Math.min(100, 100 - (value / threshold) * 100))
    } else {
      return Math.max(0, Math.min(100, 100 - ((value - threshold) / threshold) * 100))
    }
  }

  const updateNetworkInfo = () => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      setNetworkInfo({
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      })
    }
  }

  const updateDeviceInfo = () => {
    if (typeof navigator !== 'undefined') {
      setDeviceInfo({
        deviceMemory: (navigator as any).deviceMemory || 'unknown',
        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
        platform: navigator.platform || 'unknown',
        userAgent: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
      })
    }
  }

  const startRealTimeMonitoring = () => {
    const interval = setInterval(() => {
      if (isMonitoring) {
        loadPerformanceData()
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }

  const stopRealTimeMonitoring = () => {
    setIsMonitoring(false)
  }

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
  }

  const runOptimization = async (suggestionId: string) => {
    setIsOptimizing(true)
    
    try {
      // Simulate optimization implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuggestions(prev => 
        prev.map(s => 
          s.id === suggestionId 
            ? { ...s, implemented: true }
            : s
        )
      )
      
      // Reload performance data after optimization
      await loadPerformanceData()
      
    } catch (error) {
      console.error('Optimization failed:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const runAllOptimizations = async () => {
    setIsOptimizing(true)
    
    try {
      for (const suggestion of suggestions.filter(s => !s.implemented)) {
        await runOptimization(suggestion.id)
        await new Promise(resolve => setTimeout(resolve, 500)) // Delay between optimizations
      }
    } finally {
      setIsOptimizing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 70) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return CheckCircle
    if (score >= 70) return AlertTriangle
    return AlertTriangle
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle
      case 'important': return Info
      case 'minor': return Lightbulb
      default: return Info
    }
  }

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50'
      case 'important': return 'border-orange-200 bg-orange-50'
      case 'minor': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${className}`}>
      <div className="absolute inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Performance Dashboard</h2>
                <p className="text-sm text-muted-foreground">
                  Real-time performance monitoring and optimization
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={isMonitoring ? 'default' : 'secondary'} className="text-sm">
                {isMonitoring ? 'Monitoring' : 'Paused'}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMonitoring}
                className="btn-hover"
              >
                {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={loadPerformanceData}
                disabled={isOptimizing}
                className="btn-hover"
              >
                <RefreshCw className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Score */}
              <div className="lg:col-span-1">
                <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-primary" />
                      Performance Score
                    </CardTitle>
                    <CardDescription>Overall performance rating</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreColor(score.overall)} mb-4`}>
                        <span className="text-3xl font-bold">{score.overall}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last updated: {lastUpdate.toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'First Contentful Paint', key: 'fcp', value: metrics.fcp, unit: 'ms' },
                        { label: 'Largest Contentful Paint', key: 'lcp', value: metrics.lcp, unit: 'ms' },
                        { label: 'First Input Delay', key: 'fid', value: metrics.fid, unit: 'ms' },
                        { label: 'Cumulative Layout Shift', key: 'cls', value: metrics.cls, unit: '' },
                        { label: 'Time to First Byte', key: 'ttfb', value: metrics.ttfb, unit: 'ms' }
                      ].map((metric) => {
                        const metricScore = score[metric.key as keyof PerformanceScore]
                        const ScoreIcon = getScoreIcon(metricScore)
                        
                        return (
                          <div key={metric.key} className="flex items-center justify-between p-3 rounded-lg border border-muted/50">
                            <div className="flex items-center gap-2">
                              <ScoreIcon className={`w-4 h-4 ${metricScore >= 90 ? 'text-green-600' : metricScore >= 70 ? 'text-orange-600' : 'text-red-600'}`} />
                              <span className="text-sm font-medium">{metric.label}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold">
                                {metric.value !== undefined ? `${metric.value.toFixed(metric.key === 'cls' ? 3 : 0)}${metric.unit}` : 'N/A'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Score: {metricScore}/100
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Optimization Suggestions */}
              <div className="lg:col-span-2">
                <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg font-bold">Optimization Suggestions</CardTitle>
                          <CardDescription>AI-powered performance improvements</CardDescription>
                        </div>
                      </div>
                      
                      <Button
                        onClick={runAllOptimizations}
                        disabled={isOptimizing || suggestions.every(s => s.implemented)}
                        className="btn-hover"
                      >
                        {isOptimizing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Optimizing...
                          </>
                        ) : (
                          <>
                            <Wrench className="w-4 h-4 mr-2" />
                            Optimize All
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {suggestions.length === 0 ? (
                        <div className="text-center py-8">
                          <Trophy className="w-12 h-12 text-green-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Excellent Performance!
                          </h3>
                          <p className="text-muted-foreground">
                            No optimization suggestions at the moment. Your app is running smoothly!
                          </p>
                        </div>
                      ) : (
                        suggestions.map((suggestion) => {
                          const SuggestionIcon = getSuggestionIcon(suggestion.type)
                          
                          return (
                            <div 
                              key={suggestion.id}
                              className={`p-4 rounded-xl border-2 ${getSuggestionColor(suggestion.type)} ${
                                suggestion.implemented ? 'opacity-60' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  suggestion.type === 'critical' ? 'bg-red-100 text-red-600' :
                                  suggestion.type === 'important' ? 'bg-orange-100 text-orange-600' :
                                  'bg-blue-100 text-blue-600'
                                }`}>
                                  <SuggestionIcon className="w-4 h-4" />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-foreground">{suggestion.title}</h4>
                                    <Badge 
                                      variant={
                                        suggestion.type === 'critical' ? 'destructive' :
                                        suggestion.type === 'important' ? 'default' : 'secondary'
                                      }
                                      className="text-xs"
                                    >
                                      {suggestion.type}
                                    </Badge>
                                    {suggestion.implemented && (
                                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                        ✓ Implemented
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                    {suggestion.description}
                                  </p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span>Impact: +{suggestion.impact}pts</span>
                                      <span>Effort: {suggestion.effort}</span>
                                      <span>Category: {suggestion.category}</span>
                                    </div>
                                    
                                    {!suggestion.implemented && (
                                      <Button
                                        size="sm"
                                        onClick={() => runOptimization(suggestion.id)}
                                        disabled={isOptimizing}
                                        className="text-xs h-7 px-3"
                                      >
                                        {isOptimizing ? (
                                          <RefreshCw className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <>
                                            Apply Fix
                                            <ArrowRight className="w-3 h-3 ml-1" />
                                          </>
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* System Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Network Information */}
              <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-primary" />
                    Network Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-foreground">
                        {networkInfo.effectiveType?.toUpperCase() || 'Unknown'}
                      </div>
                      <div className="text-xs text-muted-foreground">Connection Type</div>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-foreground">
                        {networkInfo.downlink ? `${networkInfo.downlink} Mbps` : 'Unknown'}
                      </div>
                      <div className="text-xs text-muted-foreground">Download Speed</div>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-foreground">
                        {networkInfo.rtt ? `${networkInfo.rtt}ms` : 'Unknown'}
                      </div>
                      <div className="text-xs text-muted-foreground">Round Trip Time</div>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-foreground">
                        {networkInfo.saveData ? 'Enabled' : 'Disabled'}
                      </div>
                      <div className="text-xs text-muted-foreground">Data Saver</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Device Information */}
              <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-primary" />
                    Device Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-foreground capitalize">
                        {deviceInfo.userAgent || 'Unknown'}
                      </div>
                      <div className="text-xs text-muted-foreground">Device Type</div>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-foreground">
                        {deviceInfo.deviceMemory !== 'unknown' ? `${deviceInfo.deviceMemory}GB` : 'Unknown'}
                      </div>
                      <div className="text-xs text-muted-foreground">Device Memory</div>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-foreground">
                        {deviceInfo.hardwareConcurrency !== 'unknown' ? `${deviceInfo.hardwareConcurrency}` : 'Unknown'}
                      </div>
                      <div className="text-xs text-muted-foreground">CPU Cores</div>
                    </div>
                    
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-lg font-bold text-foreground">
                        {typeof screen !== 'undefined' ? `${screen.width}×${screen.height}` : 'Unknown'}
                      </div>
                      <div className="text-xs text-muted-foreground">Screen Resolution</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border/50 bg-muted/20">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Performance monitoring powered by FinTwin AI</span>
              <Badge variant="outline" className="text-xs">
                v1.0.0
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="btn-hover">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              
              <Button variant="outline" size="sm" className="btn-hover">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
