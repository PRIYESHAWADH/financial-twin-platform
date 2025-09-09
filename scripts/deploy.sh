#!/bin/bash

# FinTwin Deployment Script
# This script handles the complete deployment of FinTwin to AWS EKS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
AWS_REGION=${2:-ap-south-1}
CLUSTER_NAME="fintwin-${ENVIRONMENT}"
NAMESPACE="fintwin-${ENVIRONMENT}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if required tools are installed
    command -v aws >/dev/null 2>&1 || { log_error "AWS CLI is required but not installed. Aborting."; exit 1; }
    command -v kubectl >/dev/null 2>&1 || { log_error "kubectl is required but not installed. Aborting."; exit 1; }
    command -v helm >/dev/null 2>&1 || { log_error "Helm is required but not installed. Aborting."; exit 1; }
    command -v docker >/dev/null 2>&1 || { log_error "Docker is required but not installed. Aborting."; exit 1; }
    
    # Check AWS credentials
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        log_error "AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

setup_aws_eks() {
    log_info "Setting up AWS EKS cluster..."
    
    # Update kubeconfig
    aws eks update-kubeconfig --region ${AWS_REGION} --name ${CLUSTER_NAME}
    
    # Verify cluster access
    if kubectl cluster-info >/dev/null 2>&1; then
        log_success "EKS cluster access verified"
    else
        log_error "Failed to access EKS cluster"
        exit 1
    fi
}

install_helm_charts() {
    log_info "Installing Helm charts..."
    
    # Add required Helm repositories
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo add cert-manager https://charts.jetstack.io
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo add grafana https://grafana.github.io/helm-charts
    helm repo update
    
    # Install NGINX Ingress Controller
    log_info "Installing NGINX Ingress Controller..."
    helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --create-namespace \
        --set controller.service.type=LoadBalancer \
        --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-type"=nlb
    
    # Install cert-manager
    log_info "Installing cert-manager..."
    helm upgrade --install cert-manager cert-manager/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --set installCRDs=true
    
    # Install Prometheus
    log_info "Installing Prometheus..."
    helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --create-namespace \
        --set grafana.adminPassword=admin123
    
    log_success "Helm charts installed successfully"
}

build_and_push_images() {
    log_info "Building and pushing Docker images..."
    
    # Get ECR repository URLs
    ECR_REGISTRY=$(aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com)
    
    # Build and push frontend
    log_info "Building frontend image..."
    docker build -t fintwin-frontend:${ENVIRONMENT} ./frontend
    docker tag fintwin-frontend:${ENVIRONMENT} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fintwin-frontend:${ENVIRONMENT}
    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fintwin-frontend:${ENVIRONMENT}
    
    # Build and push backend
    log_info "Building backend image..."
    docker build -t fintwin-backend:${ENVIRONMENT} ./backend
    docker tag fintwin-backend:${ENVIRONMENT} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fintwin-backend:${ENVIRONMENT}
    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fintwin-backend:${ENVIRONMENT}
    
    # Build and push ML service
    log_info "Building ML service image..."
    docker build -t fintwin-ml:${ENVIRONMENT} ./ml
    docker tag fintwin-ml:${ENVIRONMENT} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fintwin-ml:${ENVIRONMENT}
    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fintwin-ml:${ENVIRONMENT}
    
    log_success "Docker images built and pushed successfully"
}

deploy_application() {
    log_info "Deploying FinTwin application..."
    
    # Create namespace
    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply Kubernetes manifests
    log_info "Applying Kubernetes manifests..."
    kubectl apply -f infra/k8s/${ENVIRONMENT}/
    
    # Wait for deployments to be ready
    log_info "Waiting for deployments to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/fintwin-backend -n ${NAMESPACE}
    kubectl wait --for=condition=available --timeout=300s deployment/fintwin-frontend -n ${NAMESPACE}
    kubectl wait --for=condition=available --timeout=300s deployment/fintwin-ml -n ${NAMESPACE}
    
    log_success "Application deployed successfully"
}

run_database_migrations() {
    log_info "Running database migrations..."
    
    # Get database connection details
    DB_HOST=$(kubectl get secret fintwin-secrets -n ${NAMESPACE} -o jsonpath='{.data.DB_HOST}' | base64 -d)
    DB_PASSWORD=$(kubectl get secret fintwin-secrets -n ${NAMESPACE} -o jsonpath='{.data.DB_PASSWORD}' | base64 -d)
    
    # Run migrations using a temporary pod
    kubectl run migration-pod --image=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fintwin-backend:${ENVIRONMENT} \
        --rm -i --restart=Never \
        --env="DATABASE_URL=postgresql://fintwin:${DB_PASSWORD}@${DB_HOST}:5432/fintwin_${ENVIRONMENT}" \
        --command -- npm run db:migrate
    
    log_success "Database migrations completed"
}

seed_database() {
    log_info "Seeding database..."
    
    # Get database connection details
    DB_HOST=$(kubectl get secret fintwin-secrets -n ${NAMESPACE} -o jsonpath='{.data.DB_HOST}' | base64 -d)
    DB_PASSWORD=$(kubectl get secret fintwin-secrets -n ${NAMESPACE} -o jsonpath='{.data.DB_PASSWORD}' | base64 -d)
    
    # Seed database using a temporary pod
    kubectl run seed-pod --image=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fintwin-backend:${ENVIRONMENT} \
        --rm -i --restart=Never \
        --env="DATABASE_URL=postgresql://fintwin:${DB_PASSWORD}@${DB_HOST}:5432/fintwin_${ENVIRONMENT}" \
        --command -- npm run db:seed
    
    log_success "Database seeded successfully"
}

verify_deployment() {
    log_info "Verifying deployment..."
    
    # Check pod status
    kubectl get pods -n ${NAMESPACE}
    
    # Check service status
    kubectl get services -n ${NAMESPACE}
    
    # Check ingress status
    kubectl get ingress -n ${NAMESPACE}
    
    # Get application URLs
    if [ "${ENVIRONMENT}" = "production" ]; then
        FRONTEND_URL="https://fintwin.in"
        API_URL="https://api.fintwin.in"
    else
        FRONTEND_URL="https://staging.fintwin.in"
        API_URL="https://api-staging.fintwin.in"
    fi
    
    log_success "Deployment verification completed"
    log_info "Frontend URL: ${FRONTEND_URL}"
    log_info "API URL: ${API_URL}"
}

cleanup() {
    log_info "Cleaning up temporary resources..."
    
    # Remove temporary pods if they exist
    kubectl delete pod migration-pod -n ${NAMESPACE} --ignore-not-found=true
    kubectl delete pod seed-pod -n ${NAMESPACE} --ignore-not-found=true
    
    log_success "Cleanup completed"
}

# Main execution
main() {
    log_info "Starting FinTwin deployment to ${ENVIRONMENT} environment..."
    
    # Get AWS account ID
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    
    # Execute deployment steps
    check_prerequisites
    setup_aws_eks
    install_helm_charts
    build_and_push_images
    deploy_application
    run_database_migrations
    seed_database
    verify_deployment
    cleanup
    
    log_success "FinTwin deployment completed successfully!"
    log_info "You can now access your application at:"
    if [ "${ENVIRONMENT}" = "production" ]; then
        log_info "  Frontend: https://fintwin.in"
        log_info "  API: https://api.fintwin.in"
    else
        log_info "  Frontend: https://staging.fintwin.in"
        log_info "  API: https://api-staging.fintwin.in"
    fi
}

# Handle script arguments
case "${1:-}" in
    "staging"|"production")
        main
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [ENVIRONMENT] [AWS_REGION]"
        echo ""
        echo "ENVIRONMENT: staging (default) or production"
        echo "AWS_REGION: AWS region (default: ap-south-1)"
        echo ""
        echo "Examples:"
        echo "  $0                    # Deploy to staging in ap-south-1"
        echo "  $0 production         # Deploy to production in ap-south-1"
        echo "  $0 staging us-east-1  # Deploy to staging in us-east-1"
        ;;
    *)
        log_error "Invalid environment. Use 'staging' or 'production'"
        log_info "Run '$0 help' for usage information"
        exit 1
        ;;
esac
