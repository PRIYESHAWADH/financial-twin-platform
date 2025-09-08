#!/bin/bash

# FinTwin Database Seeding Script
# This script seeds the database with initial data and ingests documents into the vector store

set -e  # Exit on any error

echo "🌱 Starting FinTwin Database Seeding"
echo "=================================="

# Configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-fintwin}
DB_USER=${DB_USER:-fintwin}
DB_PASSWORD=${DB_PASSWORD:-fintwin_password}
REDIS_HOST=${REDIS_HOST:-localhost}
REDIS_PORT=${REDIS_PORT:-6379}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for database to be ready
wait_for_db() {
    print_status "Waiting for database to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" >/dev/null 2>&1; then
            print_success "Database is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - Database not ready yet, waiting 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Database failed to become ready after $max_attempts attempts"
    return 1
}

# Function to wait for Redis to be ready
wait_for_redis() {
    print_status "Waiting for Redis to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if redis-cli -h $REDIS_HOST -p $REDIS_PORT ping >/dev/null 2>&1; then
            print_success "Redis is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - Redis not ready yet, waiting 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Redis failed to become ready after $max_attempts attempts"
    return 1
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    if [ -d "backend" ]; then
        cd backend
        
        # Install dependencies if needed
        if [ ! -d "node_modules" ]; then
            print_status "Installing backend dependencies..."
            npm install
        fi
        
        # Generate Prisma client
        print_status "Generating Prisma client..."
        npx prisma generate
        
        # Run migrations
        print_status "Running Prisma migrations..."
        npx prisma migrate deploy
        
        cd ..
        print_success "Database migrations completed"
    else
        print_warning "Backend directory not found, skipping migrations"
    fi
}

# Function to seed database with initial data
seed_database() {
    print_status "Seeding database with initial data..."
    
    if [ -d "backend" ]; then
        cd backend
        
        # Run seed script
        if [ -f "prisma/seed.ts" ]; then
            print_status "Running database seed script..."
            npm run db:seed
        else
            print_warning "Seed script not found, creating basic seed data..."
            create_basic_seed_data
        fi
        
        cd ..
        print_success "Database seeding completed"
    else
        print_warning "Backend directory not found, skipping database seeding"
    fi
}

# Function to create basic seed data
create_basic_seed_data() {
    print_status "Creating basic seed data..."
    
    # Create seed SQL file
    cat > prisma/seed.sql << 'EOF'
-- Insert sample users
INSERT INTO "User" (id, email, phone, pan, "firstName", "lastName", "isActive", "isVerified", "createdAt", "updatedAt") VALUES
('user_001', 'john.doe@example.com', '+919876543210', 'ABCDE1234F', 'John', 'Doe', true, true, NOW(), NOW()),
('user_002', 'jane.smith@example.com', '+919876543211', 'ABCDE1234G', 'Jane', 'Smith', true, true, NOW(), NOW()),
('user_003', 'mike.johnson@example.com', '+919876543212', 'ABCDE1234H', 'Mike', 'Johnson', true, true, NOW(), NOW()),
('user_004', 'sarah.wilson@example.com', '+919876543213', 'ABCDE1234I', 'Sarah', 'Wilson', true, true, NOW(), NOW()),
('user_005', 'david.brown@example.com', '+919876543214', 'ABCDE1234J', 'David', 'Brown', true, true, NOW(), NOW());

-- Insert sample CAs
INSERT INTO "CA" (id, "icaiMemberId", email, phone, pan, "firstName", "lastName", "isVerified", "isActive", "createdAt", "updatedAt") VALUES
('ca_001', 'ICAI001', 'ca1@example.com', '+919876543220', 'CA0011234F', 'Rajesh', 'Kumar', true, true, NOW(), NOW()),
('ca_002', 'ICAI002', 'ca2@example.com', '+919876543221', 'CA0021234G', 'Priya', 'Sharma', true, true, NOW(), NOW()),
('ca_003', 'ICAI003', 'ca3@example.com', '+919876543222', 'CA0031234H', 'Amit', 'Patel', true, true, NOW(), NOW());

-- Insert sample financial data
INSERT INTO "FinancialData" (id, "userId", "dataType", "rawData", "processedData", "source", "createdAt", "updatedAt") VALUES
('fd_001', 'user_001', 'bank_statement', '{"accountNumber": "1234567890", "bankName": "HDFC Bank"}', '{"balance": 245000, "transactions": 50}', 'account_aggregator', NOW(), NOW()),
('fd_002', 'user_002', 'investment_data', '{"portfolio": "diversified", "value": 500000}', '{"mutualFunds": 300000, "stocks": 200000}', 'manual_upload', NOW(), NOW());

-- Insert sample AI insights
INSERT INTO "AIInsight" (id, "userId", "insightType", "insightData", "citations", "confidenceScore", "generatedAt", "createdAt", "updatedAt") VALUES
('ai_001', 'user_001', 'tax_optimization', '{"recommendation": "Invest in ELSS funds", "savings": 15000}', '["Section 80C", "Income Tax Act"]', 0.95, NOW(), NOW(), NOW()),
('ai_002', 'user_001', 'expense_analysis', '{"category": "Food & Dining", "trend": "increasing", "suggestion": "Consider meal planning"}', '["Transaction analysis"]', 0.88, NOW(), NOW(), NOW());

-- Insert sample consent records
INSERT INTO "Consent" (id, "userId", "consentType", "consentArtefact", "status", "grantedAt", "expiresAt", "createdAt", "updatedAt") VALUES
('consent_001', 'user_001', 'account_aggregator', '{"purpose": "financial_analysis", "dataTypes": ["bank_statement", "credit_card"]}', 'active', NOW(), NOW() + INTERVAL '1 year', NOW(), NOW()),
('consent_002', 'user_002', 'data_processing', '{"purpose": "ai_insights", "dataTypes": ["transaction_data"]}', 'active', NOW(), NOW() + INTERVAL '1 year', NOW(), NOW());

-- Insert sample audit logs
INSERT INTO "AuditLog" (id, "userId", "action", "resource", "details", "ipAddress", "userAgent", "createdAt") VALUES
('audit_001', 'user_001', 'login', 'authentication', '{"method": "password"}', '192.168.1.1', 'Mozilla/5.0...', NOW()),
('audit_002', 'user_001', 'consent_granted', 'consent', '{"consentId": "consent_001"}', '192.168.1.1', 'Mozilla/5.0...', NOW()),
('audit_003', 'user_001', 'data_access', 'financial_data', '{"dataType": "bank_statement"}', '192.168.1.1', 'Mozilla/5.0...', NOW());
EOF

    # Execute seed SQL
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f prisma/seed.sql
    
    print_success "Basic seed data created"
}

# Function to ingest documents into vector store
ingest_documents() {
    print_status "Ingesting documents into vector store..."
    
    if [ -d "ml" ]; then
        cd ml
        
        # Install Python dependencies if needed
        if [ ! -d "venv" ]; then
            print_status "Creating Python virtual environment..."
            python3 -m venv venv
        fi
        
        # Activate virtual environment
        source venv/bin/activate
        
        # Install dependencies
        if [ -f "requirements.txt" ]; then
            print_status "Installing Python dependencies..."
            pip install -r requirements.txt
        fi
        
        # Run document ingestion
        if [ -f "rag_ingest.py" ]; then
            print_status "Running document ingestion..."
            python rag_ingest.py
        else
            print_warning "Document ingestion script not found"
        fi
        
        cd ..
        print_success "Document ingestion completed"
    else
        print_warning "ML directory not found, skipping document ingestion"
    fi
}

# Function to train ML models
train_models() {
    print_status "Training ML models..."
    
    if [ -d "ml" ]; then
        cd ml
        
        # Activate virtual environment
        source venv/bin/activate
        
        # Train transaction categorizer
        if [ -f "train_classifier.py" ]; then
            print_status "Training transaction categorizer..."
            python train_classifier.py
        else
            print_warning "Transaction categorizer training script not found"
        fi
        
        cd ..
        print_success "ML model training completed"
    else
        print_warning "ML directory not found, skipping model training"
    fi
}

# Function to create sample documents
create_sample_documents() {
    print_status "Creating sample documents..."
    
    # Create documents directory
    mkdir -p ml/data/documents
    
    # Create sample tax documents
    cat > ml/data/documents/income_tax_act_80c.md << 'EOF'
# Section 80C - Income Tax Act, 1961

## Deduction in respect of life insurance premia, deferred annuity, contributions to provident fund, subscription to certain equity shares or debentures, etc.

### Eligibility
- Individual or HUF
- Resident in India

### Maximum Deduction
- ₹1,50,000 per financial year

### Eligible Investments
1. Life Insurance Premium
2. Employee Provident Fund (EPF)
3. Public Provident Fund (PPF)
4. Equity Linked Savings Scheme (ELSS)
5. National Savings Certificate (NSC)
6. Tax Saving Fixed Deposits
7. Sukanya Samriddhi Yojana
8. Principal Repayment of Home Loan

### Conditions
- Investment must be made during the financial year
- Lock-in period varies by investment type
- ELSS has 3-year lock-in period
- PPF has 15-year lock-in period
EOF

    cat > ml/data/documents/gst_input_tax_credit.md << 'EOF'
# GST Input Tax Credit (ITC) - CGST Act, 2017

## Section 16 - Eligibility and Conditions for Taking Input Tax Credit

### Eligibility Conditions
1. Possession of tax invoice or debit note
2. Receipt of goods or services
3. Tax charged in respect of such supply has been actually paid to the government
4. Furnished return under section 39

### Blocked Credits - Section 17(5)
1. Motor vehicles and other conveyances (except for specified purposes)
2. Food and beverages, outdoor catering, beauty treatment, health services, cosmetic and plastic surgery
3. Membership of a club, health and fitness centre
4. Rent-a-cab, life insurance and health insurance
5. Travel benefits extended to employees on vacation
6. Works contract services for construction of immovable property
7. Goods or services used for personal consumption
8. Goods lost, stolen, destroyed, written off or disposed of by way of gift or free samples

### Time Limit
- ITC can be claimed within the earlier of:
  - Due date of furnishing return for September following the end of financial year
  - Due date of furnishing annual return
EOF

    cat > ml/data/documents/tds_provisions.md << 'EOF'
# Tax Deducted at Source (TDS) - Income Tax Act, 1961

## Section 194A - Interest other than interest on securities

### Rate of TDS
- 10% on interest from banks, co-operative societies, post office
- 20% if PAN not provided

### Threshold
- ₹40,000 for banks, co-operative societies, post office
- ₹5,000 for others

## Section 194B - Winnings from lottery or crossword puzzle

### Rate of TDS
- 30% on winnings

### Threshold
- ₹10,000

## Section 194C - Payment to contractors

### Rate of TDS
- 1% for individual/HUF
- 2% for others

### Threshold
- ₹30,000 for single payment
- ₹1,00,000 for aggregate payments in a year

## Section 194D - Insurance commission

### Rate of TDS
- 5% for resident
- 20% for non-resident

### Threshold
- ₹15,000
EOF

    print_success "Sample documents created"
}

# Function to verify setup
verify_setup() {
    print_status "Verifying setup..."
    
    # Check if required commands exist
    local required_commands=("psql" "redis-cli" "python3" "npm")
    for cmd in "${required_commands[@]}"; do
        if ! command_exists "$cmd"; then
            print_error "Required command not found: $cmd"
            return 1
        fi
    done
    
    # Check if directories exist
    local required_dirs=("backend" "frontend" "ml")
    for dir in "${required_dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            print_warning "Directory not found: $dir"
        fi
    done
    
    print_success "Setup verification completed"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --skip-migrations    Skip database migrations"
    echo "  --skip-seeding       Skip database seeding"
    echo "  --skip-ingestion     Skip document ingestion"
    echo "  --skip-training      Skip ML model training"
    echo "  --skip-verification  Skip setup verification"
    echo "  --help              Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DB_HOST             Database host (default: localhost)"
    echo "  DB_PORT             Database port (default: 5432)"
    echo "  DB_NAME             Database name (default: fintwin)"
    echo "  DB_USER             Database user (default: fintwin)"
    echo "  DB_PASSWORD         Database password (default: fintwin_password)"
    echo "  REDIS_HOST          Redis host (default: localhost)"
    echo "  REDIS_PORT          Redis port (default: 6379)"
}

# Main function
main() {
    local skip_migrations=false
    local skip_seeding=false
    local skip_ingestion=false
    local skip_training=false
    local skip_verification=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-migrations)
                skip_migrations=true
                shift
                ;;
            --skip-seeding)
                skip_seeding=true
                shift
                ;;
            --skip-ingestion)
                skip_ingestion=true
                shift
                ;;
            --skip-training)
                skip_training=true
                shift
                ;;
            --skip-verification)
                skip_verification=true
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Start seeding process
    print_status "Starting FinTwin database seeding process..."
    print_status "Configuration:"
    print_status "  Database: $DB_HOST:$DB_PORT/$DB_NAME"
    print_status "  Redis: $REDIS_HOST:$REDIS_PORT"
    print_status "  Skip migrations: $skip_migrations"
    print_status "  Skip seeding: $skip_seeding"
    print_status "  Skip ingestion: $skip_ingestion"
    print_status "  Skip training: $skip_training"
    print_status "  Skip verification: $skip_verification"
    echo ""
    
    # Verify setup
    if [ "$skip_verification" = false ]; then
        verify_setup
        echo ""
    fi
    
    # Wait for services
    wait_for_db
    wait_for_redis
    echo ""
    
    # Create sample documents
    create_sample_documents
    echo ""
    
    # Run migrations
    if [ "$skip_migrations" = false ]; then
        run_migrations
        echo ""
    fi
    
    # Seed database
    if [ "$skip_seeding" = false ]; then
        seed_database
        echo ""
    fi
    
    # Ingest documents
    if [ "$skip_ingestion" = false ]; then
        ingest_documents
        echo ""
    fi
    
    # Train models
    if [ "$skip_training" = false ]; then
        train_models
        echo ""
    fi
    
    print_success "🎉 FinTwin database seeding completed successfully!"
    print_status "You can now start the application with:"
    print_status "  docker-compose up -d"
    print_status "  or"
    print_status "  npm run dev:all"
}

# Run main function
main "$@"
