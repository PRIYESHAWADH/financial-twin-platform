'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Database, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Download,
  Eye,
  Trash2,
  Plus,
  Info,
  Shield,
  Brain
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

interface DataIngestion {
  id: string;
  source: string;
  dataType: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  metadata: any;
  createdAt: string;
  processedAt?: string;
  errorMessage?: string;
}

interface FinancialData {
  id: string;
  dataType: string;
  source: string;
  recordsCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function DataIngestionPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [ingestions, setIngestions] = useState<DataIngestion[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    loadData();
  }, [isAuthenticated, router]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Mock data for demonstration
      const mockIngestions: DataIngestion[] = [
        {
          id: 'ingestion_001',
          source: 'ACCOUNT_AGGREGATOR',
          dataType: 'BANK_STATEMENT',
          status: 'COMPLETED',
          metadata: {
            accounts: 2,
            transactions: 150,
            dateRange: '2024-01-01 to 2024-01-31'
          },
          createdAt: '2024-01-15T10:30:00Z',
          processedAt: '2024-01-15T10:35:00Z'
        },
        {
          id: 'ingestion_002',
          source: 'FILE_UPLOAD',
          dataType: 'INVESTMENT_DATA',
          status: 'PROCESSING',
          metadata: {
            fileName: 'mutual_funds.csv',
            fileSize: '2.5 MB',
            records: 45
          },
          createdAt: '2024-01-15T11:00:00Z'
        },
        {
          id: 'ingestion_003',
          source: 'API_INTEGRATION',
          dataType: 'TAX_DATA',
          status: 'FAILED',
          metadata: {
            apiType: 'ITD_API',
            error: 'Authentication failed'
          },
          createdAt: '2024-01-15T11:15:00Z',
          processedAt: '2024-01-15T11:16:00Z',
          errorMessage: 'Failed to authenticate with ITD API'
        }
      ];

      const mockFinancialData: FinancialData[] = [
        {
          id: 'fd_001',
          dataType: 'BANK_STATEMENT',
          source: 'ACCOUNT_AGGREGATOR',
          recordsCount: 150,
          createdAt: '2024-01-15T10:35:00Z',
          updatedAt: '2024-01-15T10:35:00Z'
        },
        {
          id: 'fd_002',
          dataType: 'INVESTMENT_DATA',
          source: 'FILE_UPLOAD',
          recordsCount: 45,
          createdAt: '2024-01-15T11:00:00Z',
          updatedAt: '2024-01-15T11:00:00Z'
        }
      ];

      setIngestions(mockIngestions);
      setFinancialData(mockFinancialData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Mock file upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create new ingestion record
      const newIngestion: DataIngestion = {
        id: `ingestion_${Date.now()}`,
        source: 'FILE_UPLOAD',
        dataType: 'BANK_STATEMENT',
        status: 'PENDING',
        metadata: {
          fileName: file.name,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          fileType: file.type
        },
        createdAt: new Date().toISOString()
      };

      setIngestions(prev => [newIngestion, ...prev]);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAccountAggregatorConnect = async () => {
    try {
      // Mock AA connection
      toast.info('Redirecting to Account Aggregator...');
      
      // Simulate AA flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newIngestion: DataIngestion = {
        id: `ingestion_${Date.now()}`,
        source: 'ACCOUNT_AGGREGATOR',
        dataType: 'BANK_STATEMENT',
        status: 'COMPLETED',
        metadata: {
          accounts: 3,
          transactions: 200,
          dateRange: '2024-01-01 to 2024-01-31'
        },
        createdAt: new Date().toISOString(),
        processedAt: new Date().toISOString()
      };

      setIngestions(prev => [newIngestion, ...prev]);
      toast.success('Account Aggregator data imported successfully');
    } catch (error) {
      toast.error('Failed to connect to Account Aggregator');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PROCESSING':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'ACCOUNT_AGGREGATOR':
        return <Database className="h-4 w-4" />;
      case 'FILE_UPLOAD':
        return <Upload className="h-4 w-4" />;
      case 'API_INTEGRATION':
        return <Brain className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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
              <Database className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Data Ingestion</h1>
                <p className="text-sm text-gray-500">Import and process your financial data</p>
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
              <CardTitle className="text-sm font-medium">Total Ingestions</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ingestions.length}</div>
              <p className="text-xs text-muted-foreground">
                All data imports
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {ingestions.filter(i => i.status === 'COMPLETED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Completed successfully
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {ingestions.filter(i => i.status === 'PROCESSING').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently processing
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financialData.reduce((sum, fd) => sum + fd.recordsCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total records processed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Ingestion Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="import">Import Data</TabsTrigger>
            <TabsTrigger value="ingestions">Ingestions</TabsTrigger>
            <TabsTrigger value="data">Financial Data</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Ingestion Overview</CardTitle>
                <CardDescription>
                  Summary of your financial data imports and processing status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Data Privacy:</strong> All your financial data is processed securely and stored in compliance with the DPDP Act, 2023. 
                      You can revoke data access permissions at any time through the Consent Manager.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Data Sources</h3>
                      <div className="space-y-2">
                        {Array.from(new Set(ingestions.map(i => i.source))).map(source => (
                          <div key={source} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              {getSourceIcon(source)}
                              <span className="text-sm font-medium">{source.replace('_', ' ')}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {ingestions.filter(i => i.source === source).length} imports
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Data Types</h3>
                      <div className="space-y-2">
                        {Array.from(new Set(ingestions.map(i => i.dataType))).map(dataType => (
                          <div key={dataType} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">{dataType.replace('_', ' ')}</span>
                            <Badge variant="outline" className="text-xs">
                              {ingestions.filter(i => i.dataType === dataType).length} imports
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Import Data Tab */}
          <TabsContent value="import" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Upload Files</span>
                  </CardTitle>
                  <CardDescription>
                    Upload bank statements, investment reports, or other financial documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-4">
                        Drag and drop files here, or click to select
                      </p>
                      <input
                        type="file"
                        accept=".csv,.pdf,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        disabled={isUploading}
                      />
                      <label htmlFor="file-upload">
                        <Button asChild disabled={isUploading}>
                          <span>Choose Files</span>
                        </Button>
                      </label>
                    </div>

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      <p>Supported formats: CSV, PDF, Excel</p>
                      <p>Maximum file size: 10 MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Aggregator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Account Aggregator</span>
                  </CardTitle>
                  <CardDescription>
                    Connect your bank accounts securely through the Account Aggregator framework
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Secure & Compliant</span>
                      </div>
                      <p className="text-xs text-blue-700">
                        Your data is accessed through RBI-licensed Account Aggregators with your explicit consent.
                      </p>
                    </div>

                    <Button 
                      onClick={handleAccountAggregatorConnect}
                      className="w-full"
                      disabled={isUploading}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Connect Bank Accounts
                    </Button>

                    <div className="text-xs text-gray-500">
                      <p>• Real-time data access</p>
                      <p>• No password sharing</p>
                      <p>• Revocable consent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>API Integrations</span>
                </CardTitle>
                <CardDescription>
                  Connect to external services and government portals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Income Tax Department</h4>
                    <p className="text-sm text-gray-600 mb-3">Import tax returns and Form 16</p>
                    <Button size="sm" variant="outline" disabled>
                      Connect ITD API
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">GST Network</h4>
                    <p className="text-sm text-gray-600 mb-3">Import GST returns and invoices</p>
                    <Button size="sm" variant="outline" disabled>
                      Connect GSTN API
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Investment Platforms</h4>
                    <p className="text-sm text-gray-600 mb-3">Import mutual fund and stock data</p>
                    <Button size="sm" variant="outline" disabled>
                      Connect APIs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ingestions Tab */}
          <TabsContent value="ingestions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Data Ingestions</h2>
              <Button onClick={loadData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="space-y-4">
              {ingestions.map(ingestion => (
                <Card key={ingestion.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(ingestion.status)}
                        <div>
                          <CardTitle className="text-lg">
                            {ingestion.dataType.replace('_', ' ')} Import
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Source: {ingestion.source.replace('_', ' ')} • 
                            Created: {new Date(ingestion.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(ingestion.status)}>
                          {ingestion.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ingestion.status === 'FAILED' && ingestion.errorMessage && (
                        <Alert variant="destructive">
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>{ingestion.errorMessage}</AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {Object.entries(ingestion.metadata).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span>
                            <p className="text-gray-600">{String(value)}</p>
                          </div>
                        ))}
                      </div>

                      {ingestion.processedAt && (
                        <div className="text-sm text-gray-500">
                          Processed: {new Date(ingestion.processedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {ingestions.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Ingestions</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't imported any financial data yet.
                    </p>
                    <Button onClick={() => setActiveTab('import')}>
                      Import Data
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Financial Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <h2 className="text-xl font-semibold">Financial Data</h2>

            <div className="space-y-4">
              {financialData.map(data => (
                <Card key={data.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {data.dataType.replace('_', ' ')}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Source: {data.source.replace('_', ' ')} • 
                          {data.recordsCount} records
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Created:</span>
                        <p className="text-gray-600">
                          {new Date(data.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>
                        <p className="text-gray-600">
                          {new Date(data.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
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
