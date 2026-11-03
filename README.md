# AI Kids Shorts Trend Harvester & Script Generator (5-7s)

A modern, high-performance web tool built for creators producing **5-7 second AI-generated looping shorts** for toddlers and preschoolers (ages 2-6).

---

## 🚀 Key Features

1. **Trend & Hashtag Harvester**:
   - Queries YouTube Data API v3 for high-velocity trending kids animation shorts.
   - Filters by timeframe: **Last 24 Hours** vs **Past 7 Days**.
   - Categories: **Cute Animals**, **Color Learning**, **Funny Vehicles**, **Nursery Rhyme Fun**, **Surprise Eggs**.
   - Extracts top hashtags with occurrence frequency and lists reference benchmarking shorts with view counts and thumbnails.
   - Built-in persistent caching (3-hour TTL) to conserve API quotas.

2. **Kid-Safe AI Script & Prompt Generator**:
   - Strictly optimized for **5 to 7 second circular loops** (ending frame connects seamlessly back into the start).
   - Structured 3-step micro-timeline:
     - **0-2s Hook**: Scroll-stopping visual grabber.
     - **2-5s Action**: Sensory engagement & delightful interaction.
     - **5-7s Loop Payoff**: Zero-seam transition.
   - Production-ready prompts:
     - **Midjourney / Flux** Image Prompt with Pixar 3D styling (`--ar 9:16`).
     - **Kling / Runway Gen-3 / Pika** Motion Prompt with camera motion & looping wrap-around.
   - Recommended sound effects (*pop*, *boing*, *squeak*, *giggle*).

3. **Bilingual Support (Tiếng Việt & English)**:
   - Instant language switch toggle (🇻🇳 VI / 🇬🇧 EN) in the top header.
   - Automatically remembers user's language choice via `localStorage`.
   - Localized category descriptions, micro-timelines, buttons, and notifications.

4. **Zero Setup Dependency (Works Out of the Box)**:
   - Includes procedural AI generation & simulated trending intelligence fallback if API keys are not yet provided.
   - Connect your keys anytime in `.env.local` to switch seamlessly to live YouTube Data API and Google Gemini 2.5.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React
- **AI & Data**: `@google/genai` (Google Gemini 2.5), YouTube Data API v3
- **Runtime**: Bun / Node.js

---

## 📦 Getting Started

### 1. Installation

Dependencies are already installed. If needed, run:
```bash
bun install
# or: npm install
```

### 2. Environment Variables (Optional)

Configure your keys in `.env.local`:
```env
# YouTube Data API v3 Key (Leave empty to use simulated benchmark data)
YOUTUBE_API_KEY=""

# Google Gemini API Key (Leave empty to use procedural script generator)
GEMINI_API_KEY=""
```

### 3. Start Development Server

```bash
bun run dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
bun run build
bun run start
```
