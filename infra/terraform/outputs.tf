# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.fintwin_vpc.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.fintwin_vpc.cidr_block
}

# Subnet Outputs
output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public_subnets[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private_subnets[*].id
}

# EKS Outputs
output "eks_cluster_id" {
  description = "ID of the EKS cluster"
  value       = aws_eks_cluster.fintwin_cluster.id
}

output "eks_cluster_arn" {
  description = "ARN of the EKS cluster"
  value       = aws_eks_cluster.fintwin_cluster.arn
}

output "eks_cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = aws_eks_cluster.fintwin_cluster.endpoint
}

output "eks_cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = aws_eks_cluster.fintwin_cluster.vpc_config[0].cluster_security_group_id
}

output "eks_cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = aws_eks_cluster.fintwin_cluster.certificate_authority[0].data
}

# ECR Outputs
output "ecr_repository_urls" {
  description = "URLs of the ECR repositories"
  value = {
    frontend = aws_ecr_repository.fintwin_repos["frontend"].repository_url
    backend  = aws_ecr_repository.fintwin_repos["backend"].repository_url
    ml       = aws_ecr_repository.fintwin_repos["ml"].repository_url
  }
}

# Load Balancer Outputs
output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.fintwin_alb.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the load balancer"
  value       = aws_lb.fintwin_alb.zone_id
}

# Database Outputs
output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.fintwin_db.endpoint
}

output "rds_port" {
  description = "RDS instance port"
  value       = aws_db_instance.fintwin_db.port
}

output "rds_identifier" {
  description = "RDS instance identifier"
  value       = aws_db_instance.fintwin_db.identifier
}

# Redis Outputs
output "redis_endpoint" {
  description = "Redis cluster endpoint"
  value       = aws_elasticache_replication_group.fintwin_redis.configuration_endpoint_address
}

output "redis_port" {
  description = "Redis cluster port"
  value       = aws_elasticache_replication_group.fintwin_redis.port
}

# Security Group Outputs
output "alb_security_group_id" {
  description = "ID of the ALB security group"
  value       = aws_security_group.fintwin_alb_sg.id
}

output "eks_security_group_id" {
  description = "ID of the EKS security group"
  value       = aws_security_group.fintwin_eks_sg.id
}

output "db_security_group_id" {
  description = "ID of the database security group"
  value       = aws_security_group.fintwin_db_sg.id
}

output "redis_security_group_id" {
  description = "ID of the Redis security group"
  value       = aws_security_group.fintwin_redis_sg.id
}

# IAM Role Outputs
output "eks_cluster_role_arn" {
  description = "ARN of the EKS cluster IAM role"
  value       = aws_iam_role.eks_cluster_role.arn
}

output "eks_node_role_arn" {
  description = "ARN of the EKS node IAM role"
  value       = aws_iam_role.eks_node_role.arn
}

# General Outputs
output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "account_id" {
  description = "AWS account ID"
  value       = data.aws_caller_identity.current.account_id
}
