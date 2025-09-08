# FinTwin API Documentation
## Complete API Reference for Developers

---

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [Error Handling](#error-handling)
5. [Endpoints](#endpoints)
6. [SDKs](#sdks)
7. [Webhooks](#webhooks)
8. [Examples](#examples)

---

## Overview

The FinTwin API provides programmatic access to our AI Financial Twin and CA Marketplace services. Our API is RESTful, uses JSON for data exchange, and follows standard HTTP status codes.

### Base URLs
- **Production**: `https://api.fintwin.in/v1`
- **Staging**: `https://api-staging.fintwin.in/v1`
- **Development**: `https://api-dev.fintwin.in/v1`

### API Versioning
- **Current Version**: v1
- **Version Header**: `Accept: application/vnd.fintwin.v1+json`
- **Deprecation Policy**: 6 months notice for breaking changes

---

## Authentication

### API Keys
All API requests require authentication using API keys.

#### Getting API Keys
1. Sign up for a FinTwin developer account
2. Navigate to the API section in your dashboard
3. Generate API keys for your application
4. Keep your keys secure and never expose them in client-side code

#### Using API Keys
Include your API key in the `Authorization` header:

```http
Authorization: Bearer your_api_key_here
```

#### Key Types
- **Sandbox Keys**: For testing and development
- **Production Keys**: For live applications
- **Webhook Keys**: For webhook authentication

### OAuth 2.0
For user-specific data access, use OAuth 2.0 flow.

#### Authorization Flow
1. **Authorization Request**
   ```
   GET /oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=read write
   ```

2. **Token Exchange**
   ```http
   POST /oauth/token
   Content-Type: application/x-www-form-urlencoded
   
   grant_type=authorization_code&code=AUTHORIZATION_CODE&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&redirect_uri=YOUR_REDIRECT_URI
   ```

3. **Access Token Usage**
   ```http
   Authorization: Bearer access_token_here
   ```

---

## Rate Limiting

### Limits
- **Free Tier**: 1,000 requests per hour
- **Basic Tier**: 10,000 requests per hour
- **Professional Tier**: 100,000 requests per hour
- **Enterprise Tier**: Custom limits

### Headers
Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Exceeding Limits
When rate limits are exceeded, the API returns a 429 status code:

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Try again later.",
    "retry_after": 3600
  }
}
```

---

## Error Handling

### Error Response Format
All errors follow a consistent format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details"
    },
    "request_id": "req_123456789"
  }
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **422**: Unprocessable Entity
- **429**: Rate Limit Exceeded
- **500**: Internal Server Error

### Common Error Codes
- `invalid_request`: Invalid request parameters
- `unauthorized`: Invalid or missing authentication
- `forbidden`: Insufficient permissions
- `not_found`: Resource not found
- `validation_error`: Input validation failed
- `rate_limit_exceeded`: Rate limit exceeded
- `internal_error`: Internal server error

---

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe",
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+919876543210",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": "jwt_token_here"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

#### Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

### User Management

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer jwt_token
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+919876543210",
  "preferences": {
    "language": "en",
    "notifications": true
  }
}
```

### Financial Data

#### Get Financial Summary
```http
GET /financial/summary
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "total_income": 1250000,
  "total_expenses": 875000,
  "net_worth": 375000,
  "monthly_income": 85000,
  "monthly_expenses": 65000,
  "savings_rate": 23.5,
  "financial_health_score": 85
}
```

#### Get Transactions
```http
GET /financial/transactions?limit=50&offset=0&category=food
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "transactions": [
    {
      "id": "txn_123",
      "date": "2024-01-15",
      "description": "Grocery Store",
      "amount": 1500.00,
      "type": "debit",
      "category": "Food & Dining",
      "account": "HDFC Savings"
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

#### Categorize Transaction
```http
POST /financial/transactions/categorize
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "transactions": [
    {
      "date": "2024-01-15",
      "description": "Grocery Store",
      "amount": 1500.00,
      "type": "debit"
    }
  ]
}
```

### AI Insights

#### Get AI Insights
```http
GET /ai/insights
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "insights": [
    {
      "type": "warning",
      "title": "High Food Expenses",
      "description": "Your food expenses are 15% higher than last month.",
      "action": "View Tips",
      "confidence": 0.95
    }
  ],
  "recommendations": [
    {
      "category": "savings",
      "title": "Emergency Fund",
      "description": "Build an emergency fund of 6 months expenses.",
      "priority": "high",
      "estimated_savings": 50000
    }
  ]
}
```

#### Get Cashflow Prediction
```http
GET /ai/cashflow-prediction?months=6
Authorization: Bearer jwt_token
```

#### Get Tax Optimization
```http
GET /ai/tax-optimization
Authorization: Bearer jwt_token
```

### CA Marketplace

#### Search CAs
```http
GET /ca/search?specialization=tax&location=mumbai&limit=20
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "cas": [
    {
      "id": "ca_123",
      "name": "Dr. Priya Sharma",
      "email": "priya.sharma@example.com",
      "phone": "+919876543210",
      "location": "Mumbai",
      "specialization": ["Tax Planning", "GST Compliance"],
      "experience": 12,
      "rating": 4.9,
      "review_count": 156,
      "hourly_rate": 2500,
      "is_verified": true,
      "is_available": true
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

#### Get CA Profile
```http
GET /ca/profile/ca_123
Authorization: Bearer jwt_token
```

#### Book Consultation
```http
POST /ca/consultation/book
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "ca_id": "ca_123",
  "service_type": "tax_planning",
  "preferred_date": "2024-01-20",
  "preferred_time": "10:00",
  "consultation_type": "online",
  "description": "Need help with tax planning for FY 2023-24"
}
```

### Document Management

#### Upload Document
```http
POST /documents/upload
Authorization: Bearer jwt_token
Content-Type: multipart/form-data

file: [binary file data]
document_type: "bank_statement"
```

**Response:**
```json
{
  "document_id": "doc_123",
  "filename": "bank_statement.pdf",
  "size": 2048576,
  "type": "bank_statement",
  "status": "processing",
  "uploaded_at": "2024-01-15T10:30:00Z"
}
```

#### Get Documents
```http
GET /documents?type=bank_statement&limit=20
Authorization: Bearer jwt_token
```

#### Delete Document
```http
DELETE /documents/doc_123
Authorization: Bearer jwt_token
```

### Consent Management

#### Record Consent
```http
POST /consent/record
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "purpose": "financial_analysis",
  "data_types": ["transactions", "bank_statements"],
  "duration": "1_year",
  "consent_given": true
}
```

#### Get Consent Status
```http
GET /consent/status
Authorization: Bearer jwt_token
```

#### Revoke Consent
```http
POST /consent/revoke
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "consent_id": "consent_123"
}
```

### Audit Trail

#### Get Audit Logs
```http
GET /audit/logs?limit=50&offset=0&action=LOGIN
Authorization: Bearer jwt_token
```

**Response:**
```json
{
  "logs": [
    {
      "id": "audit_123",
      "timestamp": "2024-01-15T10:30:00Z",
      "user_id": "user_123",
      "action": "LOGIN",
      "resource_type": "user",
      "resource_id": "user_123",
      "details": {
        "method": "email",
        "device": "Chrome/Windows"
      },
      "ip_address": "192.168.1.100",
      "status": "success",
      "hash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
    }
  ],
  "total": 1250,
  "limit": 50,
  "offset": 0
}
```

#### Verify Audit Trail
```http
POST /audit/verify
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

---

## SDKs

### JavaScript/Node.js
```bash
npm install @fintwin/api-client
```

```javascript
const FinTwinAPI = require('@fintwin/api-client');

const client = new FinTwinAPI({
  apiKey: 'your_api_key',
  environment: 'production' // or 'staging'
});

// Get financial summary
const summary = await client.financial.getSummary();

// Search CAs
const cas = await client.ca.search({
  specialization: 'tax',
  location: 'mumbai'
});
```

### Python
```bash
pip install fintwin-api
```

```python
from fintwin import FinTwinAPI

client = FinTwinAPI(
    api_key='your_api_key',
    environment='production'
)

# Get financial summary
summary = client.financial.get_summary()

# Search CAs
cas = client.ca.search(
    specialization='tax',
    location='mumbai'
)
```

### PHP
```bash
composer require fintwin/api-client
```

```php
use FinTwin\API\Client;

$client = new Client([
    'api_key' => 'your_api_key',
    'environment' => 'production'
]);

// Get financial summary
$summary = $client->financial->getSummary();

// Search CAs
$cas = $client->ca->search([
    'specialization' => 'tax',
    'location' => 'mumbai'
]);
```

---

## Webhooks

### Setting Up Webhooks
Webhooks allow you to receive real-time notifications about events in your FinTwin account.

#### Create Webhook
```http
POST /webhooks
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/fintwin",
  "events": ["transaction.created", "ca.consultation.booked"],
  "secret": "your_webhook_secret"
}
```

#### Webhook Events
- `transaction.created`: New transaction added
- `transaction.updated`: Transaction updated
- `ca.consultation.booked`: CA consultation booked
- `ca.consultation.completed`: CA consultation completed
- `document.uploaded`: Document uploaded
- `document.processed`: Document processing completed
- `consent.recorded`: Consent recorded
- `consent.revoked`: Consent revoked

#### Webhook Payload
```json
{
  "id": "evt_123",
  "type": "transaction.created",
  "created": "2024-01-15T10:30:00Z",
  "data": {
    "object": {
      "id": "txn_123",
      "date": "2024-01-15",
      "description": "Grocery Store",
      "amount": 1500.00,
      "type": "debit",
      "category": "Food & Dining"
    }
  }
}
```

#### Webhook Security
Webhooks include a signature header for verification:

```http
X-Fintwin-Signature: t=1640995200,v1=signature_here
```

---

## Examples

### Complete Integration Example

#### 1. User Registration and Authentication
```javascript
// Register user
const user = await client.auth.register({
  email: 'user@example.com',
  password: 'secure_password',
  name: 'John Doe',
  phone: '+919876543210'
});

// Login user
const auth = await client.auth.login({
  email: 'user@example.com',
  password: 'secure_password'
});

// Set authentication token
client.setAuthToken(auth.token);
```

#### 2. Financial Data Management
```javascript
// Upload bank statement
const document = await client.documents.upload({
  file: bankStatementFile,
  document_type: 'bank_statement'
});

// Get financial summary
const summary = await client.financial.getSummary();

// Get transactions
const transactions = await client.financial.getTransactions({
  limit: 50,
  category: 'food'
});
```

#### 3. AI Insights and Recommendations
```javascript
// Get AI insights
const insights = await client.ai.getInsights();

// Get cashflow prediction
const prediction = await client.ai.getCashflowPrediction({
  months: 6
});

// Get tax optimization suggestions
const taxOptimization = await client.ai.getTaxOptimization();
```

#### 4. CA Marketplace Integration
```javascript
// Search for CAs
const cas = await client.ca.search({
  specialization: 'tax',
  location: 'mumbai',
  limit: 10
});

// Book consultation
const consultation = await client.ca.bookConsultation({
  ca_id: 'ca_123',
  service_type: 'tax_planning',
  preferred_date: '2024-01-20',
  preferred_time: '10:00',
  consultation_type: 'online'
});
```

#### 5. Webhook Handling
```javascript
// Express.js webhook handler
app.post('/webhooks/fintwin', (req, res) => {
  const signature = req.headers['x-fintwin-signature'];
  const payload = req.body;
  
  // Verify webhook signature
  if (!client.webhooks.verifySignature(payload, signature)) {
    return res.status(400).send('Invalid signature');
  }
  
  // Handle webhook event
  switch (payload.type) {
    case 'transaction.created':
      handleNewTransaction(payload.data.object);
      break;
    case 'ca.consultation.booked':
      handleConsultationBooked(payload.data.object);
      break;
  }
  
  res.status(200).send('OK');
});
```

---

## Support

### Developer Resources
- **API Documentation**: [https://docs.fintwin.in](https://docs.fintwin.in)
- **SDK Downloads**: [https://github.com/fintwin/sdks](https://github.com/fintwin/sdks)
- **Code Examples**: [https://github.com/fintwin/examples](https://github.com/fintwin/examples)
- **Developer Forum**: [https://community.fintwin.in](https://community.fintwin.in)

### Support Channels
- **Email**: developers@fintwin.in
- **Slack**: [https://fintwin.slack.com](https://fintwin.slack.com)
- **GitHub Issues**: [https://github.com/fintwin/api/issues](https://github.com/fintwin/api/issues)

### API Status
- **Status Page**: [https://status.fintwin.in](https://status.fintwin.in)
- **Uptime**: 99.9% SLA
- **Response Time**: < 200ms average

---

*This API documentation is regularly updated. Last updated: January 2024*
