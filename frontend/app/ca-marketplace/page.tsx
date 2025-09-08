'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Phone,
  Mail,
  Award,
  CheckCircle,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Shield,
  BookOpen,
  Briefcase
} from 'lucide-react'

interface CAProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  specialization: string[]
  experience: number
  rating: number
  reviewCount: number
  hourlyRate: number
  isVerified: boolean
  isAvailable: boolean
  languages: string[]
  qualifications: string[]
  services: string[]
  bio: string
  profileImage?: string
  responseTime: string
  successRate: number
  totalClients: number
  joinedDate: string
}

export default function CAMarketplacePage() {
  const [cas, setCAs] = useState<CAProfile[]>([])
  const [filteredCAs, setFilteredCAs] = useState<CAProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [sortBy, setSortBy] = useState('rating')

  const specializations = [
    'Tax Planning',
    'GST Compliance',
    'Audit & Assurance',
    'Corporate Law',
    'Investment Advisory',
    'Business Setup',
    'Financial Planning',
    'Compliance Management'
  ]

  const locations = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad'
  ]

  useEffect(() => {
    // Simulate API call to fetch CA profiles
    const fetchCAs = async () => {
      try {
        // Mock data - in production, this would come from the backend
        const mockCAs: CAProfile[] = [
          {
            id: '1',
            name: 'Dr. Priya Sharma',
            email: 'priya.sharma@example.com',
            phone: '+91 98765 43210',
            location: 'Mumbai',
            specialization: ['Tax Planning', 'GST Compliance', 'Investment Advisory'],
            experience: 12,
            rating: 4.9,
            reviewCount: 156,
            hourlyRate: 2500,
            isVerified: true,
            isAvailable: true,
            languages: ['English', 'Hindi', 'Marathi'],
            qualifications: ['CA', 'CS', 'CFA'],
            services: ['Tax Filing', 'GST Returns', 'Financial Planning', 'Audit Services'],
            bio: 'Experienced CA with 12+ years in tax planning and compliance. Specialized in helping small businesses and individuals optimize their tax strategies.',
            responseTime: '2 hours',
            successRate: 98,
            totalClients: 450,
            joinedDate: '2020-01-15'
          },
          {
            id: '2',
            name: 'Rajesh Kumar',
            email: 'rajesh.kumar@example.com',
            phone: '+91 98765 43211',
            location: 'Delhi',
            specialization: ['Audit & Assurance', 'Corporate Law', 'Compliance Management'],
            experience: 8,
            rating: 4.7,
            reviewCount: 89,
            hourlyRate: 2000,
            isVerified: true,
            isAvailable: true,
            languages: ['English', 'Hindi'],
            qualifications: ['CA', 'LLB'],
            services: ['Audit Services', 'Legal Compliance', 'Corporate Filings', 'Due Diligence'],
            bio: 'CA and Lawyer with expertise in corporate compliance and audit services. Focused on helping businesses maintain regulatory compliance.',
            responseTime: '4 hours',
            successRate: 95,
            totalClients: 280,
            joinedDate: '2021-03-20'
          },
          {
            id: '3',
            name: 'Anita Patel',
            email: 'anita.patel@example.com',
            phone: '+91 98765 43212',
            location: 'Bangalore',
            specialization: ['Financial Planning', 'Investment Advisory', 'Business Setup'],
            experience: 15,
            rating: 4.8,
            reviewCount: 203,
            hourlyRate: 3000,
            isVerified: true,
            isAvailable: false,
            languages: ['English', 'Hindi', 'Kannada'],
            qualifications: ['CA', 'CFA', 'MBA'],
            services: ['Financial Planning', 'Investment Advisory', 'Business Setup', 'Wealth Management'],
            bio: 'Senior CA with 15+ years experience in financial planning and investment advisory. Expert in helping clients build and manage wealth.',
            responseTime: '1 hour',
            successRate: 97,
            totalClients: 520,
            joinedDate: '2019-06-10'
          },
          {
            id: '4',
            name: 'Vikram Singh',
            email: 'vikram.singh@example.com',
            phone: '+91 98765 43213',
            location: 'Chennai',
            specialization: ['GST Compliance', 'Tax Planning', 'Audit & Assurance'],
            experience: 6,
            rating: 4.6,
            reviewCount: 67,
            hourlyRate: 1800,
            isVerified: true,
            isAvailable: true,
            languages: ['English', 'Hindi', 'Tamil'],
            qualifications: ['CA'],
            services: ['GST Returns', 'Tax Filing', 'Audit Services', 'Compliance'],
            bio: 'Young and dynamic CA specializing in GST compliance and tax planning. Committed to providing efficient and cost-effective solutions.',
            responseTime: '3 hours',
            successRate: 92,
            totalClients: 180,
            joinedDate: '2022-01-05'
          }
        ]
        
        setCAs(mockCAs)
        setFilteredCAs(mockCAs)
      } catch (error) {
        console.error('Error fetching CA profiles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCAs()
  }, [])

  useEffect(() => {
    // Filter CAs based on search criteria
    let filtered = cas

    if (searchTerm) {
      filtered = filtered.filter(ca => 
        ca.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ca.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ca.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(ca => 
        ca.specialization.includes(selectedSpecialization)
      )
    }

    if (selectedLocation) {
      filtered = filtered.filter(ca => 
        ca.location === selectedLocation
      )
    }

    // Sort CAs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'experience':
          return b.experience - a.experience
        case 'rate':
          return a.hourlyRate - b.hourlyRate
        case 'availability':
          return a.isAvailable === b.isAvailable ? 0 : a.isAvailable ? -1 : 1
        default:
          return 0
      }
    })

    setFilteredCAs(filtered)
  }, [cas, searchTerm, selectedSpecialization, selectedLocation, sortBy])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          CA Marketplace
        </h1>
        <p className="text-gray-600">
          Connect with verified Chartered Accountants for expert financial guidance
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search CAs, specializations, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="rating">Sort by Rating</option>
            <option value="experience">Sort by Experience</option>
            <option value="rate">Sort by Rate</option>
            <option value="availability">Sort by Availability</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredCAs.length} CAs found
          </p>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Filters applied</span>
          </div>
        </div>
      </div>

      {/* CA Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCAs.map((ca) => (
          <Card key={ca.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {ca.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{ca.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{ca.location}</span>
                    </div>
                  </div>
                </div>
                {ca.isVerified && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Rating and Reviews */}
                <div className="flex items-center justify-between">
                  {renderStars(ca.rating)}
                  <span className="text-sm text-gray-600">
                    {ca.reviewCount} reviews
                  </span>
                </div>

                {/* Specializations */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {ca.specialization.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                    {ca.specialization.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{ca.specialization.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Experience and Rate */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">
                      {ca.experience}+
                    </div>
                    <div className="text-xs text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(ca.hourlyRate)}
                    </div>
                    <div className="text-xs text-gray-600">Per Hour</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {ca.successRate}%
                    </div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {ca.totalClients}
                    </div>
                    <div className="text-xs text-gray-600">Clients</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {ca.responseTime}
                    </div>
                    <div className="text-xs text-gray-600">Response</div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 line-clamp-3">
                  {ca.bio}
                </p>

                {/* Availability Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      ca.isAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-gray-600">
                      {ca.isAvailable ? 'Available' : 'Busy'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button size="sm">
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCAs.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No CAs found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button
            onClick={() => {
              setSearchTerm('')
              setSelectedSpecialization('')
              setSelectedLocation('')
              setSortBy('rating')
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}