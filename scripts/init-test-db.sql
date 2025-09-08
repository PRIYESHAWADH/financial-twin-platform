-- Initialize test database with required extensions and test data

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Create test database if it doesn't exist
-- (This will be handled by the docker-compose environment)

-- Create test user for database access
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'fintwin_test') THEN
        CREATE ROLE fintwin_test WITH LOGIN PASSWORD 'test_password';
    END IF;
END
$$;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE fintwin_test TO fintwin_test;
GRANT ALL PRIVILEGES ON SCHEMA public TO fintwin_test;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fintwin_test;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fintwin_test;

-- Create test data tables (these will be created by Prisma migrations)
-- This script is mainly for setting up extensions and permissions

-- Insert some test data for integration tests
INSERT INTO "User" (id, email, name, phone, password_hash, created_at, updated_at) VALUES
    ('test-user-1', 'test@example.com', 'Test User', '+919876543210', '$2b$10$test.hash', NOW(), NOW()),
    ('test-user-2', 'test2@example.com', 'Test User 2', '+919876543211', '$2b$10$test.hash', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Consent" (id, user_id, purpose, data_types, duration, consent_given, created_at, updated_at) VALUES
    ('test-consent-1', 'test-user-1', 'financial_analysis', '["transactions", "bank_statements"]', '1_year', true, NOW(), NOW()),
    ('test-consent-2', 'test-user-2', 'tax_filing', '["income", "expenses"]', '6_months', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Document" (id, user_id, filename, content, metadata, created_at, updated_at) VALUES
    ('test-doc-1', 'test-user-1', 'test-bank-statement.pdf', 'Test bank statement content', '{"type": "bank_statement", "year": "2023"}', NOW(), NOW()),
    ('test-doc-2', 'test-user-2', 'test-salary-slip.pdf', 'Test salary slip content', '{"type": "salary_slip", "month": "2023-12"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Transaction" (id, user_id, date, description, amount, type, category, created_at, updated_at) VALUES
    ('test-txn-1', 'test-user-1', '2023-12-01', 'Grocery Store', 1500.00, 'debit', 'Food & Dining', NOW(), NOW()),
    ('test-txn-2', 'test-user-1', '2023-12-01', 'Salary Credit', 50000.00, 'credit', 'Salary', NOW(), NOW()),
    ('test-txn-3', 'test-user-2', '2023-12-01', 'ATM Withdrawal', 5000.00, 'debit', 'Cash', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "CAProfile" (id, user_id, name, email, phone, specialization, location, experience_years, rating, is_verified, created_at, updated_at) VALUES
    ('test-ca-1', 'test-user-1', 'Test CA', 'ca@example.com', '+919876543212', 'tax', 'Mumbai', 5, 4.5, true, NOW(), NOW()),
    ('test-ca-2', 'test-user-2', 'Test CA 2', 'ca2@example.com', '+919876543213', 'audit', 'Delhi', 3, 4.2, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "AuditLog" (id, user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at) VALUES
    ('test-audit-1', 'test-user-1', 'LOGIN', 'user', 'test-user-1', '{"method": "email"}', '127.0.0.1', 'test-agent', NOW()),
    ('test-audit-2', 'test-user-1', 'DOCUMENT_UPLOAD', 'document', 'test-doc-1', '{"filename": "test-bank-statement.pdf"}', '127.0.0.1', 'test-agent', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better test performance
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_consent_user_id ON "Consent"(user_id);
CREATE INDEX IF NOT EXISTS idx_document_user_id ON "Document"(user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_user_id ON "Transaction"(user_id);
CREATE INDEX IF NOT EXISTS idx_transaction_date ON "Transaction"(date);
CREATE INDEX IF NOT EXISTS idx_ca_profile_specialization ON "CAProfile"(specialization);
CREATE INDEX IF NOT EXISTS idx_ca_profile_location ON "CAProfile"(location);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON "AuditLog"(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON "AuditLog"(created_at);

-- Create vector index for document embeddings (if using pgvector)
-- This will be created when documents with embeddings are inserted

-- Set up test environment variables
-- These are handled by the docker-compose environment

-- Create test functions for data cleanup
CREATE OR REPLACE FUNCTION cleanup_test_data()
RETURNS void AS $$
BEGIN
    DELETE FROM "AuditLog" WHERE user_id LIKE 'test-%';
    DELETE FROM "CAProfile" WHERE user_id LIKE 'test-%';
    DELETE FROM "Transaction" WHERE user_id LIKE 'test-%';
    DELETE FROM "Document" WHERE user_id LIKE 'test-%';
    DELETE FROM "Consent" WHERE user_id LIKE 'test-%';
    DELETE FROM "User" WHERE id LIKE 'test-%';
END;
$$ LANGUAGE plpgsql;

-- Create function to reset sequences
CREATE OR REPLACE FUNCTION reset_sequences()
RETURNS void AS $$
BEGIN
    -- Reset any sequences if needed
    -- This is mainly for PostgreSQL sequences
    PERFORM setval(pg_get_serial_sequence('"User"', 'id'), 1, false);
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions on test functions
GRANT EXECUTE ON FUNCTION cleanup_test_data() TO fintwin_test;
GRANT EXECUTE ON FUNCTION reset_sequences() TO fintwin_test;

-- Create test data directory structure (this will be handled by the application)
-- The actual test data files will be created by the test scripts

-- Set up logging for test environment
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 0;
SELECT pg_reload_conf();

-- Create test database backup function
CREATE OR REPLACE FUNCTION backup_test_data()
RETURNS void AS $$
BEGIN
    -- This function can be used to backup test data before running tests
    -- Implementation depends on specific backup requirements
    RAISE NOTICE 'Test data backup function created';
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION backup_test_data() TO fintwin_test;

-- Final setup message
DO $$
BEGIN
    RAISE NOTICE 'Test database initialization completed successfully';
    RAISE NOTICE 'Extensions enabled: uuid-ossp, pgcrypto, pgvector';
    RAISE NOTICE 'Test user created: fintwin_test';
    RAISE NOTICE 'Test data inserted for integration tests';
    RAISE NOTICE 'Indexes created for better performance';
    RAISE NOTICE 'Test functions created: cleanup_test_data, reset_sequences, backup_test_data';
END
$$;
