# PLAN: Voice Reporting & Community Defense

## 🎯 Objective
Empower citizens with accessibility tools (Voice/WhatsApp) and social features (Upvotes/Sharing) to increase report volume and community engagement, maintaining a premium "Dark Mode" aesthetic.

## 📦 Features to Build

### 1. AI Voice Reporting (Accessibility) 🎙️
- **Voice Input:** Use browser `SpeechRecognition` API.
- **Bilingual Support:** 
  - Detects Hindi words ("Aag", "Sadak", "Pani").
  - Auto-translates Basic Hindi Intent -> English Category (e.g., "Sadak kharab hai" -> "Pothole").
- **Auto-Fill:** Text-to-Intent parsing to extract:
  - Category (Fire/Aag, Pothole/Gaddha)
  - Location name (if spoken)
- **UI:** Floating "Mic" button with pulsing animation.

### 2. WhatsApp Integration (Quick Report) 💬
- **WhatsApp Button:** "Report via WhatsApp" floating action.
- **Action:** Opens `wa.me/DhaalOfficial?text=I want to report...`
- **Simulation:** Pre-filled message template.

### 3. Community Defense (Social) 🛡️
- **"Me Too" Upvote:** One-tap verification for reports.
- **Share Cards:** "Generate Story" button that creates a visually stunning image of the report (using HTML Canvas or CSS screenshot).
- **Impact Badge:** "50 people verified this" visual indicator.

## 🛠️ Tech Stack & Strategy
- **Frontend:** React (Next.js), Lucide Icons, Browser Speech API.
- **State Management:** React Context / Local State.
- **Styling:** Tailwind CSS (Glassmorphism, Neon Accents).
- **Backend:** Supabase (for Upvote counters).

## 📅 Implementation Steps

### Phase 1: Voice & WhatsApp (Accessibility)
1. **Create `VoiceRecorder` Component:**
   - Handle Microphone permissions.
   - Speech-to-Text visualizer (waveform animation).
2. **Integrate into `NewReportModal`:**
   - "Tap to Speak" button filling the description field.
3. **Add `WhatsAppButton`:**
   - Fixed side/bottom button for instant external reporting.

### Phase 2: Community Features (Social)
4. **Update `ReportCard`:**
   - Add `<UpvoteButton />` with animation.
   - Add `<ShareButton />` triggering native share sheet or clipboard.
5. **Create `ShareCardGenerator`:**
   - Hidden UI element that renders the "Instagram Story" layout.
   - Function to export as image (mock/download).

### Phase 3: Polish & Animation
6. **Micro-interactions:**
   - Heart confetti on Upvote.
   - Pulsing ring on Voice Record.
   - Slide-in animations for Share sheet.

## 🧪 Verification Plan
- **Test:** Verify Speech API works on Chrome/Edge.
- **Test:** Verify WhatsApp link opens correctly.
- **Test:** Verify Upvote allows 1 vote per session/user.

---
**Status:** Waiting for User Approval.
