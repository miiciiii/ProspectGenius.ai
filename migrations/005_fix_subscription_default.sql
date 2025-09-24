-- Ensure subscriptions default to 'active' status
-- This fixes any subscriptions that might be created with 'trial' status

ALTER TABLE subscriptions ALTER COLUMN status SET DEFAULT 'active';