'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { 
  Home,
  Receipt,
  Users,
  Building2,
  Scale,
  Globe,
  Search,
  Bell,
  Menu,
  X,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Target,
  TrendingUp,
  Calculator,
  FileText,
  Camera,
  Mic,
  QrCode,
  Zap,
  Brain,
  Heart,
  Shield,
  Star,
  Gift,
  Crown,
  Diamond,
  Briefcase,
  GraduationCap,
  Activity
} from 'lucide-react'

interface MobileNavbarProps {
  className?: string
}

export function MobileNavbar({ className }: MobileNavbarProps) {
  const { user, logout } = useAuthStore()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallPromptVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallPromptVisible(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstallPromptVisible(false)
    }
    
    setDeferredPrompt(null)
  }

  const getPersonaIcon = (persona: string) => {
    switch (persona) {
      case 'salary_warrior': return Calculator
      case 'hustle_master': return Zap
      case 'business_builder': return Building2
      case 'tax_expert': return Scale
      case 'corporate_commander': return Crown
      case 'wealth_guardian': return Diamond
      default: return User
    }
  }

  const getPersonaColor = (persona: string) => {
    switch (persona) {
      case 'salary_warrior': return 'text-blue-600'
      case 'hustle_master': return 'text-orange-600'
      case 'business_builder': return 'text-green-600'
      case 'tax_expert': return 'text-purple-600'
      case 'corporate_commander': return 'text-red-600'
      case 'wealth_guardian': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      badge: null,
      description: 'Your financial dashboard'
    },
    {
      name: 'Salary Warrior',
      href: '/salary-warrior',
      icon: Calculator,
      badge: user?.primaryPersona === 'salary_warrior' ? 'Active' : null,
      description: 'Tax filing & optimization'
    },
    {
      name: 'Hustle Master',
      href: '/hustle-master',
      icon: Zap,
      badge: user?.primaryPersona === 'hustle_master' ? 'Active' : null,
      description: 'Freelancer business suite'
    },
    {
      name: 'Business Builder',
      href: '/business-builder',
      icon: Building2,
      badge: user?.primaryPersona === 'business_builder' ? 'Active' : null,
      description: 'MSME & startup platform'
    },
    {
      name: 'Tax Expert',
      href: '/tax-expert',
      icon: Scale,
      badge: user?.primaryPersona === 'tax_expert' ? 'Active' : null,
      description: 'CA practice management'
    },
    {
      name: 'CA Marketplace',
      href: '/ca-marketplace',
      icon: Globe,
      badge: null,
      description: 'Find expert CAs'
    }
  ]

  const quickActions = [
    {
      name: 'Upload Document',
      icon: Camera,
      action: () => console.log('Upload document'),
      color: 'bg-blue-500'
    },
    {
      name: 'Voice Query',
      icon: Mic,
      action: () => console.log('Voice query'),
      color: 'bg-green-500'
    },
    {
      name: 'QR Scan',
      icon: QrCode,
      action: () => console.log('QR scan'),
      color: 'bg-purple-500'
    },
    {
      name: 'AI Assistant',
      icon: Brain,
      action: () => console.log('AI assistant'),
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50 ${className}`}>
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">FinTwin</h1>
              {user && (
                <div className="flex items-center gap-1">
                  {(() => {
                    const PersonaIcon = getPersonaIcon(user.primaryPersona || '')
                    return <PersonaIcon className={`w-3 h-3 ${getPersonaColor(user.primaryPersona || '')}`} />
                  })()}
                  <span className="text-xs text-muted-foreground capitalize">
                    {user.primaryPersona?.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 hover:bg-primary/10"
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 relative hover:bg-primary/10"
            >
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white border-0 rounded-full p-0 flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </Badge>
              )}
            </Button>

            {/* Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 hover:bg-primary/10"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* PWA Install Banner */}
        {isInstallPromptVisible && (
          <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Install FinTwin App</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 text-xs px-3 py-1 h-auto"
                  onClick={handleInstallClick}
                >
                  Install
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 w-6 h-6 p-0"
                  onClick={() => setIsInstallPromptVisible(false)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-border/50">
        <div className="grid grid-cols-5 h-16">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center gap-1 transition-all duration-200
                  ${active 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }
                `}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
                  {item.badge && (
                    <div className="absolute -top-2 -right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className="text-xs font-medium leading-tight">
                  {item.name.split(' ')[0]}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Slide-out Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center gap-3">
                  {user && (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-b border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                      onClick={action.action}
                    >
                      <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium">{action.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Navigation</h3>
                  <div className="space-y-1">
                    {navigation.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.href)
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`
                            flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                            ${active 
                              ? 'bg-primary/10 text-primary border border-primary/20' 
                              : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                            }
                          `}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5" />
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.description}
                            </div>
                          </div>
                          {item.badge && (
                            <Badge className="bg-primary text-white border-0 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Additional Options */}
                <div className="p-4 border-t border-border/50">
                  <h3 className="text-sm font-semibold text-foreground mb-3">More</h3>
                  <div className="space-y-1">
                    {[
                      { name: 'Profile & Settings', icon: Settings, href: '/settings' },
                      { name: 'Help & Support', icon: HelpCircle, href: '/help' },
                      { name: 'Privacy & Security', icon: Shield, href: '/privacy' }
                    ].map((item) => {
                      const Icon = item.icon
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/50 bg-muted/20">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 text-destructive border-destructive/20 hover:bg-destructive/10"
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
                
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>FinTwin v1.0.0</span>
                  <span>•</span>
                  <span>Made with ❤️ in India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
      <div className="h-16" />
    </>
  )
}
