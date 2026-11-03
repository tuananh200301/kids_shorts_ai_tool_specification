# SPEC-001: AI Kids Shorts Trend Harvester & Script Generator (5-7s)

## 1. Project Overview & Objective
Build a lightweight, high-performance web tool designed for creators producing 5-7 second AI-generated shorts for children (ages 2-6). 
The application automates two primary tasks:
1. **Trend & Hashtag Harvester**: Scrapes and analyzes trending YouTube Shorts & topics in the kids/animation niche (by day or week).
2. **Kid-Safe AI Script & Prompt Generator**: Converts trending insights into 5-7s seamless loop concepts with ready-to-use Midjourney/Flux and Kling/Runway generation prompts.

---

## 2. Tech Stack Requirements
- **Framework**: Next.js 14+ (App Router), TypeScript, React 18/19.
- **Styling**: Tailwind CSS, `lucide-react` for icons.
- **Runtime / Package Manager**: Node.js / Bun.
- **APIs**:
  - YouTube Data API v3 (for trend gathering).
  - Google Gemini API (`@google/genai` or `@google/generative-ai`) or OpenAI API (for structured script generation).
- **Caching**: Local memory cache or file-based JSON cache (`cache/trends-cache.json`) to prevent hitting YouTube API quota limits.

---

## 3. Directory Structure
```text
kids-shorts-ai-tool/
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/
│   │       ├── trends/
│   │       │   └── route.ts
│   │       └── generate/
│   │           └── route.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── FilterBar.tsx
│   │   ├── TrendingTagsPanel.tsx
│   │   ├── ScriptCard.tsx
│   │   └── CopyButton.tsx
│   └── lib/
│       ├── types.ts
│       ├── youtube.ts
│       ├── llm.ts
│       └── prompts.ts
```

---

## 4. Data Models & Type Definitions (`src/lib/types.ts`)

```typescript
export type Timeframe = 'day' | 'week';
export type KidsCategory = 'animals' | 'colors' | 'vehicles' | 'nursery_fun' | 'surprises';

export interface TrendingItem {
  id: string;
  title: string;
  channelTitle: string;
  viewCount: number;
  publishedAt: string;
  thumbnail: string;
  hashtags: string[];
}

export interface TrendAnalysisResult {
  topHashtags: { tag: string; count: number }[];
  trendingVideos: TrendingItem[];
  commonKeywords: string[];
  fetchedAt: string;
}

export interface VideoScript {
  id: string;
  title: string;
  category: KidsCategory;
  recommendedSoundEffect: string;
  timeline: {
    hook_0_to_2s: string;
    action_2_to_5s: string;
    loop_payoff_5_to_7s: string;
  };
  hashtags: string[];
  prompts: {
    imagePrompt: string; // Tailored for Midjourney/Flux (Pixar 3D style)
    motionPrompt: string; // Tailored for Kling/Runway/Pika
  };
}
```

---

## 5. API Implementation Specifications

### 5.1 YouTube Trend Harvester (`src/app/api/trends/route.ts`)
- **Query Params**: `timeframe` (`day` | `week`), `category` (`animals` | `colors` | `vehicles`, etc.).
- **Process**:
  1. Determine `publishedAfter` ISO string based on `timeframe` (now - 24 hours vs now - 7 days).
  2. Call YouTube Data API v3 `search` endpoint:
     - `part`: `snippet`
     - `type`: `video`
     - `videoDuration`: `short`
     - `order`: `viewCount`
     - `q`: Category keywords combined with `"kids shorts animation"`.
  3. Fetch video statistics via `videos.list` (`part: statistics,snippet`) using retrieved IDs.
  4. Parse titles and descriptions to extract `#hashtags` and frequency count.
  5. Save response into in-memory/file cache with a 3-hour TTL.

### 5.2 Script Generator Engine (`src/app/api/generate/route.ts`)
- **Input Payload**: `{ category: KidsCategory, trendsSummary: string[], count?: number }`
- **System Prompt Rules**:
  - Target audience: Toddlers & young children (2-6 years old).
  - Video length: Strictly 5 to 7 seconds.
  - Visual pacing: Instant high-contrast hook (0-2s), clear sensory action (2-5s), seamless loop hook (5-7s).
  - Content Safety: Strictly compliant with COPPA / Kid-Safe standards (no jump-scares, no dark themes, bright & uplifting).
  - Image Style Preset: Always append `Pixar 3D animation style, vibrant pastel colors, ultra-cute character, 8k resolution, soft ambient lighting, high contrast`.
  - Motion Style Preset: Specify movement direction, speed, and loop wrap-around.
- **Output Format**: Strictly validate with JSON Schema (Structured Output / JSON mode).

---

## 6. UI & UX Specifications (`src/app/page.tsx`)

1. **Top Control Bar**:
   - Selector for `Timeframe` (`Last 24 Hours` / `Past 7 Days`).
   - Selector for `Category` (`Cute Animals`, `Color Recognition`, `Funny Vehicles`, `Surprise Eggs`).
   - Primary Action Button: `[Scan Trends & Generate Scripts]`.
2. **Left Panel: Trend Intelligence**:
   - High-velocity hashtags cloud with click-to-copy or click-to-filter.
   - List of top reference trending shorts with view counters and thumbnails.
3. **Right Panel: Production-Ready Script Cards**:
   - Card Header: Concept title, target tags, and recommended sound effect (e.g., `*pop*`, `*boing*`, `giggle`).
   - Timeline Breakdown: Clear 3-step visual pills (`0-2s Hook`, `2-5s Action`, `5-7s Loop`).
   - Prompt Action Boxes:
     - Copy Midjourney Image Prompt.
     - Copy Video Motion Prompt.
   - Single-click notification toast feedback ("Copied to clipboard!").

---

## 7. Step-by-Step Implementation Instructions for AI Coder

1. **Init Project**:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint --use-bun
   bun add lucide-react clsx tailwind-merge @google/genai
   ```
2. **Environment Variables (`.env.local`)**:
   ```env
   YOUTUBE_API_KEY="your_youtube_v3_api_key"
   GEMINI_API_KEY="your_gemini_api_key"
   ```
3. **Implement Core Files in Order**:
   - `src/lib/types.ts`: Define all TypeScript interfaces.
   - `src/lib/prompts.ts`: Define system prompts and prompt templates for 5-7s shorts.
   - `src/lib/youtube.ts`: Implement YouTube API client with cache handling.
   - `src/lib/llm.ts`: Implement LLM invocation with strict JSON output parsing.
   - `src/app/api/trends/route.ts` & `src/app/api/generate/route.ts`: Expose REST endpoints.
   - `src/components/*`: Build UI components (`FilterBar`, `TrendingTagsPanel`, `ScriptCard`, `CopyButton`).
   - `src/app/page.tsx`: Connect state management and render responsive 2-column layout.
4. **Verification**:
   - Test without API keys using mock fallback data so the UI remains fully functional during local testing.