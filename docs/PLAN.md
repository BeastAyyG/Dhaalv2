# Dhaal Mega Enhancement Plan

## 🎯 Overview
Transform Dhaal into a premium, feature-complete civic reporting platform with 7 major enhancements.

---

## 📋 Feature Priority Matrix

| Phase | Feature | Impact | Effort | Priority |
|-------|---------|--------|--------|----------|
| 1 | 🎨 UI Redesign | High | Medium | P0 |
| 1 | 🗺️ Advanced Map | High | Low | P0 |
| 2 | 👮 Officer Dashboard | High | High | P1 |
| 2 | 🏆 Gamification | Medium | Medium | P1 |
| 3 | 📊 Analytics Page | Medium | Medium | P2 |
| 3 | 🔔 Notifications | Medium | High | P2 |
| 4 | 🌐 Multi-language | Low | Low | P3 |

---

## 🎨 Phase 1: UI Redesign + Advanced Map

### Design System

**Colors:**
- Primary: `#10B981` (Emerald) - Trust, Growth
- Accent: `#3B82F6` (Blue) - Government, Official
- Danger: `#EF4444` (Red) - High severity
- Warning: `#F59E0B` (Amber) - Medium severity
- Success: `#22C55E` (Green) - Resolved/Low severity
- Dark BG: `#0A0A0B` - Premium dark mode
- Glass: `rgba(255,255,255,0.05)` - Glassmorphism

**Typography:**
- Headings: Inter (700, 600)
- Body: Inter (400)
- Mono: JetBrains Mono (stats)

**Effects:**
- Glassmorphism cards with subtle borders
- Smooth 300ms transitions
- Micro-animations on interactions
- Gradient accents

### Files to Create/Modify (Phase 1):
1. `app/globals.css` - Design tokens, animations
2. `components/ui/glass-card.tsx` - Reusable glass card
3. `components/ui/severity-badge.tsx` - Colored badges
4. `components/feed/report-card.tsx` - Redesign
5. `components/map/map-view.tsx` - Clustering, filters
6. `app/client-home.tsx` - Layout redesign
7. `components/ui/header.tsx` - Premium header

---

## 👮 Phase 2: Officer Dashboard + Gamification

### Officer Dashboard Features:
- Protected `/officer` route
- List all reports with filters
- Update report status (OPEN → IN_PROGRESS → RESOLVED)
- View analytics summary
- Assign priority

### Gamification Features:
- XP points for actions
- Levels (Citizen → Guardian → Champion)
- Badges (First Report, 10 Reports, etc.)
- Leaderboard component
- Profile page with stats

### Files to Create (Phase 2):
1. `app/officer/page.tsx` - Dashboard
2. `app/officer/layout.tsx` - Officer layout
3. `components/officer/report-table.tsx` - Data table
4. `components/officer/stats-cards.tsx` - Summary stats
5. `lib/gamification.ts` - XP/Level logic
6. `components/profile/badges.tsx` - Badge display
7. `components/leaderboard/index.tsx` - Leaderboard
8. `app/profile/page.tsx` - User profile

### Database Updates:
```sql
-- Add gamification columns
ALTER TABLE reports ADD COLUMN officer_id uuid;
ALTER TABLE reports ADD COLUMN priority text DEFAULT 'NORMAL';

-- Create users table for gamification
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE,
  name text,
  xp int DEFAULT 0,
  level int DEFAULT 1,
  badges text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
```

---

## 📊 Phase 3: Analytics + Notifications

### Analytics Features:
- Reports by category (pie chart)
- Reports over time (line chart)
- Resolution rate (progress bar)
- Heatmap of issues by area

### Notifications Features:
- Push notifications setup
- Status change alerts
- Weekly digest email (future)

### Files to Create:
1. `app/analytics/page.tsx` - Charts page
2. `components/charts/category-pie.tsx`
3. `components/charts/trend-line.tsx`
4. `components/charts/resolution-progress.tsx`
5. `lib/notifications.ts` - Push notification logic

---

## 🌐 Phase 4: Multi-language

### i18n Setup:
- `lib/i18n/en.json` - English strings
- `lib/i18n/hi.json` - Hindi strings
- Language toggle in header
- Persist preference to localStorage

---

## 📁 Final File Structure

```
web/
├── app/
│   ├── page.tsx (enhanced home)
│   ├── client-home.tsx (redesigned)
│   ├── officer/
│   │   ├── page.tsx (dashboard)
│   │   └── layout.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   └── login/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── glass-card.tsx
│   │   ├── severity-badge.tsx
│   │   ├── header.tsx
│   │   └── language-toggle.tsx
│   ├── feed/
│   │   ├── report-card.tsx (redesigned)
│   │   └── new-report-modal.tsx
│   ├── map/
│   │   └── map-view.tsx (enhanced)
│   ├── officer/
│   │   ├── report-table.tsx
│   │   └── stats-cards.tsx
│   ├── charts/
│   │   ├── category-pie.tsx
│   │   └── trend-line.tsx
│   └── profile/
│       ├── badges.tsx
│       └── level-progress.tsx
└── lib/
    ├── gamification.ts
    ├── notifications.ts
    └── i18n/
        ├── en.json
        └── hi.json
```

---

## ⏱️ Estimated Time

| Phase | Features | Time |
|-------|----------|------|
| 1 | UI + Map | ~20 min |
| 2 | Officer + Gamification | ~25 min |
| 3 | Analytics + Notifications | ~15 min |
| 4 | Multi-language | ~10 min |
| **Total** | | **~70 min** |

---

## ✅ Approval Required

**Proceed with Phase 1 first?** (Y/N)

This plan will be executed in phases, with commits after each phase.
