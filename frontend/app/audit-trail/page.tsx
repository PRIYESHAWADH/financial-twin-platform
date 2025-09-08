'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  FileText,
  Database,
  Lock,
  Eye,
  Download,
  Calendar,
  Hash,
  Activity,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react'

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resourceType: string
  resourceId: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  status: 'success' | 'warning' | 'error'
  hash: string
  previousHash?: string
  isVerified: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface AuditSummary {
  totalLogs: number
  verifiedLogs: number
  failedVerifications: number
  criticalEvents: number
  lastVerification: string
  chainIntegrity: boolean
  totalUsers: number
  totalActions: number
}

export default function AuditTrailPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [summary, setSummary] = useState<AuditSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('7d')
  const [selectedUser, setSelectedUser] = useState('')

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' }
  ]

  const severityOptions = [
    { value: '', label: 'All Severity' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ]

  const dateRangeOptions = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' }
  ]

  useEffect(() => {
    // Simulate API call to fetch audit logs
    const fetchAuditLogs = async () => {
      try {
        // Mock data - in production, this would come from the backend
        const mockLogs: AuditLog[] = [
          {
            id: '1',
            timestamp: '2024-01-15T10:30:00Z',
            userId: 'user-123',
            userName: 'John Doe',
            action: 'LOGIN',
            resourceType: 'user',
            resourceId: 'user-123',
            details: { method: 'email', device: 'Chrome/Windows' },
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            status: 'success',
            hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
            previousHash: 'z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4',
            isVerified: true,
            severity: 'low'
          },
          {
            id: '2',
            timestamp: '2024-01-15T10:25:00Z',
            userId: 'user-456',
            userName: 'Jane Smith',
            action: 'DOCUMENT_UPLOAD',
            resourceType: 'document',
            resourceId: 'doc-789',
            details: { filename: 'bank_statement.pdf', size: '2.5MB', type: 'application/pdf' },
            ipAddress: '192.168.1.101',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            status: 'success',
            hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
            previousHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
            isVerified: true,
            severity: 'medium'
          },
          {
            id: '3',
            timestamp: '2024-01-15T10:20:00Z',
            userId: 'user-789',
            userName: 'Bob Johnson',
            action: 'CONSENT_REVOKED',
            resourceType: 'consent',
            resourceId: 'consent-123',
            details: { purpose: 'financial_analysis', dataTypes: ['transactions', 'bank_statements'] },
            ipAddress: '192.168.1.102',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
            status: 'warning',
            hash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
            previousHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
            isVerified: true,
            severity: 'high'
          },
          {
            id: '4',
            timestamp: '2024-01-15T10:15:00Z',
            userId: 'user-321',
            userName: 'Alice Brown',
            action: 'FAILED_LOGIN',
            resourceType: 'user',
            resourceId: 'user-321',
            details: { method: 'email', reason: 'invalid_password', attempts: 3 },
            ipAddress: '192.168.1.103',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            status: 'error',
            hash: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3',
            previousHash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
            isVerified: true,
            severity: 'critical'
          },
          {
            id: '5',
            timestamp: '2024-01-15T10:10:00Z',
            userId: 'user-654',
            userName: 'Charlie Wilson',
            action: 'DATA_EXPORT',
            resourceType: 'user_data',
            resourceId: 'export-456',
            details: { format: 'json', size: '15.2MB', dataTypes: ['transactions', 'documents'] },
            ipAddress: '192.168.1.104',
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            status: 'success',
            hash: 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4',
            previousHash: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3',
            isVerified: true,
            severity: 'medium'
          }
        ]

        const mockSummary: AuditSummary = {
          totalLogs: 125000,
          verifiedLogs: 124995,
          failedVerifications: 5,
          criticalEvents: 12,
          lastVerification: '2024-01-15T10:30:00Z',
          chainIntegrity: true,
          totalUsers: 2500,
          totalActions: 45
        }

        setAuditLogs(mockLogs)
        setFilteredLogs(mockLogs)
        setSummary(mockSummary)
      } catch (error) {
        console.error('Error fetching audit logs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAuditLogs()
  }, [])

  useEffect(() => {
    // Filter audit logs based on search criteria
    let filtered = auditLogs

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resourceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm)
      )
    }

    if (selectedStatus) {
      filtered = filtered.filter(log => log.status === selectedStatus)
    }

    if (selectedSeverity) {
      filtered = filtered.filter(log => log.severity === selectedSeverity)
    }

    if (selectedUser) {
      filtered = filtered.filter(log => log.userId === selectedUser)
    }

    // Filter by date range
    if (selectedDateRange !== 'all') {
      const now = new Date()
      const days = parseInt(selectedDateRange.replace('d', ''))
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      
      filtered = filtered.filter(log => 
        new Date(log.timestamp) >= cutoffDate
      )
    }

    setFilteredLogs(filtered)
  }, [auditLogs, searchTerm, selectedStatus, selectedSeverity, selectedDateRange, selectedUser])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          Audit Trail
        </h1>
        <p className="text-gray-600">
          Monitor and verify all system activities with immutable audit logs
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <Database className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {summary.totalLogs.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">
                All time records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Logs</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {summary.verifiedLogs.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">
                {((summary.verifiedLogs / summary.totalLogs) * 100).toFixed(2)}% verified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chain Integrity</CardTitle>
              <Shield className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {summary.chainIntegrity ? '100%' : '0%'}
              </div>
              <p className="text-xs text-gray-600">
                {summary.chainIntegrity ? 'Intact' : 'Compromised'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {summary.criticalEvents}
              </div>
              <p className="text-xs text-gray-600">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search actions, users, or IP addresses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredLogs.length} logs found
          </p>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Filters applied</span>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>
            Immutable record of all system activities with cryptographic verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(log.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {log.action}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(log.severity)}`}>
                          {log.severity.toUpperCase()}
                        </span>
                        {log.isVerified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{log.userName}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimestamp(log.timestamp)}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>{log.resourceType}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Hash className="w-4 h-4" />
                            <span className="font-mono text-xs">
                              {truncateHash(log.hash)}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4" />
                            <span>{log.ipAddress}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Lock className="w-4 h-4" />
                            <span className="text-xs">
                              {log.previousHash ? 'Chained' : 'Genesis'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {Object.keys(log.details).length > 0 && (
                        <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                          <h5 className="text-xs font-medium text-gray-700 mb-2">Details:</h5>
                          <div className="text-xs text-gray-600">
                            {Object.entries(log.details).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="font-medium">{key}:</span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* No Results */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No audit logs found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button
            onClick={() => {
              setSearchTerm('')
              setSelectedStatus('')
              setSelectedSeverity('')
              setSelectedDateRange('7d')
              setSelectedUser('')
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
