# Plan: Officials Access & Progress Updates

## Overview
Enable "Lower Level Officials" to access the application with strict segregation from normal users. Officials will have a dedicated workspace to view assigned tasks, claim reports, and post progress updates (photos/text) that are bypass the AI analysis pipeline.

## Project Type
**WEB** (Next.js, Supabase, Tailwind)

## Success Criteria
1.  **Role Segregation**: Users can be `citizen` or `official`. Officials have exclusive access to `/officer` routes.
2.  **Work Console**: Officials can see a list of reports and "Claim" them.
3.  **Progress Updates**: Officials can post photos/updates to a report. These appear in the report detail but are NOT sent to Gemini for analysis.
4.  **Public Visibility**: Citizens can see "Official Updates" on the report page.

## Tech Stack
-   **Database**: Supabase (PostgreSQL)
-   **Auth**: Supabase Auth (Middleware RBAC)
-   **Frontend**: Next.js 14 (App Router), Tailwind CSS
-   **State**: Server Actions

## File Structure & Changes
```
web/
├── supabase/
│   └── migrations/
│       └── [timestamp]_officer_schema.sql  # NEW: Roles, Assignments, Updates tables
├── middleware.ts                           # UPDATE: Role-based route protection
├── lib/
│   └── auth/
│       └── role-check.ts                   # NEW: Utility for role verification
├── app/
│   ├── officer/                            # NEW: Dedicated Officials Section
│   │   ├── layout.tsx                      # Distinct layout (Task Force theme)
│   │   ├── page.tsx                        # Dashboard (My Tasks / Nearby)
│   │   └── reports/
│   │       └── [id]/
│   │           └── page.tsx                # Work Console (Claim/Update actions)
│   └── reports/
│       └── [id]/
│           └── page.tsx                    # UPDATE: Display Official Updates timeline
└── components/
    └── officer/                            # NEW: Officer-specific components
        ├── available-report-card.tsx
        ├── progress-update-form.tsx
        └── status-toggle.tsx
```

## Task Breakdown

### Phase 1: Foundation (Database & Auth)
**Agent**: `database-architect` | **Skill**: `database-design`

- [ ] **Task 1.1: Create Officer Schema Migration**
    -   **Input**: `supabase_schema.sql`
    -   **Action**:
        -   Create `user_role` enum ('citizen', 'official', 'admin').
        -   Add `role` column to `users` table default 'citizen'.
        -   Create `report_assignments` table (report_id, officer_id, assigned_at).
        -   Create `report_updates` table (report_id, officer_id, image_url, description, type).
        -   Add RLS policies: Officials can insert updates; Everyone can read updates.
    -   **Output**: `web/supabase/migrations/20240131_officer_schema.sql`
    -   **Verify**: Run migration, check tables exist.

- [ ] **Task 1.2: Update Types**
    -   **Input**: `web/lib/types.ts`
    -   **Action**: Add `UserRole`, `ReportAssignment`, `ReportUpdate` interfaces.
    -   **Output**: Updated types file.
    -   **Verify**: `npm run type-check` passes.

### Phase 2: Core Logic (Backend)
**Agent**: `backend-specialist` | **Skill**: `nextjs-react-expert`

- [ ] **Task 2.1: Implement Role Middleware**
    -   **Input**: `web/middleware.ts`
    -   **Action**:
        -   Fetch user metadata/table on request.
        -   If route starts with `/officer` and role != 'official', redirect to `/login` or `/unauthorized`.
    -   **Output**: Updated `middleware.ts`.
    -   **Verify**: Accessing `/officer` as citizen redirects.

- [ ] **Task 2.2: Create Officer Actions**
    -   **Input**: New file `web/app/actions/officer.ts`
    -   **Action**:
        -   `claimReport(reportId)`: Insert into `report_assignments`.
        -   `postUpdate(reportId, formData)`: Upload image to storage, insert into `report_updates`.
    -   **Output**: Server actions file.
    -   **Verify**: Unit test actions with mock database.

### Phase 3: Officials Work Console (UI)
**Agent**: `frontend-specialist` | **Skill**: `frontend-design`

- [ ] **Task 3.1: Officer Layout & Dashboard**
    -   **Input**: `web/app/officer/layout.tsx`, `web/app/officer/page.tsx`
    -   **Action**:
        -   Create a "Task Force" themed layout (distinct from public site, maybe darker/serious/Civic Brutalism variant).
        -   Dashboard showing tabs: "My Assignments" vs "Unassigned Reports".
    -   **Output**: Functional Dashboard UI.
    -   **Verify**: Visual check.

- [ ] **Task 3.2: Work Console Implementation**
    -   **Input**: `web/app/officer/reports/[id]/page.tsx`
    -   **Action**:
        -   View Report Details (Read-only).
        -   "Claim" button (if unassigned).
        -   "Post Update" form (Image Upload + Description).
        -   "Mark Resolved" button.
    -   **Output**: Interactive Work Console.
    -   **Verify**: Can claim and post update.

### Phase 4: Public Visibility
**Agent**: `frontend-specialist` | **Skill**: `frontend-design`

- [ ] **Task 4.1: Display Official Updates**
    -   **Input**: `web/app/reports/[id]/page.tsx`
    -   **Action**:
        -   Fetch `report_updates` for the report.
        -   Render them in a timeline or "Official Response" section.
        -   Distinct styling to differentiate from user comments.
    -   **Output**: Updated Report Detail Page.
    -   **Verify**: Updates posted by officer appear on the public page.

## Phase X: Verification
- [ ] **Security Scan**: `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`
- [ ] **Lint**: `npm run lint`
- [ ] **Role Test**: access `/officer` as citizen -> 403/Redirect.
- [ ] **Flow Test**: Official claims report -> Posts photo -> Citizen sees photo.
