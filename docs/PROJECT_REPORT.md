# Dhaal (Civic Shield): Project Report

**GitHub Repository:** `https://github.com/500ka/Dhaal`

---

## 1. Executive Summary

**Dhaal** is a next-generation civic grievance redressal platform designed to bridge the communication gap between citizens and municipal authorities. By leveraging **Generative AI (Gemini 1.5 Flash)** and **Voice Technology**, Dhaal automates the classification, prioritization, and geolocation of civic issues. The project addresses the critical need for a faster, more accessible, and transparent system for reporting infrastructure failures like potholes, garbage dumps, and fire hazards.

This report details the motivation, architectural design, implementation, and future potential of Dhaal.

---

## 2. Introduction

Rapid urbanization has led to increasing civic challenges, yet the mechanisms for reporting these issues remain archaic. Traditional helplines are often unresponsive, and existing apps are text-heavy, creating a barrier for the digital illiterate. Dhaal aims to solve this by introducing a **"See it, Say it, Solve it"** approach, where users can report issues using just an image or a voice command in their native language (e.g., Hindi).

---

## 3. Problem Statement

### The Challenges:
1.  **Complexity:** Reporting forms require manual entry of addresses, categories, and descriptions, widely discouraging participation.
2.  **Language Barrier:** Most civic apps are English-first, alienating a large demographic in India.
3.  **Data Overload:** Authorities are flooded with unverified, duplicate, or vague reports without severity context.
4.  **Lack of Transparency:** Citizens rarely receive updates on their reports, leading to lack of trust.

### The Opportunity:
To use **AI** to simplify input (Image/Voice) and **Machine Learning** to filter output for authorities (Severity Scoring).

---

## 4. Proposed Solution & Architecture

Dhaal operates on a **modern web architecture** focusing on mobile-first usability and AI integration.

### High-Level Architecture:
1.  **Input Layer:**
    *   **Camera:** Captures evidence.
    *   **Microphone:** Captures voice commands (supports Hindi/English).
    *   **GPS:** Auto-tags location.
2.  **Processing Layer (The "Brain"):**
    *   **Google Gemini 1.5 Flash:** Analyzes image content to detect category (e.g., "Fire") and assign a **Severity Score (1-10)**.
    *   **Natural Language Processing (NLP):** Transcribes and translates voice inputs to structured text.
3.  **Data Layer:**
    *   **Supabase (PostgreSQL):** Stores reports, user profiles, and geolocation data.
    *   **Edge Functions:** Handles server-side logic for security.
4.  **Presentation Layer:**
    *   **Citizen App:** Feed, Map, Gamification Dashboard.
    *   **WhatsApp Integration:** Quick reporting link.

---

## 5. Key Features Implemented

### 📸 AI-Powered Auto-Reporting
Users simply upload a photo. The system uses **Gemini AI** to:
*   Identify the issue (e.g., "Overflowing Garbage Bin").
*   Draft a description.
*   Assign a severity score (e.g., 8/10 for Fire, 3/10 for Graffiti).

### 🎙️ Bilingual Voice Reporting
Recognizing the linguistic diversity of India, Dhaal supports **Hindi and English** voice input. A user can simply say *"Yahan bohot kachra hai"* (There is a lot of garbage here), and the system detects the keyword "Kachra" to categorize it as "Garbage".

### 📍 Live Geospatial Map
A real-time heatmap powered by **Leaflet Maps** visualizes issues. Markers are color-coded by severity:
*   🔴 **Red:** Critical (Accidents, Fire)
*   🟠 **Orange:** Moderate (Potholes)
*   🟢 **Green:** Minor (Litter)

### 💬 WhatsApp Integration
Recognizing that not everyone wants to install an app, Dhaal includes a **floating WhatsApp button** that pre-fills a message with location data, allowing instant reporting via the world's most popular chat app.

### 🛡️ Community Defense (Gamification)
To encourage participation, users earn **Karma Points (XP)** for every verified report. A leaderboard fosters a sense of competition and civic duty. Other users can **"Upvote"** reports to verify their authenticity.

---

## 6. Technology Stack

| Component | Technology Used | Reasoning |
|-----------|----------------|-----------|
| **Frontend** | React 19, Next.js 14 | Performance, Server-Side Rendering (SSR). |
| **Styling** | Tailwind CSS v4 | Rapid UI development, maintainability. |
| **AI Model** | Google Gemini 1.5 Flash | Multimodal capabilities (Text + Image), speed. |
| **Database** | Supabase (PostgreSQL) | Realtime subscriptions, robust SQL support. |
| **Mapping** | Leaflet + OpenStreetMap | Lightweight, open-source mapping. |
| **Auth** | Supabase Auth | Secure, scalable user management. |

---

## 7. Implementation Highlights

### 7.1 The AI Analysis Pipeline
We implemented a server action that sends the base64 image to Gemini.
*Code Construct:*
```typescript
const prompt = "Analyze this image for civic issues. Return JSON with category, severity (1-10), and description.";
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent([prompt, imagePart]);
```

### 7.2 Voice Intent Detection
A custom hook `useVoiceInput` listens for specific keywords in the transcript.
*   *English Keywords:* "Fire", "Accident", "Pothole"
*   *Hindi Keywords:* "Aag", "Takkar", "Gaddha"

### 7.3 Responsive Design
The UI utilizes a **"Glassmorphism"** aesthetic effectively in Dark Mode, ensuring the app looks premium and modern. It adapts seamlessly between Desktop (Grid View) and Mobile (Swipe/Tab View).

---

## 8. Future Scope

1.  **Govt. API Application:** Integration with backend systems of municipal corporations for direct ticket creation.
2.  **Offline-First Architecture:** Using PWA service workers to allow reporting without active internet (sync when online).
3.  **Video Analysis:** Support for video uploads to capture dynamic issues like leaking pipes or traffic violations.
4.  **Admin Dashboard:** A specialized command center for authorities to dispatch teams based on heatmap clusters.

---

## 9. Conclusion

Dhaal is more than just an app; it is a **technological intervention** in civic governance. By lowering the barrier to entry for reporting and increasing the quality of data for authorities, Dhaal creates a positive feedback loop that leads to safer, cleaner, and smarter cities.

**GitHub Repository:** `[Insert GitHub Link]`
