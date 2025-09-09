'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/stores/auth-store'
import { 
  Camera,
  Mic,
  QrCode,
  Brain,
  Upload,
  FileText,
  Calculator,
  Users,
  MessageSquare,
  Zap,
  Sparkles,
  Target,
  Search,
  Scan,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
  ArrowRight,
  Eye,
  Download,
  Share2,
  BookOpen,
  HelpCircle,
  Settings,
  Bookmark
} from 'lucide-react'

interface QuickActionsProps {
  className?: string
}

interface QuickAction {
  id: string
  name: string
  description: string
  icon: any
  color: string
  textColor?: string
  action: () => void
  badge?: string
  disabled?: boolean
  premium?: boolean
}

export function QuickActions({ className }: QuickActionsProps) {
  const { user } = useAuthStore()
  const [isListening, setIsListening] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [actionResult, setActionResult] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Voice recognition setup
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-IN'
      
      recognition.onstart = () => {
        setIsListening(true)
        setActionResult({ type: 'info', message: 'Listening... Speak your query' })
      }
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        handleVoiceQuery(transcript)
      }
      
      recognition.onerror = () => {
        setIsListening(false)
        setActionResult({ type: 'error', message: 'Voice recognition failed' })
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      setRecognition(recognition)
    }
  }, [])

  const quickActions: QuickAction[] = [
    {
      id: 'camera',
      name: 'Scan Document',
      description: 'AI-powered document scanning',
      icon: Camera,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-white',
      action: () => handleCameraCapture(),
      badge: 'AI'
    },
    {
      id: 'voice',
      name: 'Voice Assistant',
      description: 'Ask me anything about taxes',
      icon: isListening ? Volume2 : Mic,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      textColor: 'text-white',
      action: () => handleVoiceQuery(),
      badge: isListening ? 'Listening' : 'Voice'
    },
    {
      id: 'qr',
      name: 'QR Scanner',
      description: 'Scan QR codes for instant data',
      icon: QrCode,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      textColor: 'text-white',
      action: () => handleQRScan(),
      badge: 'Scan'
    },
    {
      id: 'ai',
      name: 'AI Chat',
      description: 'Smart financial assistant',
      icon: Brain,
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      textColor: 'text-white',
      action: () => handleAIChat(),
      badge: 'New',
      premium: true
    },
    {
      id: 'upload',
      name: 'Upload Files',
      description: 'Drag & drop or select files',
      icon: Upload,
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      textColor: 'text-white',
      action: () => handleFileUpload(),
      badge: 'Bulk'
    },
    {
      id: 'calculator',
      name: 'Tax Calculator',
      description: 'Quick tax calculations',
      icon: Calculator,
      color: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      textColor: 'text-white',
      action: () => handleTaxCalculator()
    },
    {
      id: 'ca-connect',
      name: 'Find CA',
      description: 'Connect with expert CAs',
      icon: Users,
      color: 'bg-gradient-to-br from-pink-500 to-rose-600',
      textColor: 'text-white',
      action: () => handleCAConnect(),
      badge: 'Live'
    },
    {
      id: 'quick-chat',
      name: 'Quick Support',
      description: '24/7 instant help',
      icon: MessageSquare,
      color: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      textColor: 'text-white',
      action: () => handleQuickSupport(),
      badge: '24/7'
    }
  ]

  const handleCameraCapture = async () => {
    try {
      setIsCameraOpen(true)
      setActionResult({ type: 'info', message: 'Opening camera...' })
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setActionResult({ type: 'success', message: 'Camera ready! Position document and tap capture' })
      }
    } catch (error) {
      setActionResult({ type: 'error', message: 'Camera access denied' })
      setIsCameraOpen(false)
    }
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    if (context) {
      context.drawImage(video, 0, 0)
      
      // Convert to blob and process
      canvas.toBlob(async (blob) => {
        if (blob) {
          await processDocument(blob)
        }
      }, 'image/jpeg', 0.8)
    }

    // Stop camera
    const stream = video.srcObject as MediaStream
    stream?.getTracks().forEach(track => track.stop())
    setIsCameraOpen(false)
  }

  const processDocument = async (blob: Blob) => {
    setUploadProgress(10)
    setActionResult({ type: 'info', message: 'Processing document with AI...' })

    try {
      const formData = new FormData()
      formData.append('document', blob, 'captured-document.jpg')
      formData.append('userId', user?.id || '')

      setUploadProgress(50)

      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setUploadProgress(100)
      setActionResult({ 
        type: 'success', 
        message: 'Document processed! Found Form 16 with ₹2.5L salary details' 
      })

      // Reset progress after success
      setTimeout(() => {
        setUploadProgress(0)
        setActionResult(null)
      }, 3000)

    } catch (error) {
      setUploadProgress(0)
      setActionResult({ type: 'error', message: 'Failed to process document' })
    }
  }

  function handleVoiceQuery(transcript?: string) {
    if (!recognition) {
      setActionResult({ type: 'error', message: 'Voice recognition not supported' })
      return
    }

    if (isListening) {
      recognition.stop()
      return
    }

    if (transcript) {
      setActionResult({ 
        type: 'info', 
        message: `Processing: "${transcript}"` 
      })
      
      // Simulate AI response
      setTimeout(() => {
        setActionResult({ 
          type: 'success', 
          message: 'Found 3 tax-saving opportunities worth ₹45,000!' 
        })
      }, 1500)
    } else {
      recognition.start()
    }
  }

  const handleQRScan = () => {
    setIsScanning(true)
    setActionResult({ type: 'info', message: 'QR Scanner opening...' })
    
    // Simulate QR scan
    setTimeout(() => {
      setIsScanning(false)
      setActionResult({ 
        type: 'success', 
        message: 'QR Code scanned! Redirecting to GST portal...' 
      })
    }, 2000)
  }

  const handleAIChat = () => {
    setActionResult({ 
      type: 'info', 
      message: 'Opening AI Financial Assistant...' 
    })
    
    setTimeout(() => {
      // Redirect to AI chat
      window.location.href = '/ai-chat'
    }, 1000)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploadProgress(10)
    setActionResult({ 
      type: 'info', 
      message: `Uploading ${files.length} file(s)...` 
    })

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    // Simulate processing
    setTimeout(() => {
      setUploadProgress(100)
      setActionResult({ 
        type: 'success', 
        message: `Successfully processed ${files.length} document(s)` 
      })
      
      setTimeout(() => {
        setUploadProgress(0)
        setActionResult(null)
      }, 3000)
    }, 2000)
  }

  const handleTaxCalculator = () => {
    window.location.href = '/calculator'
  }

  const handleCAConnect = () => {
    window.location.href = '/ca-marketplace'
  }

  const handleQuickSupport = () => {
    setActionResult({ 
      type: 'info', 
      message: 'Connecting to support agent...' 
    })
    
    setTimeout(() => {
      setActionResult({ 
        type: 'success', 
        message: 'Connected! Agent will respond in 30 seconds' 
      })
    }, 1500)
  }

  const dismissResult = () => {
    setActionResult(null)
    setUploadProgress(0)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Status Message */}
      {actionResult && (
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {actionResult.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {actionResult.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                {actionResult.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{actionResult.message}</p>
                {uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{uploadProgress}% complete</p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 flex-shrink-0"
                onClick={dismissResult}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera View */}
      {isCameraOpen && (
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-lg"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16 p-0"
                  onClick={capturePhoto}
                >
                  <Camera className="w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm rounded-full w-12 h-12 p-0"
                  onClick={() => {
                    const video = videoRef.current
                    const stream = video?.srcObject as MediaStream
                    stream?.getTracks().forEach(track => track.stop())
                    setIsCameraOpen(false)
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon
          
          return (
            <Card 
              key={action.id}
              className="card-hover border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={action.disabled ? undefined : action.action}
            >
              <CardContent className="p-4 relative overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute inset-0 ${action.color} opacity-90`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm ${action.disabled ? 'opacity-50' : ''}`}>
                      <Icon className={`w-5 h-5 ${action.textColor || 'text-white'} ${action.id === 'voice' && isListening ? 'animate-pulse' : ''}`} />
                    </div>
                    
                    {action.badge && (
                      <Badge className="bg-white/20 text-white border-0 text-xs backdrop-blur-sm">
                        {action.badge}
                      </Badge>
                    )}
                    
                    {action.premium && (
                      <div className="absolute top-2 right-2">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className={`font-semibold mb-1 ${action.textColor || 'text-white'} ${action.disabled ? 'opacity-50' : ''}`}>
                      {action.name}
                    </h3>
                    <p className={`text-xs opacity-80 ${action.textColor || 'text-white'} ${action.disabled ? 'opacity-30' : ''}`}>
                      {action.description}
                    </p>
                  </div>
                  
                  {action.disabled && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Badge className="bg-destructive text-white border-0">
                        Coming Soon
                      </Badge>
                    </div>
                  )}
                  
                  {/* Loading states */}
                  {((action.id === 'voice' && isListening) || (action.id === 'qr' && isScanning)) && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Additional Quick Links */}
      <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Quick Links
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Tax Guide', icon: BookOpen, href: '/guide' },
              { name: 'Deadlines', icon: Target, href: '/deadlines' },
              { name: 'Help Center', icon: HelpCircle, href: '/help' },
              { name: 'Settings', icon: Settings, href: '/settings' }
            ].map((link, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-primary/10 transition-all duration-200"
                onClick={() => window.location.href = link.href}
              >
                <link.icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  {link.name}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
