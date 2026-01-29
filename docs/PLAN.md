# Plan: Dhaal V2 Enhancements

## Task Overview
1.  **Anonymous Reporting**: Explicitly handle "Anonymous" vs "Logged In" reports.
2.  **Voice Translation**: Implement auto-translation of Hindi voice input to English description.
3.  **Optimization**: Review and optimize critical paths.

## Phase 1: Anonymous & Authenticated Reporting
- **Current State**: All reports are anonymous (missing `user_id`).
- **Target State**: 
    - If user is logged in -> `user_id` is saved.
    - If anonymous -> `user_id` is NULL.
- **Action**: Update `app/actions/submit-report.ts` to read session.

## Phase 2: Hindi -> English Translation (Voice)
- **Current State**: `VoiceInput` produces Hindi text if selected. Appended as-is.
- **Problem**: Creates mixed language reports.
- **Target State**: 
    - If input is Hindi, translate to English using Gemini (fast model).
    - Append English text to description.
    - Preserve original Hindi in a separate field? (Maybe unnecessary for now).
- **Action**: 
    - Create `app/actions/translate.ts`.
    - Update `NewReportModal` to call translate before appending.

## Phase 3: Optimizations
- **Review**: `VoiceInput` language setting bug (already spotted: `recognition.lang` not set).
- **Optimization**: Memoize heavy components if needed.
- **Error Handling**: Add better feedback for translation failures.

## Execution Order
1.  Backend: Update `submit-report.ts` (Auth).
2.  Backend: Create `translate.ts` (Gemini).
3.  Frontend: Fix `VoiceInput` language bug & Integrate Translation in `NewReportModal`.
4.  Verification.
