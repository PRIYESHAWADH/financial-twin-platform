#!/bin/bash

# FinTwin Platform Startup Script
# Production-grade startup with comprehensive checks

set -e

echo "🚀 Starting FinTwin Platform - India's First AI Financial Twin + CA Ecosystem"
echo "=================================================================="

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

# Check if Docker is running
check_docker() {
    print_status "Checking Docker status..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Check if Docker Compose is available
check_docker_compose() {
    print_status "Checking Docker Compose..."
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    print_success "Docker Compose is available"
}

# Clean up any existing containers
cleanup() {
    print_status "Cleaning up existing containers..."
    docker-compose down --remove-orphans --volumes 2>/dev/null || true
    print_success "Cleanup completed"
}

# Build and start services
start_services() {
    print_status "Building and starting FinTwin services..."
    print_status "This may take several minutes for the first run..."
    
    # Start infrastructure services first
    print_status "Starting infrastructure services (PostgreSQL, Redis)..."
    docker-compose up -d postgres redis
    
    # Wait for infrastructure to be ready
    print_status "Waiting for infrastructure services to be ready..."
    sleep 30
    
    # Start application services
    print_status "Starting application services (Backend, Frontend, ML)..."
    docker-compose up -d backend frontend ml-service
    
    # Wait for application services
    print_status "Waiting for application services to be ready..."
    sleep 60
    
    # Start monitoring services
    print_status "Starting monitoring services (Prometheus, Grafana, ELK)..."
    docker-compose up -d prometheus grafana elasticsearch kibana jaeger
    
    # Start remaining services
    print_status "Starting remaining services (MinIO, Nginx)..."
    docker-compose up -d minio nginx
    
    print_success "All services started successfully!"
}

# Check service health
check_health() {
    print_status "Checking service health..."
    
    services=(
        "postgres:5432"
        "redis:6379"
        "backend:3001"
        "frontend:3000"
        "ml-service:8000"
        "prometheus:9090"
        "grafana:3003"
        "elasticsearch:9200"
        "kibana:5601"
        "jaeger:16686"
        "minio:9000"
        "nginx:80"
    )
    
    for service in "${services[@]}"; do
        name=$(echo $service | cut -d: -f1)
        port=$(echo $service | cut -d: -f2)
        
        if curl -f -s "http://localhost:$port" > /dev/null 2>&1 || \
           curl -f -s "http://localhost:$port/health" > /dev/null 2>&1 || \
           nc -z localhost $port 2>/dev/null; then
            print_success "$name is healthy"
        else
            print_warning "$name may not be ready yet"
        fi
    done
}

# Display service URLs
show_urls() {
    echo ""
    echo "🎉 FinTwin Platform is now running!"
    echo "=================================================================="
    echo ""
    echo "📱 Frontend Application:"
    echo "   🌐 Main App: http://localhost:3000"
    echo "   🔐 Login: http://localhost:3000/auth/login"
    echo "   📊 Dashboard: http://localhost:3000/financial-twin"
    echo "   👥 CA Marketplace: http://localhost:3000/ca-marketplace"
    echo ""
    echo "🔧 Backend API:"
    echo "   🚀 API: http://localhost:3001"
    echo "   📚 Swagger Docs: http://localhost:3001/api"
    echo "   ❤️ Health Check: http://localhost:3001/health"
    echo ""
    echo "🤖 ML Service:"
    echo "   🧠 ML API: http://localhost:8000"
    echo "   📖 ML Docs: http://localhost:8000/docs"
    echo "   ❤️ Health Check: http://localhost:8000/health"
    echo ""
    echo "📊 Monitoring & Observability:"
    echo "   📈 Prometheus: http://localhost:9090"
    echo "   📊 Grafana: http://localhost:3003 (admin/admin)"
    echo "   🔍 Elasticsearch: http://localhost:9200"
    echo "   📋 Kibana: http://localhost:5601"
    echo "   🔍 Jaeger: http://localhost:16686"
    echo ""
    echo "💾 Storage & Infrastructure:"
    echo "   🗄️ MinIO Console: http://localhost:9001 (minioadmin/minioadmin123)"
    echo "   🌐 Nginx: http://localhost:80"
    echo ""
    echo "🔑 Default Credentials:"
    echo "   👤 Admin User: admin@fintwin.in / admin123"
    echo "   👤 Test User: user@fintwin.in / user123"
    echo "   🗄️ Database: fintwin / fintwin_password"
    echo "   📊 Grafana: admin / admin"
    echo "   💾 MinIO: minioadmin / minioadmin123"
    echo ""
    echo "📝 Quick Start:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Register a new account or use test credentials"
    echo "   3. Upload financial documents or connect via AA"
    echo "   4. Explore AI insights and CA marketplace"
    echo ""
    echo "🛠️ Management Commands:"
    echo "   📊 View logs: docker-compose logs -f [service-name]"
    echo "   🔄 Restart: docker-compose restart [service-name]"
    echo "   🛑 Stop all: docker-compose down"
    echo "   🧹 Clean up: docker-compose down --volumes --remove-orphans"
    echo ""
    echo "=================================================================="
    echo "🎯 FinTwin - India's First AI Financial Twin + CA Ecosystem"
    echo "🚀 Ready to revolutionize financial management in India!"
    echo "=================================================================="
}

# Main execution
main() {
    echo "Starting FinTwin Platform startup sequence..."
    echo ""
    
    check_docker
    check_docker_compose
    cleanup
    start_services
    
    # Wait a bit more for everything to stabilize
    print_status "Waiting for services to stabilize..."
    sleep 30
    
    check_health
    show_urls
    
    print_success "FinTwin Platform startup completed successfully!"
    print_status "You can now access the platform at http://localhost:3000"
}

# Handle script interruption
trap 'print_error "Startup interrupted. Run docker-compose down to clean up."; exit 1' INT

# Run main function
main "$@"
