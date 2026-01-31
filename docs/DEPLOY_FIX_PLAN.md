
# Plan: Deployment Fix & Enhancements

## Task Overview
This plan addresses the user's urgent need to fix the Vercel deployment ("get me the link" failing) while also incorporating the previously planned enhancements. The user has authorized "all" actions.

**Primary Goal:** Fix deployment URL/configuration issues.
**Secondary Goal:** Execute pending enhancements (Auth context, Voice Translation).

## Project Type
**WEB** (Next.js 14 + Supabase + Tailwind + Gemini AI)

## Success Criteria
1.  **Deployment URL**: The app correctly handles dynamic Vercel URLs (no hardcoded `dhaal.vercel.app` which breaks metadata/sitemaps on other deployments).
2.  **Environment Variables**: User is guided to set up `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY` on Vercel.
3.  **App Functionality**: Reporting works (Auth context fixed).
4.  **Enhancement**: Voice input auto-translates Hindi -> English.

## Tech Stack
-   **Framework**: Next.js 14 App Router
-   **Deployment**: Vercel
-   **Database**: Supabase
-   **AI**: Gemini 1.5 Flash

## File Structure Update
-   `web/app/sitemap.ts`: Update to dynamic URL.
-   `web/app/layout.tsx`: Update metadataBase to dynamic.
-   `web/lib/config.ts`: (New) Centralized config for URL resolution.

## Task Breakdown

### Phase 1: Deployment Repair (P0 - Critical)
1.  **Create Config Utility**
    *   **Agent**: `backend-specialist`
    *   **Task**: Create `web/lib/url-config.ts` to determine base URL (prioritize `NEXT_PUBLIC_VERCEL_URL` -> `VERCEL_URL` -> `localhost`).
    *   **Verify**: Import in sitemap/layout does not error.

2.  **Fix Metadata & Sitemap**
    *   **Agent**: `frontend-specialist`
    *   **Task**: 
        *   Update `web/app/layout.tsx` to use `metadataBase` from config.
        *   Update `web/app/sitemap.ts` to use config for base URL.
        *   Update `web/app/robots.ts` similarly.
    *   **Verify**: Build passes.

3.  **Environment Variable Check Script**
    *   **Agent**: `devops-engineer`
    *   **Task**: Create `web/scripts/check-env.js` that runs on build to warn if critical vars are missing (Supabase/Gemini).
    *   **Verify**: Run `npm run build` locally and see checks pass.

### Phase 2: Core Enhancements (P1)
4.  **Auth Context in Reports**
    *   **Agent**: `backend-specialist`
    *   **Task**: Update `web/app/actions/submit-report.ts` to read Supabase session. If user exists, add `user_id`.
    *   **Verify**: Submit report while logged in -> Supabase row has `user_id`.

5.  **Hindi-English Translation Action**
    *   **Agent**: `backend-specialist`
    *   **Task**: Create `web/app/actions/translate.ts` using Gemini.
    *   **Input**: Text string + target lang (English).
    *   **Output**: Translated string.
    *   **Verify**: Unit test with "Mera naam Dhaal hai" -> "My name is Dhaal".

6.  **Integrate Translation in UI**
    *   **Agent**: `frontend-specialist`
    *   **Task**: Update `NewReportModal` in `web/components/feed/new-report-modal.tsx`. Call translate action if input is detected as Hindi (or user toggles "Voice Input").
    *   **Verify**: Voice input fills description in English.

### Phase X: Final Verification
-   [x] **Build**: `npm run build` (Ensures TypeCheck passes).
-   [x] **Lint**: `npm run lint` (Zero errors).
-   [x] **Security**: `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`
-   [ ] **SEO**: `python .agent/scripts/checklist.py --only seo` (Start server first).

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass (10 warnings, 0 errors)
- Security: ✅ No critical issues (False positives on lock files because we use npm)
- Build: ✅ Success
- Tests: ✅ Passed (Translate action validated)
- Date: 2026-01-31

## Execution Order
1.  Phase 1 (Fix Deployment)
2.  Phase 2 (Enhancements)
3.  Phase X (Verify)
