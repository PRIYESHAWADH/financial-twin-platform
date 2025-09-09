'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  Info
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

interface Consent {
  id: string;
  consentType: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  purpose: string;
  dataTypes: Array<{
    code: string;
    description: string;
    sensitivity: string;
    category: string;
  }>;
  dataFiduciaries: Array<{
    fid: string;
    name: string;
    logo: string;
    contact: string;
  }>;
  grantedAt: string;
  expiresAt: string;
  revokedAt?: string;
  dataRetentionPeriod: number;
}

export default function ConsentManagerPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [consents, setConsents] = useState<Consent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    loadConsents();
  }, [isAuthenticated, router]);

  const loadConsents = async () => {
    try {
      setIsLoading(true);
      // Mock data for demonstration
      const mockConsents: Consent[] = [
        {
          id: 'consent_001',
          consentType: 'ACCOUNT_AGGREGATOR',
          status: 'ACTIVE',
          purpose: 'FINANCIAL_ANALYSIS',
          dataTypes: [
            {
              code: 'BANK_STATEMENT',
              description: 'Bank account statements and transaction history',
              sensitivity: 'HIGH',
              category: 'FINANCIAL'
            },
            {
              code: 'CREDIT_CARD',
              description: 'Credit card statements and transaction history',
              sensitivity: 'HIGH',
              category: 'FINANCIAL'
            }
          ],
          dataFiduciaries: [
            {
              fid: 'hdfc-bank',
              name: 'HDFC Bank',
              logo: 'https://example.com/hdfc-logo.png',
              contact: 'support@hdfcbank.com'
            }
          ],
          grantedAt: '2024-01-15T10:30:00Z',
          expiresAt: '2025-01-15T10:30:00Z',
          dataRetentionPeriod: 1
        },
        {
          id: 'consent_002',
          consentType: 'DATA_PROCESSING',
          status: 'ACTIVE',
          purpose: 'TAX_FILING',
          dataTypes: [
            {
              code: 'INVESTMENT_DATA',
              description: 'Mutual fund and stock investment data',
              sensitivity: 'MEDIUM',
              category: 'INVESTMENT'
            }
          ],
          dataFiduciaries: [
            {
              fid: 'zerodha',
              name: 'Zerodha',
              logo: 'https://example.com/zerodha-logo.png',
              contact: 'support@zerodha.com'
            }
          ],
          grantedAt: '2024-01-10T14:20:00Z',
          expiresAt: '2024-12-31T23:59:59Z',
          dataRetentionPeriod: 1
        }
      ];
      setConsents(mockConsents);
    } catch (error) {
      toast.error('Failed to load consents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeConsent = async (consentId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConsents(prev => 
        prev.map(consent => 
          consent.id === consentId 
            ? { ...consent, status: 'REVOKED' as const, revokedAt: new Date().toISOString() }
            : consent
        )
      );
      
      toast.success('Consent revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke consent');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REVOKED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'EXPIRED':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'REVOKED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPurposeText = (purpose: string) => {
    const purposeTexts = {
      'FINANCIAL_ANALYSIS': 'Financial Analysis & Insights',
      'TAX_FILING': 'Tax Return Preparation',
      'INVESTMENT_ADVICE': 'Investment Recommendations',
      'CREDIT_ASSESSMENT': 'Credit Assessment',
      'FRAUD_DETECTION': 'Fraud Detection',
      'COMPLIANCE': 'Regulatory Compliance'
    };
    return purposeTexts[purpose as keyof typeof purposeTexts] || purpose;
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Consent Manager</h1>
                <p className="text-sm text-gray-500">Manage your data sharing permissions</p>
              </div>
            </div>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consents</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{consents.length}</div>
              <p className="text-xs text-muted-foreground">
                All consent records
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Consents</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {consents.filter(c => c.status === 'ACTIVE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revoked Consents</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {consents.filter(c => c.status === 'REVOKED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Previously revoked
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Fiduciaries</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(consents.flatMap(c => c.dataFiduciaries.map(df => df.fid))).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Unique organizations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Consent Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="active">Active Consents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Consent Overview</CardTitle>
                <CardDescription>
                  Summary of your data sharing permissions and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Your Privacy Rights:</strong> You have the right to access, correct, and delete your personal data. 
                      You can revoke any consent at any time. All data processing is done in compliance with the DPDP Act, 2023.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Data Types Shared</h3>
                      <div className="space-y-2">
                        {Array.from(new Set(consents.flatMap(c => c.dataTypes.map(dt => dt.code)))).map(dataType => (
                          <div key={dataType} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">{dataType}</span>
                            <Badge variant="outline" className="text-xs">
                              {consents.filter(c => c.dataTypes.some(dt => dt.code === dataType)).length} consents
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Organizations with Access</h3>
                      <div className="space-y-2">
                        {Array.from(new Set(consents.flatMap(c => c.dataFiduciaries.map(df => df.fid)))).map(fid => {
                          const fiduciary = consents.flatMap(c => c.dataFiduciaries).find(df => df.fid === fid);
                          return (
                            <div key={fid} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm font-medium">{fiduciary?.name || fid}</span>
                              <Badge variant="outline" className="text-xs">
                                {consents.filter(c => c.dataFiduciaries.some(df => df.fid === fid)).length} consents
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Consents Tab */}
          <TabsContent value="active" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Active Consents</h2>
              <Button onClick={loadConsents} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="space-y-4">
              {consents.filter(c => c.status === 'ACTIVE').map(consent => (
                <Card key={consent.id} className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(consent.status)}
                        <div>
                          <CardTitle className="text-lg">{getPurposeText(consent.purpose)}</CardTitle>
                          <CardDescription className="mt-1">
                            Consent Type: {consent.consentType}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(consent.status)}>
                          {consent.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeConsent(consent.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Data Types</h4>
                        <div className="flex flex-wrap gap-2">
                          {consent.dataTypes.map((dataType, index) => (
                            <Badge key={index} className={getSensitivityColor(dataType.sensitivity)}>
                              {dataType.code}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Data Fiduciaries</h4>
                        <div className="space-y-2">
                          {consent.dataFiduciaries.map((fiduciary, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">
                                  {fiduciary.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{fiduciary.name}</p>
                                <p className="text-xs text-gray-500">{fiduciary.contact}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Granted:</span>
                          <p className="text-gray-600">
                            {new Date(consent.grantedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Expires:</span>
                          <p className="text-gray-600">
                            {new Date(consent.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {consents.filter(c => c.status === 'ACTIVE').length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Consents</h3>
                    <p className="text-gray-500 mb-4">
                      You don't have any active data sharing consents at the moment.
                    </p>
                    <Button onClick={() => router.push('/dashboard')}>
                      Go to Dashboard
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-xl font-semibold">Consent History</h2>

            <div className="space-y-4">
              {consents.map(consent => (
                <Card key={consent.id} className="border-l-4 border-l-gray-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(consent.status)}
                        <div>
                          <CardTitle className="text-lg">{getPurposeText(consent.purpose)}</CardTitle>
                          <CardDescription className="mt-1">
                            {consent.consentType} • {consent.dataTypes.length} data types
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(consent.status)}>
                        {consent.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Granted:</span>
                        <p className="text-gray-600">
                          {new Date(consent.grantedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Expires:</span>
                        <p className="text-gray-600">
                          {new Date(consent.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                      {consent.revokedAt && (
                        <div>
                          <span className="font-medium">Revoked:</span>
                          <p className="text-gray-600">
                            {new Date(consent.revokedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
