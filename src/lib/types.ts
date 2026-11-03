export type Timeframe = 'day' | 'week';
export type KidsCategory = 'animals' | 'colors' | 'vehicles' | 'nursery_fun' | 'surprises';

export interface CategoryInfo {
  id: KidsCategory;
  label: string;
  emoji: string;
  description: string;
  defaultKeywords: string[];
}

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
  category: KidsCategory;
  timeframe: Timeframe;
  isMock?: boolean;
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

export interface GenerateScriptsRequest {
  category: KidsCategory;
  trendsSummary?: string[];
  count?: number;
}

export interface GenerateScriptsResponse {
  scripts: VideoScript[];
  category: KidsCategory;
  isMock?: boolean;
}

