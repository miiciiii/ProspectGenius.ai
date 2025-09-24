-- Update existing trial subscriptions to active status
-- This fixes subscriptions that were created with the default 'trial' status
-- when users actually subscribed and should have 'active' status

UPDATE subscriptions
SET status = 'active'
WHERE status = 'trial';