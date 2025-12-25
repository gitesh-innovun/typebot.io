# AI Credits & Unlimited Plan Management

**Last Updated**: 2025-12-25

---

## Table of Contents

1. [How AI Credits Work in Typebot](#how-ai-credits-work-in-typebot)
2. [Upgrading Existing Workspaces to UNLIMITED](#upgrading-existing-workspaces-to-unlimited)
3. [Two Models for AI Credits](#two-models-for-ai-credits)
4. [Implementation Recommendations](#implementation-recommendations)

---

## How AI Credits Work in Typebot

### Current Architecture (Default Typebot)

**AI integrations in Typebot use a "Bring Your Own Key" (BYOK) model:**

1. **Users provide their own API keys**
   - OpenAI API key
   - Anthropic API key
   - Mistral AI key
   - ElevenLabs key
   - etc.

2. **Keys are stored per workspace**
   - Location: Settings → Credentials
   - Encrypted in database (`Credentials` table)
   - Each workspace has its own credentials

3. **Users pay AI providers directly**
   - OpenAI charges the user's OpenAI account
   - Anthropic charges the user's Anthropic account
   - You (the platform owner) don't handle AI billing

### Where AI Keys Are Used

**AI Blocks** (in `/packages/forge/blocks/`):
- `openai-block` - GPT-3.5, GPT-4, GPT-4o, Assistants API
- `anthropic-block` - Claude models
- `mistral-block` - Mistral AI models
- `elevenlabs-block` - Text-to-speech
- `deepseek-block` - DeepSeek models
- `together-ai-block` - Together AI models
- `groq-block` - Groq inference
- `perplexity-block` - Perplexity AI
- `open-router-block` - OpenRouter (aggregator)

Each block requires the user to input their API key.

---

## Upgrading Existing Workspaces to UNLIMITED

### Problem

Even with `DEFAULT_WORKSPACE_PLAN=UNLIMITED` in `.env`, **existing workspaces** in your database are still on FREE/STARTER/PRO plans.

### Solution: Database Update

#### Option 1: SQL Script (Recommended)

```bash
# Connect to your PostgreSQL database
psql postgresql://postgres:typebot@localhost:5432/typebot

# Run the upgrade script
\i scripts/upgrade-workspaces-to-unlimited.sql

# Or run directly:
UPDATE "Workspace"
SET
  plan = 'UNLIMITED',
  "isQuarantined" = false,
  "isSuspended" = false,
  "isPastDue" = false
WHERE plan IN ('FREE', 'STARTER', 'PRO');
```

#### Option 2: One-Liner

```bash
psql $DATABASE_URL -c "UPDATE \"Workspace\" SET plan = 'UNLIMITED' WHERE plan IN ('FREE', 'STARTER', 'PRO');"
```

#### Option 3: Using a Database GUI

If you're using a database GUI (pgAdmin, TablePlus, DBeaver):

1. Connect to your database
2. Open SQL query editor
3. Run:
   ```sql
   UPDATE "Workspace"
   SET plan = 'UNLIMITED'
   WHERE plan IN ('FREE', 'STARTER', 'PRO');
   ```

### Verify the Update

```sql
-- Check all workspaces
SELECT id, name, plan, "createdAt"
FROM "Workspace"
ORDER BY "createdAt" DESC;

-- Count by plan
SELECT plan, COUNT(*) as count
FROM "Workspace"
GROUP BY plan;
```

You should see all workspaces now have `plan = 'UNLIMITED'`.

---

## Two Models for AI Credits

Since you're selling this as a custom solution to companies, you have two options:

### Model 1: Client Manages Their Own AI Credits (Current Default) ✅

**How It Works:**
- Each client provides their own OpenAI/Anthropic API keys
- They pay AI providers directly
- You don't handle AI billing
- You charge only for:
  - Platform access (fixed fee)
  - Hosting/maintenance (fixed fee)
  - Support (fixed fee)

**Pros:**
- ✅ Simple to implement (already works this way)
- ✅ No AI billing complexity for you
- ✅ Clients have full control and transparency
- ✅ No risk of AI costs exceeding what you charge

**Cons:**
- ❌ Clients need to manage multiple accounts (your platform + AI providers)
- ❌ Less convenient for non-technical clients

**Best For:**
- Technical clients (developers, IT teams)
- Clients with existing AI provider accounts
- Enterprise clients who want control

### Model 2: You Manage AI Credits (Reseller Model) 🔄

**How It Works:**
- You provide a master OpenAI/Anthropic API key
- All clients use your API keys
- You track usage per workspace
- You charge clients for AI usage (with markup)

**Implementation Required:**
1. **Usage Tracking System**
   - Track API calls per workspace
   - Store token usage in database
   - Calculate costs

2. **Billing System**
   - Charge clients monthly for AI usage
   - Include markup (e.g., $0.002/1K tokens instead of $0.0015)
   - Separate billing from platform fees

3. **Credit Limits**
   - Set per-workspace monthly limits
   - Block/throttle when limit reached
   - Alert notifications

**Pros:**
- ✅ More convenient for clients (one bill)
- ✅ Additional revenue stream (markup on AI costs)
- ✅ Better for non-technical clients

**Cons:**
- ❌ Complex to implement
- ❌ You bear the AI cost risk
- ❌ Need to handle chargebacks/disputes
- ❌ Requires payment gateway integration

**Best For:**
- Non-technical clients
- Clients who want a fully managed solution
- When you want to monetize AI usage

---

## Implementation Recommendations

### For Your Use Case (Selling to Companies)

I recommend **starting with Model 1** (Client Manages):

**Why:**
1. Already implemented ✅
2. No development needed ✅
3. No financial risk ✅
4. Companies usually have procurement for cloud services
5. Transparent cost structure

**Your Pricing Model Could Be:**
```
Platform Fee: $X/month per company
- Unlimited chatbot creation
- Unlimited chat executions
- Custom branding
- Hosting & maintenance
- Support

AI Costs: Client pays directly to OpenAI/Anthropic
- Client provides their own API keys
- Full transparency on AI usage
- No markup, direct pricing
```

### Future: Hybrid Model

As you grow, offer both:

**Tier 1: Bring Your Own Key**
- Client manages AI credits
- Lower platform fee
- Best for technical teams

**Tier 2: Fully Managed**
- You provide AI credits
- Higher platform fee (includes AI markup)
- Best for non-technical teams

---

## How to Configure for Each Model

### Model 1: Client Manages (Current Setup)

**Environment Variables** (Already set):
```bash
DEFAULT_WORKSPACE_PLAN=UNLIMITED
DISABLE_BILLING=true
BILLING_MODE=UNLIMITED
```

**Client Setup Process:**
1. Client signs up
2. Goes to Settings → Credentials
3. Adds their OpenAI API key
4. Adds their Anthropic API key (if using Claude)
5. Creates chatbots with AI blocks

**Your Revenue:**
- Monthly platform fee per client
- Optional: Setup/onboarding fee
- Optional: Custom development/support

### Model 2: You Manage (Future Implementation)

**Would Require:**

1. **Shared API Keys** (in `.env`):
   ```bash
   OPENAI_API_KEY=sk-your-master-key
   ANTHROPIC_API_KEY=sk-ant-your-master-key
   ```

2. **Usage Tracking** (new code needed):
   ```typescript
   // Track every AI API call
   interface AIUsage {
     workspaceId: string
     model: string
     tokensUsed: number
     cost: number
     timestamp: Date
   }
   ```

3. **Credit System** (new package needed):
   ```typescript
   // packages/ai-credits/
   - trackUsage()
   - checkLimit()
   - calculateCost()
   - chargeWorkspace()
   ```

4. **Billing Integration**:
   - Monthly invoices for AI usage
   - Payment collection
   - Usage dashboards

**Not currently implemented** - would be a significant development effort.

---

## Database Schema Reference

### Current Workspace Model

```prisma
model Workspace {
  id          String   @id @default(cuid())
  name        String
  plan        Plan     @default(FREE)  // FREE, STARTER, PRO, UNLIMITED, etc.

  // Billing fields
  stripeId                String?   // Stripe customer (null for UNLIMITED)
  additionalChatsIndex    Int       @default(0)
  chatsLimitFirstEmailSentAt  DateTime?
  chatsLimitSecondEmailSentAt DateTime?

  // Status flags
  isQuarantined           Boolean  @default(false)
  isSuspended             Boolean  @default(false)
  isPastDue               Boolean  @default(false)

  // Custom limits (for custom plans)
  customChatsLimit        Int?
  customStorageLimit      Int?
  customSeatsLimit        Int?

  members     MemberInWorkspace[]
  typebots    Typebot[]
  credentials Credentials[]
}

enum Plan {
  FREE
  STARTER
  PRO
  LIFETIME
  OFFERED
  CUSTOM
  UNLIMITED    // ← Your target plan
  ENTERPRISE
}
```

### Credentials Model (For AI Keys)

```prisma
model Credentials {
  id          String    @id @default(cuid())
  workspaceId String
  name        String
  type        String    // 'openai', 'anthropic', 'elevenlabs', etc.
  value       String    // Encrypted API key
  iv          String    // Encryption IV

  workspace   Workspace @relation(fields: [workspaceId])
}
```

Users add credentials via UI, stored encrypted in this table.

---

## Quick Reference Commands

### Check Workspace Plans

```bash
# Connect to database
psql $DATABASE_URL

# List all workspaces with their plans
SELECT name, plan, "isQuarantined", "createdAt"
FROM "Workspace"
ORDER BY "createdAt" DESC;
```

### Upgrade Single Workspace

```sql
-- By workspace name
UPDATE "Workspace"
SET plan = 'UNLIMITED'
WHERE name = 'My Workspace';

-- By workspace ID
UPDATE "Workspace"
SET plan = 'UNLIMITED'
WHERE id = 'clx123abc';
```

### Bulk Upgrade All Workspaces

```sql
UPDATE "Workspace"
SET plan = 'UNLIMITED'
WHERE plan != 'UNLIMITED';
```

### Check Credentials

```sql
-- See what AI keys are configured
SELECT w.name, c.type, c.name
FROM "Credentials" c
JOIN "Workspace" w ON c."workspaceId" = w.id
ORDER BY w.name;
```

---

## Summary

### Current State
- ✅ AI credits managed by clients (BYOK model)
- ✅ UNLIMITED plan available
- ✅ Billing can be disabled
- ⏳ Need to upgrade existing workspaces to UNLIMITED

### Action Items

1. **Immediate** (Already Done):
   - ✅ `.env` configured with `DEFAULT_WORKSPACE_PLAN=UNLIMITED`
   - ✅ Branding updated to InnoBot

2. **Run This Next** (Upgrade Existing Workspaces):
   ```bash
   psql $DATABASE_URL -c "UPDATE \"Workspace\" SET plan = 'UNLIMITED' WHERE plan IN ('FREE', 'STARTER', 'PRO');"
   ```

3. **Client Onboarding** (Document This):
   - Client signs up → Gets UNLIMITED workspace
   - Client adds OpenAI API key in Settings → Credentials
   - Client creates chatbots with AI blocks
   - Client pays OpenAI directly for usage

4. **Your Revenue Model**:
   - Charge monthly platform fee
   - No AI credit markup (cleaner, simpler)
   - Focus on value: hosting, branding, support

---

## Questions & Answers

### Q: Do I need to implement AI credit tracking?
**A:** No, not if using Model 1 (clients manage their own keys). Clients pay OpenAI/Anthropic directly.

### Q: How do I know how much AI my clients are using?
**A:** You don't, unless you implement tracking. Clients can see their usage in their OpenAI/Anthropic dashboards.

### Q: Can I charge clients for AI usage?
**A:** Not with current setup. You'd need to implement Model 2 (significant development).

### Q: What if a client exceeds their AI budget?
**A:** They manage this with their AI provider. OpenAI will notify them if they hit limits.

### Q: Can different workspaces use different AI keys?
**A:** Yes! Each workspace has its own credentials. Workspace A uses their OpenAI key, Workspace B uses theirs.

---

**Recommendation:** Use Model 1 (client-managed) initially. It's simpler, already implemented, and common in B2B SaaS. Focus on your value: white-labeled platform, hosting, and support.

---

**Last Updated**: 2025-12-25
**Status**: Model 1 (BYOK) - Production Ready
**Model 2 (Managed)**: Not Implemented
