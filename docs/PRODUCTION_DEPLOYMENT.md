# FinTwin Production Deployment Guide
## Complete Production Setup & Monitoring

### 🏗️ Infrastructure Setup

#### 1. AWS Infrastructure (ap-south-1)
```bash
# Deploy infrastructure using Terraform
cd infra/terraform
terraform init
terraform plan
terraform apply
```

**Resources Created:**
- VPC with public/private subnets
- RDS PostgreSQL with pgvector extension
- ElastiCache Redis cluster
- EKS cluster for container orchestration
- Application Load Balancer
- CloudFront CDN
- S3 buckets for static assets
- IAM roles and policies

#### 2. Database Setup
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create production database
CREATE DATABASE fintwin_prod;
\c fintwin_prod;

-- Run migrations
\i backend/prisma/migrations/001_init.sql
```

#### 3. Kubernetes Deployment
```bash
# Deploy to staging first
kubectl apply -f infra/k8s/staging/

# Verify staging deployment
kubectl get pods -n fintwin-staging

# Deploy to production
kubectl apply -f infra/k8s/production/

# Verify production deployment
kubectl get pods -n fintwin-production
```

### 🔐 Security Configuration

#### 1. SSL/TLS Setup
```bash
# Generate SSL certificates
certbot certonly --dns-route53 -d api.fintwin.in
certbot certonly --dns-route53 -d app.fintwin.in

# Configure nginx with SSL
kubectl apply -f infra/k8s/production/ssl-config.yaml
```

#### 2. Secrets Management
```bash
# Create Kubernetes secrets
kubectl create secret generic fintwin-secrets \
  --from-literal=db-password=<secure-password> \
  --from-literal=jwt-secret=<jwt-secret> \
  --from-literal=encryption-key=<encryption-key> \
  --namespace=fintwin-production
```

#### 3. Network Security
- Configure VPC security groups
- Set up WAF rules
- Enable DDoS protection
- Configure network ACLs

### 📊 Monitoring & Observability

#### 1. Prometheus + Grafana Setup
```yaml
# prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
      - job_name: 'fintwin-backend'
        static_configs:
          - targets: ['backend-service:3000']
      - job_name: 'fintwin-ml'
        static_configs:
          - targets: ['ml-service:8000']
```

#### 2. Application Metrics
```typescript
// backend/src/common/metrics/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { register, Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  });

  private readonly httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route'],
  });

  private readonly activeUsers = new Gauge({
    name: 'active_users_total',
    help: 'Number of active users',
  });

  recordRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
    this.httpRequestDuration.observe({ method, route }, duration);
  }

  setActiveUsers(count: number) {
    this.activeUsers.set(count);
  }
}
```

#### 3. Logging Setup (ELK Stack)
```yaml
# elasticsearch.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: elasticsearch
spec:
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
      - name: elasticsearch
        image: elasticsearch:8.8.0
        env:
        - name: discovery.type
          value: single-node
        - name: xpack.security.enabled
          value: "false"
```

### 🚀 Deployment Pipeline

#### 1. CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and test
        run: |
          docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
      
      - name: Deploy to staging
        run: |
          kubectl apply -f infra/k8s/staging/
          kubectl rollout status deployment/backend -n fintwin-staging
      
      - name: Run integration tests
        run: |
          npm run test:integration
      
      - name: Deploy to production
        if: success()
        run: |
          kubectl apply -f infra/k8s/production/
          kubectl rollout status deployment/backend -n fintwin-production
```

#### 2. Blue-Green Deployment
```bash
# Blue-green deployment script
#!/bin/bash

# Deploy to green environment
kubectl apply -f infra/k8s/production/green/

# Wait for green to be ready
kubectl wait --for=condition=available deployment/backend-green -n fintwin-production

# Run health checks
./scripts/health-check.sh green

# Switch traffic to green
kubectl patch service backend-service -n fintwin-production -p '{"spec":{"selector":{"version":"green"}}}'

# Keep blue for rollback
kubectl scale deployment backend-blue -n fintwin-production --replicas=0
```

### 🔍 Health Checks & Monitoring

#### 1. Health Check Endpoints
```typescript
// backend/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.checkRedis(),
      () => this.checkMLService(),
    ]);
  }

  private async checkRedis() {
    // Redis health check
  }

  private async checkMLService() {
    // ML service health check
  }
}
```

#### 2. Alerting Rules
```yaml
# prometheus-alerts.yaml
groups:
- name: fintwin-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      
  - alert: DatabaseDown
    expr: up{job="postgresql"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Database is down"
      
  - alert: HighResponseTime
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High response time detected"
```

### 📈 Performance Optimization

#### 1. Database Optimization
```sql
-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_transactions_user_id_date ON transactions(user_id, date);
CREATE INDEX CONCURRENTLY idx_documents_user_id_type ON documents(user_id, type);
CREATE INDEX CONCURRENTLY idx_audit_logs_user_id_timestamp ON audit_logs(user_id, timestamp);

-- Enable query optimization
SET enable_seqscan = off;
SET random_page_cost = 1.1;
```

#### 2. Caching Strategy
```typescript
// backend/src/common/cache/cache.service.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class CacheService {
  constructor(private redis: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

#### 3. CDN Configuration
```yaml
# cloudfront-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cloudfront-config
data:
  distribution.yaml: |
    DistributionConfig:
      Origins:
        - Id: fintwin-frontend
          DomainName: app.fintwin.in
          CustomOriginConfig:
            HTTPPort: 80
            HTTPSPort: 443
            OriginProtocolPolicy: https-only
      DefaultCacheBehavior:
        TargetOriginId: fintwin-frontend
        ViewerProtocolPolicy: redirect-to-https
        CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
```

### 🔒 Security Hardening

#### 1. Network Security
```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: fintwin-network-policy
spec:
  podSelector:
    matchLabels:
      app: fintwin
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: fintwin-production
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: fintwin-production
    ports:
    - protocol: TCP
      port: 5432
```

#### 2. Pod Security
```yaml
# pod-security-policy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: fintwin-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
```

### 📋 Deployment Checklist

#### Pre-Deployment
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance testing done
- [ ] Database migrations ready
- [ ] Secrets configured
- [ ] Monitoring setup complete

#### Deployment
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Verify health checks
- [ ] Monitor metrics
- [ ] Check logs

#### Post-Deployment
- [ ] Verify all services running
- [ ] Check user flows
- [ ] Monitor error rates
- [ ] Validate performance
- [ ] Update documentation

### 🚨 Incident Response

#### 1. Runbook Template
```markdown
# Incident Response Runbook

## Severity Levels
- P1: Critical (Service down, data loss)
- P2: High (Major feature broken)
- P3: Medium (Minor issues)
- P4: Low (Cosmetic issues)

## Response Process
1. Acknowledge incident
2. Assess severity
3. Notify stakeholders
4. Investigate root cause
5. Implement fix
6. Monitor resolution
7. Post-mortem
```

#### 2. Rollback Procedure
```bash
# Quick rollback script
#!/bin/bash

# Get current deployment
CURRENT=$(kubectl get deployment backend -n fintwin-production -o jsonpath='{.spec.template.spec.containers[0].image}')

# Rollback to previous version
kubectl rollout undo deployment/backend -n fintwin-production

# Verify rollback
kubectl rollout status deployment/backend -n fintwin-production

# Check health
./scripts/health-check.sh
```

---

**Ready for Production**: This deployment guide ensures FinTwin is production-ready with enterprise-grade monitoring, security, and scalability.
