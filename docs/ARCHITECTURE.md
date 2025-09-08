# FinTwin Architecture Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Component Architecture](#component-architecture)
4. [Data Architecture](#data-architecture)
5. [AI/ML Architecture](#aiml-architecture)
6. [Security Architecture](#security-architecture)
7. [Deployment Architecture](#deployment-architecture)
8. [Monitoring & Observability](#monitoring--observability)
9. [Scalability Considerations](#scalability-considerations)
10. [Technology Decisions](#technology-decisions)

## System Overview

FinTwin is a comprehensive AI Financial Twin + CA Ecosystem platform built with a microservices architecture, designed to handle India's complex financial landscape while maintaining the highest standards of security, privacy, and compliance.

### High-Level Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        WA[Web App]
        MA[Mobile Apps]
        VI[Voice Interface]
        CP[CA Portal]
    end
    
    subgraph "API Gateway Layer"
        AG[API Gateway]
        AUTH[Authentication]
        RL[Rate Limiting]
        LB[Load Balancing]
    end
    
    subgraph "Application Layer"
        US[User Service]
        AS[AI Service]
        CS[CA Service]
        COMP[Compliance Service]
    end
    
    subgraph "AI/ML Layer"
        LLM[LLM Engine]
        RE[Rules Engine]
        KG[Knowledge Graph]
        MODELS[ML Models]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL)]
        REDIS[(Redis)]
        VECTOR[(Vector DB)]
        S3[(Object Storage)]
    end
    
    subgraph "External Integrations"
        AA[Account Aggregator]
        GOV[Government APIs]
        BANK[Banking APIs]
        ICAI[ICAI APIs]
    end
    
    WA --> AG
    MA --> AG
    VI --> AG
    CP --> AG
    
    AG --> AUTH
    AG --> RL
    AG --> LB
    
    AUTH --> US
    AUTH --> AS
    AUTH --> CS
    AUTH --> COMP
    
    AS --> LLM
    AS --> RE
    AS --> KG
    AS --> MODELS
    
    US --> PG
    AS --> PG
    CS --> PG
    COMP --> PG
    
    AS --> VECTOR
    AS --> REDIS
    
    COMP --> S3
    
    AS --> AA
    COMP --> GOV
    CS --> ICAI
    US --> BANK
```

## Architecture Principles

### 1. Privacy-by-Design
- **Data Minimization**: Collect only necessary data
- **Consent Management**: Granular consent with easy revocation
- **Data Residency**: All sensitive data stored within India
- **Encryption**: End-to-end encryption for all data

### 2. India-First Approach
- **Regulatory Compliance**: DPDP Act, RBI, SEBI, GST compliance
- **Localization**: Hindi and regional language support
- **Government Integration**: Direct APIs with ITD, GSTN
- **CA Ecosystem**: Deep integration with ICAI

### 3. Scalability & Performance
- **Microservices**: Independent, scalable services
- **Horizontal Scaling**: Auto-scaling based on demand
- **Caching**: Multi-level caching strategy
- **CDN**: Global content delivery

### 4. Security & Compliance
- **Defense-in-Depth**: Multiple security layers
- **Audit Trail**: Immutable logs with hash chaining
- **Access Control**: Role-based access control
- **Threat Monitoring**: Real-time security monitoring

## Component Architecture

### Frontend Architecture

```mermaid
graph TB
    subgraph "Next.js App Router"
        PAGES[Pages]
        LAYOUTS[Layouts]
        COMPONENTS[Components]
        HOOKS[Custom Hooks]
    end
    
    subgraph "State Management"
        ZUSTAND[Zustand Store]
        RQ[React Query]
        CONTEXT[React Context]
    end
    
    subgraph "UI Framework"
        TAILWIND[Tailwind CSS]
        SHADCN[shadcn/ui]
        ICONS[Lucide Icons]
    end
    
    subgraph "Authentication"
        AUTH_PROVIDER[Auth Provider]
        PROTECTED_ROUTES[Protected Routes]
        ROLE_BASED[Role-based Access]
    end
    
    PAGES --> LAYOUTS
    LAYOUTS --> COMPONENTS
    COMPONENTS --> HOOKS
    
    HOOKS --> ZUSTAND
    HOOKS --> RQ
    HOOKS --> CONTEXT
    
    COMPONENTS --> TAILWIND
    COMPONENTS --> SHADCN
    COMPONENTS --> ICONS
    
    PAGES --> AUTH_PROVIDER
    AUTH_PROVIDER --> PROTECTED_ROUTES
    PROTECTED_ROUTES --> ROLE_BASED
```

### Backend Architecture

```mermaid
graph TB
    subgraph "NestJS Application"
        MAIN[main.ts]
        APP[App Module]
        MODULES[Feature Modules]
        GUARDS[Guards]
        INTERCEPTORS[Interceptors]
    end
    
    subgraph "Core Modules"
        AUTH_MODULE[Auth Module]
        USER_MODULE[User Module]
        AI_MODULE[AI Module]
        CA_MODULE[CA Module]
        CONSENT_MODULE[Consent Module]
        AUDIT_MODULE[Audit Module]
    end
    
    subgraph "Shared Services"
        DB_SERVICE[Database Service]
        CACHE_SERVICE[Cache Service]
        EMAIL_SERVICE[Email Service]
        SMS_SERVICE[SMS Service]
    end
    
    MAIN --> APP
    APP --> MODULES
    MODULES --> GUARDS
    MODULES --> INTERCEPTORS
    
    MODULES --> AUTH_MODULE
    MODULES --> USER_MODULE
    MODULES --> AI_MODULE
    MODULES --> CA_MODULE
    MODULES --> CONSENT_MODULE
    MODULES --> AUDIT_MODULE
    
    AUTH_MODULE --> DB_SERVICE
    USER_MODULE --> DB_SERVICE
    AI_MODULE --> CACHE_SERVICE
    CA_MODULE --> EMAIL_SERVICE
    CONSENT_MODULE --> SMS_SERVICE
```

## Data Architecture

### Database Design

```mermaid
erDiagram
    USER ||--o{ USER_PROFILE : has
    USER ||--o{ CONSENT : gives
    USER ||--o{ AUDIT_LOG : generates
    USER ||--o{ FINANCIAL_DATA : owns
    
    CA ||--o{ CA_PROFILE : has
    CA ||--o{ CA_SERVICES : offers
    CA ||--o{ CLIENT_RELATIONSHIP : manages
    CA ||--o{ AUDIT_LOG : generates
    
    FINANCIAL_DATA ||--o{ TRANSACTION : contains
    FINANCIAL_DATA ||--o{ ACCOUNT : contains
    FINANCIAL_DATA ||--o{ INVESTMENT : contains
    
    AI_INSIGHT ||--o{ AI_CITATION : references
    AI_INSIGHT ||--o{ AI_RECOMMENDATION : generates
    
    USER {
        uuid id PK
        string email UK
        string phone UK
        string pan UK
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }
    
    USER_PROFILE {
        uuid id PK
        uuid user_id FK
        string first_name
        string last_name
        date date_of_birth
        string address
        string city
        string state
        string pincode
        timestamp created_at
        timestamp updated_at
    }
    
    CONSENT {
        uuid id PK
        uuid user_id FK
        string consent_type
        json consent_artefact
        string status
        timestamp granted_at
        timestamp revoked_at
        timestamp expires_at
    }
    
    FINANCIAL_DATA {
        uuid id PK
        uuid user_id FK
        string data_type
        json raw_data
        json processed_data
        string source
        timestamp created_at
        timestamp updated_at
    }
    
    CA {
        uuid id PK
        string icai_member_id UK
        string email UK
        string phone UK
        string pan UK
        boolean is_verified
        timestamp created_at
        timestamp updated_at
    }
    
    AI_INSIGHT {
        uuid id PK
        uuid user_id FK
        string insight_type
        json insight_data
        json citations
        float confidence_score
        timestamp generated_at
    }
```

### Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant V as Vector DB
    participant AI as AI Service
    participant AA as Account Aggregator
    
    U->>F: Login
    F->>B: Authenticate
    B->>DB: Verify credentials
    DB-->>B: User data
    B-->>F: JWT token
    
    U->>F: Grant consent
    F->>B: Create consent
    B->>DB: Store consent
    B->>AA: Initiate data fetch
    AA-->>B: Financial data
    B->>DB: Store financial data
    B->>V: Index embeddings
    B->>AI: Generate insights
    AI-->>B: AI insights
    B->>DB: Store insights
    B-->>F: Updated dashboard
    F-->>U: Financial Twin view
```

## AI/ML Architecture

### RAG Pipeline Architecture

```mermaid
graph TB
    subgraph "Document Ingestion"
        PDF[PDF Documents]
        TXT[Text Files]
        API[API Data]
    end
    
    subgraph "Processing Pipeline"
        EXTRACT[Text Extraction]
        CHUNK[Text Chunking]
        EMBED[Embedding Generation]
        STORE[Vector Storage]
    end
    
    subgraph "Retrieval Pipeline"
        QUERY[User Query]
        SEARCH[Vector Search]
        RANK[Relevance Ranking]
        CONTEXT[Context Assembly]
    end
    
    subgraph "Generation Pipeline"
        LLM[LLM Engine]
        PROMPT[Prompt Template]
        RESPONSE[Response Generation]
        CITATION[Citation Extraction]
    end
    
    PDF --> EXTRACT
    TXT --> EXTRACT
    API --> EXTRACT
    
    EXTRACT --> CHUNK
    CHUNK --> EMBED
    EMBED --> STORE
    
    QUERY --> SEARCH
    SEARCH --> STORE
    SEARCH --> RANK
    RANK --> CONTEXT
    
    CONTEXT --> PROMPT
    PROMPT --> LLM
    LLM --> RESPONSE
    RESPONSE --> CITATION
```

### ML Model Architecture

```mermaid
graph TB
    subgraph "Transaction Categorization"
        INPUT[Transaction Data]
        FEATURES[Feature Engineering]
        RULES[Rule Engine]
        ML[ML Classifier]
        OUTPUT[Category + Confidence]
    end
    
    subgraph "Cash Flow Prediction"
        HIST[Historical Data]
        FEATURES2[Feature Engineering]
        LSTM[LSTM Model]
        ATTENTION[Attention Mechanism]
        PRED[Prediction]
    end
    
    subgraph "Tax Optimization"
        PROFILE[User Profile]
        INCOME[Income Data]
        DEDUCTIONS[Deduction Rules]
        OPTIMIZER[Optimization Engine]
        RECOMMENDATIONS[Recommendations]
    end
    
    INPUT --> FEATURES
    FEATURES --> RULES
    FEATURES --> ML
    RULES --> OUTPUT
    ML --> OUTPUT
    
    HIST --> FEATURES2
    FEATURES2 --> LSTM
    LSTM --> ATTENTION
    ATTENTION --> PRED
    
    PROFILE --> OPTIMIZER
    INCOME --> OPTIMIZER
    DEDUCTIONS --> OPTIMIZER
    OPTIMIZER --> RECOMMENDATIONS
```

## Security Architecture

### Security Layers

```mermaid
graph TB
    subgraph "Network Security"
        WAF[Web Application Firewall]
        DDoS[DDoS Protection]
        VPN[VPN Gateway]
        FW[Firewall Rules]
    end
    
    subgraph "Application Security"
        AUTH[Authentication]
        AUTHZ[Authorization]
        VALIDATION[Input Validation]
        SANITIZATION[Output Sanitization]
    end
    
    subgraph "Data Security"
        ENCRYPTION[Encryption at Rest]
        TRANSPORT[TLS Encryption]
        KEY_MGMT[Key Management]
        MASKING[Data Masking]
    end
    
    subgraph "Infrastructure Security"
        CONTAINER[Container Security]
        SECRETS[Secrets Management]
        MONITORING[Security Monitoring]
        BACKUP[Secure Backup]
    end
    
    WAF --> DDoS
    DDoS --> VPN
    VPN --> FW
    
    AUTH --> AUTHZ
    AUTHZ --> VALIDATION
    VALIDATION --> SANITIZATION
    
    ENCRYPTION --> TRANSPORT
    TRANSPORT --> KEY_MGMT
    KEY_MGMT --> MASKING
    
    CONTAINER --> SECRETS
    SECRETS --> MONITORING
    MONITORING --> BACKUP
```

### Audit Trail Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant A as Application
    participant L as Audit Logger
    participant H as Hash Chain
    participant S as Storage
    
    U->>A: Perform Action
    A->>L: Log Event
    L->>H: Generate Hash
    H->>H: Chain with Previous Hash
    L->>S: Store Immutable Log
    S-->>L: Confirmation
    L-->>A: Log ID
    A-->>U: Action Complete
    
    Note over H: Each log entry contains:<br/>- Timestamp<br/>- User ID<br/>- Action<br/>- Previous Hash<br/>- Current Hash<br/>- Data State
```

## Deployment Architecture

### Kubernetes Architecture

```mermaid
graph TB
    subgraph "Kubernetes Cluster"
        subgraph "Ingress Layer"
            INGRESS[Ingress Controller]
            LB[Load Balancer]
        end
        
        subgraph "Application Layer"
            FRONTEND[Frontend Pods]
            BACKEND[Backend Pods]
            AI[AI Service Pods]
        end
        
        subgraph "Data Layer"
            PG[PostgreSQL]
            REDIS[Redis]
            VECTOR[Vector DB]
        end
        
        subgraph "Monitoring Layer"
            PROM[Prometheus]
            GRAFANA[Grafana]
            JAEGER[Jaeger]
        end
    end
    
    subgraph "External Services"
        S3[AWS S3]
        KMS[AWS KMS]
        AA[Account Aggregator]
        GOV[Government APIs]
    end
    
    LB --> INGRESS
    INGRESS --> FRONTEND
    INGRESS --> BACKEND
    INGRESS --> AI
    
    BACKEND --> PG
    BACKEND --> REDIS
    AI --> VECTOR
    
    FRONTEND --> PROM
    BACKEND --> PROM
    AI --> PROM
    
    PROM --> GRAFANA
    PROM --> JAEGER
    
    BACKEND --> S3
    BACKEND --> KMS
    BACKEND --> AA
    BACKEND --> GOV
```

### CI/CD Pipeline

```mermaid
graph LR
    subgraph "Source Control"
        GIT[Git Repository]
        PR[Pull Request]
    end
    
    subgraph "CI Pipeline"
        BUILD[Build]
        TEST[Test]
        LINT[Lint]
        SECURITY[Security Scan]
    end
    
    subgraph "CD Pipeline"
        PACKAGE[Package]
        DEPLOY[Deploy]
        VERIFY[Verify]
        ROLLBACK[Rollback]
    end
    
    subgraph "Environments"
        DEV[Development]
        STAGING[Staging]
        PROD[Production]
    end
    
    GIT --> PR
    PR --> BUILD
    BUILD --> TEST
    TEST --> LINT
    LINT --> SECURITY
    
    SECURITY --> PACKAGE
    PACKAGE --> DEPLOY
    DEPLOY --> VERIFY
    VERIFY --> ROLLBACK
    
    DEPLOY --> DEV
    DEPLOY --> STAGING
    DEPLOY --> PROD
```

## Monitoring & Observability

### Monitoring Stack

```mermaid
graph TB
    subgraph "Application Metrics"
        APP[Application]
        METRICS[Metrics]
        PROMETHEUS[Prometheus]
    end
    
    subgraph "Logging"
        LOGS[Application Logs]
        LOGSTASH[Logstash]
        ELASTICSEARCH[Elasticsearch]
        KIBANA[Kibana]
    end
    
    subgraph "Tracing"
        TRACES[Distributed Traces]
        JAEGER[Jaeger]
    end
    
    subgraph "Alerting"
        ALERTS[Alerts]
        PAGERDUTY[PagerDuty]
        SLACK[Slack]
    end
    
    APP --> METRICS
    METRICS --> PROMETHEUS
    
    APP --> LOGS
    LOGS --> LOGSTASH
    LOGSTASH --> ELASTICSEARCH
    ELASTICSEARCH --> KIBANA
    
    APP --> TRACES
    TRACES --> JAEGER
    
    PROMETHEUS --> ALERTS
    ALERTS --> PAGERDUTY
    ALERTS --> SLACK
```

### Key Metrics

#### Application Metrics
- **Response Time**: P50, P95, P99 latencies
- **Error Rate**: 4xx and 5xx error percentages
- **Throughput**: Requests per second
- **Availability**: Uptime percentage

#### Business Metrics
- **User Engagement**: Daily/Monthly active users
- **Conversion Rate**: Free to paid conversion
- **Revenue**: Monthly recurring revenue
- **Customer Satisfaction**: NPS scores

#### Infrastructure Metrics
- **CPU Usage**: Average and peak CPU utilization
- **Memory Usage**: Memory consumption patterns
- **Disk I/O**: Read/write operations
- **Network I/O**: Bandwidth utilization

## Scalability Considerations

### Horizontal Scaling Strategy

```mermaid
graph TB
    subgraph "Load Balancing"
        ALB[Application Load Balancer]
        NGINX[Nginx]
    end
    
    subgraph "Auto Scaling"
        HPA[Horizontal Pod Autoscaler]
        VPA[Vertical Pod Autoscaler]
        CA[Cluster Autoscaler]
    end
    
    subgraph "Database Scaling"
        READ_REPLICAS[Read Replicas]
        SHARDING[Database Sharding]
        CACHING[Query Caching]
    end
    
    subgraph "Microservices"
        API_GATEWAY[API Gateway]
        SERVICE_MESH[Service Mesh]
        CIRCUIT_BREAKER[Circuit Breaker]
    end
    
    ALB --> NGINX
    NGINX --> HPA
    HPA --> VPA
    VPA --> CA
    
    CA --> READ_REPLICAS
    READ_REPLICAS --> SHARDING
    SHARDING --> CACHING
    
    API_GATEWAY --> SERVICE_MESH
    SERVICE_MESH --> CIRCUIT_BREAKER
```

### Performance Optimization

#### Caching Strategy
- **L1 Cache**: Application-level caching (Redis)
- **L2 Cache**: Database query caching
- **L3 Cache**: CDN caching for static assets
- **L4 Cache**: Browser caching

#### Database Optimization
- **Indexing**: Strategic index creation
- **Query Optimization**: Query plan analysis
- **Connection Pooling**: Efficient connection management
- **Partitioning**: Table and index partitioning

## Technology Decisions

### Frontend Technology Stack

| Technology | Choice | Rationale |
|------------|--------|-----------|
| Framework | Next.js 14 | App Router, SSR, excellent DX |
| Language | TypeScript | Type safety, better maintainability |
| Styling | Tailwind CSS | Utility-first, consistent design |
| UI Components | shadcn/ui | Accessible, customizable components |
| State Management | Zustand + React Query | Lightweight, server state management |
| Testing | Jest + RTL | Industry standard, comprehensive testing |

### Backend Technology Stack

| Technology | Choice | Rationale |
|------------|--------|-----------|
| Framework | NestJS | Enterprise-grade, TypeScript-first |
| Language | TypeScript | Type safety, shared types with frontend |
| Database | PostgreSQL | ACID compliance, JSON support |
| ORM | Prisma | Type-safe, excellent DX |
| Vector DB | pgvector | Native PostgreSQL extension |
| Caching | Redis | High-performance, versatile |

### AI/ML Technology Stack

| Technology | Choice | Rationale |
|------------|--------|-----------|
| LLM | Llama 2/Mistral | Open source, cost-effective |
| Embeddings | sentence-transformers | Local processing, privacy |
| Vector DB | pgvector | Integrated with main database |
| ML Framework | PyTorch | Industry standard, flexibility |
| RAG | LangChain | Comprehensive RAG framework |

### Infrastructure Technology Stack

| Technology | Choice | Rationale |
|------------|--------|-----------|
| Containerization | Docker | Industry standard, portability |
| Orchestration | Kubernetes | Scalability, ecosystem |
| Cloud Provider | AWS | Mature services, India region |
| CI/CD | GitHub Actions | Integrated with source control |
| Monitoring | Prometheus + Grafana | Open source, comprehensive |

## Compliance & Security

### Regulatory Compliance

#### DPDP Act 2023
- **Consent Management**: Granular consent with easy revocation
- **Data Minimization**: Collect only necessary data
- **Data Portability**: Export user data in standard format
- **Right to Erasure**: Complete data deletion capability
- **Data Protection Officer**: Dedicated DPO role

#### RBI Guidelines
- **Data Localization**: All sensitive data stored in India
- **Audit Trails**: Immutable logs for all transactions
- **Incident Response**: 6-hour incident reporting
- **Security Standards**: ISO 27001 compliance

#### SEBI Regulations
- **Investment Advisory**: Proper licensing and disclosures
- **Client Onboarding**: KYC and risk profiling
- **Record Keeping**: 5-year record retention
- **Conflict of Interest**: Proper disclosure mechanisms

### Security Measures

#### Authentication & Authorization
- **Multi-Factor Authentication**: TOTP + SMS backup
- **Role-Based Access Control**: Granular permissions
- **Session Management**: Secure session handling
- **Device Management**: Device registration and monitoring

#### Data Protection
- **Encryption at Rest**: AES-256 encryption
- **Encryption in Transit**: TLS 1.3
- **Key Management**: AWS KMS integration
- **Data Masking**: PII protection in logs

#### Monitoring & Incident Response
- **Security Monitoring**: Real-time threat detection
- **Incident Response**: Automated response procedures
- **Vulnerability Management**: Regular security assessments
- **Penetration Testing**: Annual third-party testing

---

*This architecture document is living and will be updated as the system evolves. For questions or clarifications, please contact the architecture team.*
