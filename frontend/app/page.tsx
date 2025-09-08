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
  Star
} from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated } = useAuthStore()
  const [stats, setStats] = useState({
    users: 0,
    transactions: 0,
    cas: 0,
    savings: 0
  })

  // Animate stats on load
  useEffect(() => {
    const targetStats = {
      users: 125000,
      transactions: 2500000,
      cas: 1500,
      savings: 45000000
    }

    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      
      setStats({
        users: Math.floor(targetStats.users * progress),
        transactions: Math.floor(targetStats.transactions * progress),
        cas: Math.floor(targetStats.cas * progress),
        savings: Math.floor(targetStats.savings * progress)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              India's First{' '}
              <span className="text-primary">AI Financial Twin</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your financial life with AI-powered insights, automated compliance, 
              and access to India's largest CA marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href="/financial-twin">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started Free
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stats.users.toLocaleString()}+
              </div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stats.transactions.toLocaleString()}+
              </div>
              <div className="text-gray-600">Transactions Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stats.cas.toLocaleString()}+
              </div>
              <div className="text-gray-600">Verified CAs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                ₹{stats.savings.toLocaleString()}+
              </div>
              <div className="text-gray-600">Tax Savings Generated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FinTwin?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of financial management with cutting-edge AI technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
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
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join India's most trusted AI financial platform and start saving today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/financial-twin">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/register">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}