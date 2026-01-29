# PLAN: Final System Verification

## 1. Objective
Perform a comprehensive check of the Dhaal application to ensure the recent "Gas Leak" and "Fire" reports are correctly represented, anonymous reporting is structurally sound, and the logo integration is consistent.

## 2. Orchestration Tasks

### A. Data Integrity (`backend-specialist`)
- Verify the specific IDs created in the last step.
- Confirm exactly which fields are populated for the "Gas Leak" and "Building Fire" reports.
- Verify `is_emergency` logic (even if column is missing, does the frontend handle it?).

### B. UI/UX Verification (`frontend-specialist`)
- Inspect `ReportCard` and `NewReportModal` to ensure the logic handles the "No Image" state gracefully (fallback to logo).
- Verify the category names match exactly: "Gas Leak" and "Fire / Explosion".

### C. Security & Standards (`test-engineer`)
- Run `npm run lint` (Completed in last turn, will verify summary).
- Run `security_scan.py` (MANDATORY per protocol).
- Verify `.env.local` safety (no secrets leaked in codebase).

## 3. Deliverables
- Final Verification Report.
- Confirmation of "Anonymous" status for the specific seed data.
