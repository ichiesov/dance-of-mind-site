-- Dance of Mind - Database Schema for Telegram Bot Authorization
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    telegram_id BIGINT UNIQUE,
    telegram_username VARCHAR(255),
    completed_quests TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on phone_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);

-- Auth sessions table
CREATE TABLE IF NOT EXISTS auth_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL,
    telegram_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_user_phone FOREIGN KEY (phone_number)
        REFERENCES users(phone_number)
        ON DELETE CASCADE,
    CONSTRAINT chk_status CHECK (status IN ('pending', 'approved', 'rejected', 'expired'))
);

-- Create indexes for auth sessions
CREATE INDEX IF NOT EXISTS idx_auth_sessions_phone ON auth_sessions(phone_number);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_telegram_id ON auth_sessions(telegram_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_status ON auth_sessions(status);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_created_at ON auth_sessions(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically expire old auth sessions
CREATE OR REPLACE FUNCTION expire_old_auth_sessions()
RETURNS void AS $$
BEGIN
    UPDATE auth_sessions
    SET status = 'expired'
    WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run expiration function
-- You can set this up in Supabase Dashboard -> Database -> Cron Jobs
-- Or call this function periodically from your application

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT
    USING (auth.uid()::text = id::text);

-- Policy: Service role can do everything (for your backend)
CREATE POLICY "Service role full access users" ON users
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access auth_sessions" ON auth_sessions
    FOR ALL
    USING (auth.role() = 'service_role');

-- Comments for documentation
COMMENT ON TABLE users IS 'Registered users with phone numbers and Telegram info';
COMMENT ON TABLE auth_sessions IS 'Temporary authentication sessions for login flow';
COMMENT ON COLUMN users.phone_number IS 'User phone number (unique identifier)';
COMMENT ON COLUMN users.telegram_id IS 'Telegram user ID from bot interaction';
COMMENT ON COLUMN auth_sessions.status IS 'Session status: pending, approved, rejected, expired';
COMMENT ON COLUMN auth_sessions.expires_at IS 'When the session expires (typically 5 minutes)';
