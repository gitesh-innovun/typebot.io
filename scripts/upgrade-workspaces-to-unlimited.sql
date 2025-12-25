-- Upgrade All Existing Workspaces to UNLIMITED Plan
-- This script updates all workspaces in the database to have unlimited access
-- Run this after setting BILLING_MODE=UNLIMITED in your .env

-- Update all workspaces to UNLIMITED plan
UPDATE "Workspace"
SET
  plan = 'UNLIMITED',
  "isQuarantined" = false,
  "isSuspended" = false,
  "isPastDue" = false
WHERE plan IN ('FREE', 'STARTER', 'PRO');

-- Verify the update
SELECT
  id,
  name,
  plan,
  "isQuarantined",
  "isSuspended"
FROM "Workspace"
ORDER BY "createdAt" DESC
LIMIT 10;

-- Show count by plan
SELECT
  plan,
  COUNT(*) as workspace_count
FROM "Workspace"
GROUP BY plan;
