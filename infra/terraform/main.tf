# FinTwin Infrastructure on AWS
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# VPC
resource "aws_vpc" "fintwin_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "fintwin-vpc"
    Environment = var.environment
    Project     = "fintwin"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "fintwin_igw" {
  vpc_id = aws_vpc.fintwin_vpc.id

  tags = {
    Name        = "fintwin-igw"
    Environment = var.environment
    Project     = "fintwin"
  }
}

# Public Subnets
resource "aws_subnet" "public_subnets" {
  count = length(var.public_subnet_cidrs)

  vpc_id                  = aws_vpc.fintwin_vpc.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name        = "fintwin-public-subnet-${count.index + 1}"
    Environment = var.environment
    Project     = "fintwin"
    Type        = "public"
  }
}

# Private Subnets
resource "aws_subnet" "private_subnets" {
  count = length(var.private_subnet_cidrs)

  vpc_id            = aws_vpc.fintwin_vpc.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name        = "fintwin-private-subnet-${count.index + 1}"
    Environment = var.environment
    Project     = "fintwin"
    Type        = "private"
  }
}

# Route Table for Public Subnets
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.fintwin_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.fintwin_igw.id
  }

  tags = {
    Name        = "fintwin-public-rt"
    Environment = var.environment
    Project     = "fintwin"
  }
}

# Route Table Association for Public Subnets
resource "aws_route_table_association" "public_rta" {
  count = length(aws_subnet.public_subnets)

  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.public_rt.id
}

# NAT Gateway
resource "aws_eip" "nat_eip" {
  count = length(aws_subnet.public_subnets)

  domain = "vpc"

  tags = {
    Name        = "fintwin-nat-eip-${count.index + 1}"
    Environment = var.environment
    Project     = "fintwin"
  }
}

resource "aws_nat_gateway" "nat_gw" {
  count = length(aws_subnet.public_subnets)

  allocation_id = aws_eip.nat_eip[count.index].id
  subnet_id     = aws_subnet.public_subnets[count.index].id

  tags = {
    Name        = "fintwin-nat-gw-${count.index + 1}"
    Environment = var.environment
    Project     = "fintwin"
  }

  depends_on = [aws_internet_gateway.fintwin_igw]
}

# Route Table for Private Subnets
resource "aws_route_table" "private_rt" {
  count = length(aws_subnet.private_subnets)

  vpc_id = aws_vpc.fintwin_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gw[count.index].id
  }

  tags = {
    Name        = "fintwin-private-rt-${count.index + 1}"
    Environment = var.environment
    Project     = "fintwin"
  }
}

# Route Table Association for Private Subnets
resource "aws_route_table_association" "private_rta" {
  count = length(aws_subnet.private_subnets)

  subnet_id      = aws_subnet.private_subnets[count.index].id
  route_table_id = aws_route_table.private_rt[count.index].id
}

# Security Groups
resource "aws_security_group" "fintwin_alb_sg" {
  name_prefix = "fintwin-alb-sg"
  vpc_id      = aws_vpc.fintwin_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "fintwin-alb-sg"
    Environment = var.environment
    Project     = "fintwin"
  }
}

resource "aws_security_group" "fintwin_eks_sg" {
  name_prefix = "fintwin-eks-sg"
  vpc_id      = aws_vpc.fintwin_vpc.id

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "fintwin-eks-sg"
    Environment = var.environment
    Project     = "fintwin"
  }
}

# EKS Cluster
resource "aws_eks_cluster" "fintwin_cluster" {
  name     = "fintwin-${var.environment}"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = concat(aws_subnet.public_subnets[*].id, aws_subnet.private_subnets[*].id)
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs     = ["0.0.0.0/0"]
    security_group_ids      = [aws_security_group.fintwin_eks_sg.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_resource_controller,
  ]

  tags = {
    Name        = "fintwin-${var.environment}"
    Environment = var.environment
    Project     = "fintwin"
  }
}

# EKS Node Group
resource "aws_eks_node_group" "fintwin_nodes" {
  cluster_name    = aws_eks_cluster.fintwin_cluster.name
  node_group_name = "fintwin-nodes"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = aws_subnet.private_subnets[*].id

  capacity_type  = "ON_DEMAND"
  instance_types = var.node_instance_types

  scaling_config {
    desired_size = var.node_desired_size
    max_size     = var.node_max_size
    min_size     = var.node_min_size
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_container_registry_policy,
  ]

  tags = {
    Name        = "fintwin-nodes"
    Environment = var.environment
    Project     = "fintwin"
  }
}

# IAM Roles
resource "aws_iam_role" "eks_cluster_role" {
  name = "fintwin-eks-cluster-role"

  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_role" "eks_node_role" {
  name = "fintwin-eks-node-role"

  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

# IAM Role Policy Attachments
resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

resource "aws_iam_role_policy_attachment" "eks_vpc_resource_controller" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.eks_cluster_role.name
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_node_role.name
}

resource "aws_iam_role_policy_attachment" "eks_container_registry_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node_role.name
}

# ECR Repositories
resource "aws_ecr_repository" "fintwin_repos" {
  for_each = toset(["frontend", "backend", "ml"])

  name                 = "fintwin-${each.key}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "fintwin-${each.key}"
    Environment = var.environment
    Project     = "fintwin"
  }
}

# Application Load Balancer
resource "aws_lb" "fintwin_alb" {
  name               = "fintwin-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.fintwin_alb_sg.id]
  subnets            = aws_subnet.public_subnets[*].id

  enable_deletion_protection = var.environment == "production"

  tags = {
    Name        = "fintwin-${var.environment}-alb"
    Environment = var.environment
    Project     = "fintwin"
  }
}

# RDS Database
resource "aws_db_subnet_group" "fintwin_db_subnet_group" {
  name       = "fintwin-${var.environment}-db-subnet-group"
  subnet_ids = aws_subnet.private_subnets[*].id

  tags = {
    Name        = "fintwin-${var.environment}-db-subnet-group"
    Environment = var.environment
    Project     = "fintwin"
  }
}

resource "aws_db_instance" "fintwin_db" {
  identifier = "fintwin-${var.environment}-db"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = "fintwin_${var.environment}"
  username = "fintwin"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.fintwin_db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.fintwin_db_subnet_group.name

  backup_retention_period = var.environment == "production" ? 7 : 1
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = var.environment != "production"
  deletion_protection = var.environment == "production"

  tags = {
    Name        = "fintwin-${var.environment}-db"
    Environment = var.environment
    Project     = "fintwin"
  }
}

# RDS Security Group
resource "aws_security_group" "fintwin_db_sg" {
  name_prefix = "fintwin-db-sg"
  vpc_id      = aws_vpc.fintwin_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.fintwin_eks_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "fintwin-db-sg"
    Environment = var.environment
    Project     = "fintwin"
  }
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "fintwin_redis_subnet_group" {
  name       = "fintwin-${var.environment}-redis-subnet-group"
  subnet_ids = aws_subnet.private_subnets[*].id
}

resource "aws_elasticache_replication_group" "fintwin_redis" {
  replication_group_id       = "fintwin-${var.environment}-redis"
  description                = "FinTwin Redis cluster"

  node_type            = var.redis_node_type
  port                 = 6379
  parameter_group_name = "default.redis7"

  num_cache_clusters = var.environment == "production" ? 2 : 1

  subnet_group_name  = aws_elasticache_subnet_group.fintwin_redis_subnet_group.name
  security_group_ids = [aws_security_group.fintwin_redis_sg.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  tags = {
    Name        = "fintwin-${var.environment}-redis"
    Environment = var.environment
    Project     = "fintwin"
  }
}

# Redis Security Group
resource "aws_security_group" "fintwin_redis_sg" {
  name_prefix = "fintwin-redis-sg"
  vpc_id      = aws_vpc.fintwin_vpc.id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.fintwin_eks_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "fintwin-redis-sg"
    Environment = var.environment
    Project     = "fintwin"
  }
}
