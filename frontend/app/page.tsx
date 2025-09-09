'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Zap, 
  Users, 
  FileText,
  TrendingUp,
  Lock,
  Globe,
  Smartphone,
  BarChart3,
  Target,
  Award,
  Star,
  Brain,
  Sparkles,
  Calculator,
  PieChart,
  IndianRupee,
  Clock,
  Trophy,
  Lightbulb
} from 'lucide-react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [stats] = useState({
    users: 125000,
    transactions: 2500000,
    cas: 1500,
    savings: 45000000
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Simple approach - just use false for isAuthenticated to avoid hydration issues
  const isAuthenticated = false


  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Insights',
      description: 'Get personalized financial recommendations powered by advanced AI algorithms.'
    },
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Your data is protected with enterprise-level security and DPDP compliance.'
    },
    {
      icon: Users,
      title: 'CA Marketplace',
      description: 'Connect with verified Chartered Accountants for expert financial guidance.'
    },
    {
      icon: FileText,
      title: 'Automated Filing',
      description: 'Streamline tax filing and compliance with intelligent automation.'
    }
  ]

  const benefits = [
    'Save up to 40% on tax payments',
    'Automated transaction categorization',
    'Real-time financial health monitoring',
    'Expert CA consultation on-demand',
    'GST and ITR filing automation',
    'Investment optimization suggestions'
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Small Business Owner',
      content: 'FinTwin helped me save ₹50,000 in taxes last year. The AI insights are incredibly accurate!',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Freelancer',
      content: 'The CA marketplace is a game-changer. I found the perfect CA for my needs within minutes.',
      rating: 5
    },
    {
      name: 'Anita Patel',
      role: 'Corporate Executive',
      content: 'Automated transaction categorization saves me hours every month. Highly recommended!',
      rating: 5
    }
  ]


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 pt-20 pb-32">
          <div className="max-w-6xl mx-auto">
            {/* Announcement Bar */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                🎉 Now live! AI-powered tax filing in under 5 minutes
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Main Hero Content */}
            <div className="text-center space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                India's First{' '}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  AI Financial Twin
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed text-balance">
                Transform your financial life with AI-powered insights, automated tax compliance, 
                and access to India's largest verified CA marketplace. 
                <span className="text-primary font-semibold">Save ₹50,000+ annually</span> with zero effort.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span>Bank-grade security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" />
                  <span>1M+ trusted users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-secondary" />
                  <span>RBI compliant</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isAuthenticated ? (
                  <Link href="/financial-twin">
                    <Button size="lg" className="btn-hover w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-primary/25">
                      <Brain className="mr-2 w-5 h-5" />
                      Open My Financial Twin
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/register">
                      <Button size="lg" className="btn-hover w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-primary/25">
                        <Sparkles className="mr-2 w-5 h-5" />
                        Start Free Trial
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button variant="outline" size="lg" className="btn-hover w-full sm:w-auto border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 px-8 py-4 text-lg font-semibold rounded-xl">
                        <Lock className="mr-2 w-5 h-5" />
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Social Proof */}
              <div className="flex flex-col items-center gap-4 pt-8">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">4.9/5 from 25,000+ reviews</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Best financial app I've ever used. Saved me ₹75,000 in taxes!" - Priya S., Mumbai
                </p>
              </div>
            </div>

            {/* Feature Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">5-Minute Tax Filing</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    AI automatically fills your ITR. Just review and submit. 
                    <span className="text-primary font-semibold">99.9% accuracy guaranteed.</span>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <PieChart className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">Smart Investments</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    AI recommends perfect portfolio for your goals. 
                    <span className="text-secondary font-semibold">Start with just ₹500.</span>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="card-hover bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Expert CA Access</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base">
                    Chat with top CAs anytime. 
                    <span className="text-accent font-semibold">15-min video calls included.</span>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Millions Across India
            </h2>
            <p className="text-lg text-muted-foreground">
              Join the financial revolution that's saving Indians crores every year
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 animate-count-up">
                  {stats.users.toLocaleString()}+
                </div>
                <div className="text-muted-foreground font-medium">Active Users</div>
                <div className="text-xs text-muted-foreground/60 mt-1">Growing by 15% monthly</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2 animate-count-up">
                  {stats.transactions.toLocaleString()}+
                </div>
                <div className="text-muted-foreground font-medium">Transactions Processed</div>
                <div className="text-xs text-muted-foreground/60 mt-1">AI-categorized with 99.9% accuracy</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2 animate-count-up">
                  {stats.cas.toLocaleString()}+
                </div>
                <div className="text-muted-foreground font-medium">Verified CAs</div>
                <div className="text-xs text-muted-foreground/60 mt-1">ICAI certified experts</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 animate-count-up">
                  ₹{(stats.savings / 10000000).toFixed(1)}Cr+
                </div>
                <div className="text-muted-foreground font-medium">Tax Savings Generated</div>
                <div className="text-xs text-muted-foreground/60 mt-1">Average ₹50,000 per user</div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-muted/20">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">RBI Approved</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">Data Localization</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Why Choose FinTwin?
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Experience the Future of{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Financial Management
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Cutting-edge AI technology meets expert human guidance to transform 
              how Indians manage their money, taxes, and investments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group card-hover text-center bg-gradient-to-br from-white to-slate-50/50 border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                <CardHeader className="pb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-primary group-hover:text-secondary transition-colors duration-300" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent to-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Feature Highlights */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Feature List */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-6">
                  Everything You Need in One Platform
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  From tax filing to wealth building, FinTwin handles it all with intelligence and precision.
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Brain,
                    title: "AI-Powered Insights",
                    description: "Get personalized recommendations that actually understand your financial situation."
                  },
                  {
                    icon: Clock,
                    title: "Save 20+ Hours Annually",
                    description: "Automate repetitive tasks and focus on what matters most to you."
                  },
                  {
                    icon: Trophy,
                    title: "Guaranteed Tax Savings",
                    description: "Or we'll pay the difference. That's how confident we are in our AI."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">{item.title}</h4>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Visual Element */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-3xl p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-secondary rounded-full"></div>
                        <span className="text-sm font-medium text-muted-foreground">Tax Saved</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">₹45,000</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium text-muted-foreground">Portfolio Value</span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">₹8.5L</div>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">Monthly Goals</span>
                      <span className="text-sm text-secondary font-medium">On Track</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
                
                {/* Background decorations */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transform Your Financial Life
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of Indians who have revolutionized their financial management 
                with FinTwin's AI-powered platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">40%</div>
                <div className="text-sm text-gray-600">Average Tax Savings</div>
              </Card>
              <Card className="text-center p-6">
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </Card>
              <Card className="text-center p-6">
                <Award className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </Card>
              <Card className="text-center p-6">
                <BarChart3 className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">AI Monitoring</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers who trust FinTwin with their finances.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-20" />
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8">
              <Trophy className="w-4 h-4 mr-2" />
              🚀 Join 1M+ Indians Building Wealth with AI
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your{' '}
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                Financial Future?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join India's most trusted AI financial platform and start your journey 
              to financial freedom. <span className="text-yellow-300 font-semibold">Start saving today!</span>
            </p>

            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">₹0</div>
                <div className="text-white/80 text-sm">Setup Fee</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">5 min</div>
                <div className="text-white/80 text-sm">To Get Started</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">₹50K+</div>
                <div className="text-white/80 text-sm">Average Savings</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link href="/financial-twin">
                  <Button size="lg" className="btn-hover w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl">
                    <Brain className="mr-2 w-5 h-5" />
                    Open My Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/register">
                    <Button size="lg" className="btn-hover w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl">
                      <Sparkles className="mr-2 w-5 h-5" />
                      Start Free Trial Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button size="lg" variant="outline" className="btn-hover w-full sm:w-auto border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-xl">
                      <Lock className="mr-2 w-5 h-5" />
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Money Back Guarantee */}
            <div className="flex items-center justify-center gap-3 mt-8 text-white/80">
              <Shield className="w-5 h-5" />
              <span className="text-sm">30-day money-back guarantee • No hidden fees • Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}