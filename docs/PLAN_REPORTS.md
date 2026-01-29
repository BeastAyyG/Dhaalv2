# PLAN: Report Seeding & Verification

## 1. Objective
Insert two specific anonymous reports (Gas Leak, Fire) using user-provided imagery and mathematically verify that the "Anonymous Reporting" feature is active and functional.

## 2. Assets
- **Gas Leak:** `public/seed/gas_leak.png`
- **Fire:** `public/seed/building_fire.png`

## 3. Implementation Steps (Phase 2)

### Step A: Database Seeding (`backend-specialist`)
- Create a script `scripts/seed_demo_reports.ts`.
- Logic:
    1. Read images from `public/seed`.
    2. Convert to Blob/File format.
    3. Invoke `submitReportAction` (or direct DB insert if Action is bound to browser state).
    4. **Crucial:** Ensure `user_id` is passed as `null` to enforce anonymity.
    5. Set accurate lat/lng for "Gas Leak" (Industrial Area) and "Fire" (City Center) for demo visualization.

### Step B: Anonymous Verification (`test-engineer`)
- Create a script `scripts/verify_anonymous_mode.ts`.
- Logic:
    1. Check `supabase.from('reports').select('*').is('user_id', null)`.
    2. Count anonymous reports.
    3. Verify that the RLS policy allows `insert` on public role.
    4. Output a "PASS/FAIL" matrix.

## 4. Verification
- Run `npx tsx scripts/seed_demo_reports.ts`
- Run `npx tsx scripts/verify_anonymous_mode.ts`
