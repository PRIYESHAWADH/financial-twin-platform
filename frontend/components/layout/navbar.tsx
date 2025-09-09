'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Wallet,
  FileText,
  Users,
  Brain,
  Sparkles,
  ChevronDown
} from 'lucide-react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsProfileOpen(false)
  }

  const navigation = [
    { name: 'Dashboard', href: '/financial-twin', icon: Wallet },
    { name: 'CA Marketplace', href: '/ca-marketplace', icon: Users },
    { name: 'Documents', href: '/data-ingestion', icon: FileText },
    { name: 'Consent', href: '/consent', icon: Settings },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FinTwin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center space-x-2 text-muted-foreground hover:text-primary px-4 py-2 rounded-lg transition-all duration-200 hover:bg-primary/5 font-medium"
              >
                <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-4 h-4" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="w-4 h-4" />
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:block">{user?.firstName} {user?.lastName}</span>
                </Button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <Card className="absolute right-0 mt-2 w-48 z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b">
                        <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 rounded w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" className="btn-hover font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="btn-hover bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium px-6">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="px-4 pt-4 border-t">
                  <Link href="/auth/login" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="block mt-2">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
