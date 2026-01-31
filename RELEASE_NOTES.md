# v0.2.0 - Officials Access & Public Timeline

### 🚨 Major Feature Update: The Officials Console
This release introduces the **Dhaal Officials Interface**, a dedicated workspace for government officials to respond to citizen reports.

#### 🚀 New Features
*   **Officials Work Console**: A dedicated, secure dashboard (`/officer`) for verifying and resolving issues.
*   **Geospatial Report Scanner**: Officials can now scan for active reports within a **5km radius** of their current GPS location.
*   **Role-Based Access Control (RBAC)**: Strict segregation of duties:
    *   `Citizen`: Can report and comment.
    *   `Official`: Can claim reports and post official updates.
*   **Official Updates Timeline**: A new section on the public report page showing official actions (e.g., "Investigation Started", "Work in Progress", "Resolved") with distinctive blue/green badges.
*   **AI Bypass for Officials**: Updates posted by officials skip the AI verification pipeline for immediate publication.

#### 🛠 Technical Improvements
*   **Database Schema**: Added `user_role` enum, `report_assignments`, and `report_updates` tables.
*   **Middleware Security**: Route protection for `/officer/*` paths based on user role.
*   **Performance**: Optimized geospatial queries (currently using bounding box approximation ahead of full PostGIS implementation).

#### 🧪 Testing
*   Added `/dev` route for developers to self-promote to an Official role for testing purposes.

---

**Full Changelog**: https://github.com/BeastAyyG/Dhaalv2/compare/v0.1.0...v0.2.0
