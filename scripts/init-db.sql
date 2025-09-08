-- Initialize FinTwin Database
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create database if not exists
-- (This will be handled by POSTGRES_DB environment variable)

-- Create initial tables (Prisma will handle this via migrations)
-- This file is for any additional initialization needed

-- Set up initial permissions
GRANT ALL PRIVILEGES ON DATABASE fintwin TO fintwin;

-- Create any additional extensions needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set up initial configuration
ALTER DATABASE fintwin SET timezone TO 'Asia/Kolkata';
