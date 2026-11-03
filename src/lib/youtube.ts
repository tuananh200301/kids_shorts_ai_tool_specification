import fs from 'fs';
import path from 'path';
import { KidsCategory, Timeframe, TrendAnalysisResult, TrendingItem } from './types';
import { CATEGORIES } from './prompts';

interface CacheEntry {
  expiresAt: number;
  data: TrendAnalysisResult;
}

const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'trends-cache.json');

function readPersistentCache(): Record<string, CacheEntry> {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read cache file, using memory cache:', err);
  }
  return {};
}

function writePersistentCache(cache: Record<string, CacheEntry>) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write cache file:', err);
  }
}

function getFromCache(key: string): TrendAnalysisResult | null {
  const now = Date.now();
  // 1. Check memory cache
  const memEntry = memoryCache.get(key);
  if (memEntry && memEntry.expiresAt > now) {
    return memEntry.data;
  }

  // 2. Check disk cache
  const diskCache = readPersistentCache();
  const diskEntry = diskCache[key];
  if (diskEntry && diskEntry.expiresAt > now) {
    memoryCache.set(key, diskEntry);
    return diskEntry.data;
  }

  return null;
}

function setToCache(key: string, data: TrendAnalysisResult) {
  const expiresAt = Date.now() + CACHE_TTL_MS;
  const entry: CacheEntry = { expiresAt, data };
  memoryCache.set(key, entry);

  try {
    const diskCache = readPersistentCache();
    diskCache[key] = entry;
    writePersistentCache(diskCache);
  } catch {
    // Ignore disk write failure
  }
}

// Extract hashtags from text using regex
function extractHashtags(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/#[a-zA-Z0-9_]+/g);
  if (!matches) return [];
  return matches.map((tag) => tag.toLowerCase());
}

export async function fetchTrendingKidsShorts(
  category: KidsCategory,
  timeframe: Timeframe
): Promise<TrendAnalysisResult> {
  const cacheKey = `${category}_${timeframe}`;
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  const cached = getFromCache(cacheKey);

  // If cached item exists and matches our mode (real vs mock), return it
  if (cached) {
    if (apiKey && !cached.isMock) {
      return cached;
    }
    if (!apiKey && cached.isMock) {
      return cached;
    }
  }

  // If no API key provided or empty, return high-fidelity mock data
  if (!apiKey) {
    const mockData = generateMockTrends(category, timeframe);
    setToCache(cacheKey, mockData);
    return mockData;
  }

  try {
    const categoryInfo = CATEGORIES[category] || CATEGORIES.animals;
    const queryTerm = `${categoryInfo.defaultKeywords[0]} kids shorts animation`;

    const now = new Date();
    const timeOffsetMs = timeframe === 'day' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const publishedAfter = new Date(now.getTime() - timeOffsetMs).toISOString();

    // 1. Search for short videos
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('videoDuration', 'short');
    searchUrl.searchParams.set('order', 'viewCount');
    searchUrl.searchParams.set('q', queryTerm);
    searchUrl.searchParams.set('publishedAfter', publishedAfter);
    searchUrl.searchParams.set('maxResults', '15');
    searchUrl.searchParams.set('key', apiKey);

    const searchRes = await fetch(searchUrl.toString());
    if (!searchRes.ok) {
      console.warn(`YouTube search API error: ${searchRes.statusText}, falling back to mock.`);
      return generateMockTrends(category, timeframe);
    }

    const searchJson = await searchRes.json();
    const items = searchJson.items || [];
    const videoIds = items.map((it: { id?: { videoId?: string } }) => it.id?.videoId).filter(Boolean);

    if (videoIds.length === 0) {
      return generateMockTrends(category, timeframe);
    }

    // 2. Fetch statistics & complete snippet
    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videosUrl.searchParams.set('part', 'snippet,statistics');
    videosUrl.searchParams.set('id', videoIds.join(','));
    videosUrl.searchParams.set('key', apiKey);

    const videosRes = await fetch(videosUrl.toString());
    if (!videosRes.ok) {
      console.warn(`YouTube videos API error: ${videosRes.statusText}, falling back to mock.`);
      return generateMockTrends(category, timeframe);
    }

    const videosJson = await videosRes.json();
    const videoDetails = videosJson.items || [];

    const hashtagCounts: Record<string, number> = {};
    const trendingVideos: TrendingItem[] = [];

    for (const v of videoDetails) {
      const snippet = v.snippet || {};
      const statistics = v.statistics || {};
      const title = snippet.title || 'Kids Short';
      const description = snippet.description || '';
      const tagsInSnippet = Array.isArray(snippet.tags) ? snippet.tags.map((t: string) => `#${t.replace(/\s+/g, '')}`) : [];
      const tagsInText = extractHashtags(`${title} ${description}`);
      const allTags = Array.from(new Set([...tagsInSnippet, ...tagsInText]));

      allTags.forEach((tag) => {
        const normalized = tag.startsWith('#') ? tag.toLowerCase() : `#${tag.toLowerCase()}`;
        hashtagCounts[normalized] = (hashtagCounts[normalized] || 0) + 1;
      });

      trendingVideos.push({
        id: v.id,
        title,
        channelTitle: snippet.channelTitle || 'Kids Creator',
        viewCount: parseInt(statistics.viewCount || '0', 10),
        publishedAt: snippet.publishedAt || new Date().toISOString(),
        thumbnail:
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url ||
          'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=640&q=80',
        hashtags: allTags.slice(0, 5),
      });
    }

    const topHashtags = Object.entries(hashtagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const result: TrendAnalysisResult = {
      category,
      timeframe,
      topHashtags,
      trendingVideos: trendingVideos.sort((a, b) => b.viewCount - a.viewCount),
      commonKeywords: categoryInfo.defaultKeywords,
      fetchedAt: new Date().toISOString(),
      isMock: false,
    };

    setToCache(cacheKey, result);
    return result;
  } catch (err) {
    console.error('Error fetching from YouTube API:', err);
    return generateMockTrends(category, timeframe);
  }
}

// Fallback high-fidelity mock data generator
function generateMockTrends(category: KidsCategory, timeframe: Timeframe): TrendAnalysisResult {
  const categoryInfo = CATEGORIES[category] || CATEGORIES.animals;
  const multiplier = timeframe === 'week' ? 4.5 : 1;

  const mockPresets: Record<
    KidsCategory,
    {
      topHashtags: { tag: string; count: number }[];
      commonKeywords: string[];
      videos: { title: string; channel: string; views: number; thumb: string; tags: string[] }[];
    }
  > = {
    animals: {
      topHashtags: [
        { tag: '#kidsshorts', count: Math.round(92 * multiplier) },
        { tag: '#cuteanimals', count: Math.round(84 * multiplier) },
        { tag: '#babypanda', count: Math.round(71 * multiplier) },
        { tag: '#funnycat', count: Math.round(63 * multiplier) },
        { tag: '#animationforchildren', count: Math.round(59 * multiplier) },
        { tag: '#loopingvideo', count: Math.round(52 * multiplier) },
        { tag: '#toddlerfun', count: Math.round(48 * multiplier) },
        { tag: '#3danimation', count: Math.round(43 * multiplier) },
        { tag: '#corgipuppy', count: Math.round(38 * multiplier) },
        { tag: '#viralshorts', count: Math.round(35 * multiplier) },
      ],
      commonKeywords: ['baby panda', 'bouncing kitten', 'clumsy puppy', 'fluffy bunny', 'chubby hamster'],
      videos: [
        {
          title: 'Baby Panda Jumps on Giant Pink Jelly! 🐼🫧 (Looping Short)',
          channel: 'TinyPaws Toons',
          views: Math.round(1850000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=640&q=80',
          tags: ['#babypanda', '#cuteanimals', '#kidsshorts', '#loop'],
        },
        {
          title: 'Chubby Golden Puppy Sliding on Ice Cream Sundae 🍦🐶',
          channel: 'GiggleToons Studio',
          views: Math.round(1240000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=640&q=80',
          tags: ['#cuteanimals', '#goldenpuppy', '#animation', '#kids'],
        },
        {
          title: 'Curious Kitten Pops Rainbow Soap Bubbles! 🐱✨',
          channel: 'Little Dreamers 3D',
          views: Math.round(980000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=640&q=80',
          tags: ['#funnycat', '#rainbowbubbles', '#kidsshorts'],
        },
        {
          title: 'Baby Bear Wiggles With Honeycomb Drum 🍯🐻',
          channel: 'Teddy Bear Kids',
          views: Math.round(750000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=640&q=80',
          tags: ['#babybear', '#toddleranimation', '#kidssound'],
        },
      ],
    },
    colors: {
      topHashtags: [
        { tag: '#learncolors', count: Math.round(98 * multiplier) },
        { tag: '#colorlearning', count: Math.round(89 * multiplier) },
        { tag: '#rainbowmagic', count: Math.round(76 * multiplier) },
        { tag: '#kidsshorts', count: Math.round(72 * multiplier) },
        { tag: '#colorsforkids', count: Math.round(65 * multiplier) },
        { tag: '#satisfyingkids', count: Math.round(58 * multiplier) },
        { tag: '#jellyslime', count: Math.round(51 * multiplier) },
        { tag: '#preschoollearning', count: Math.round(44 * multiplier) },
      ],
      commonKeywords: ['rainbow splash', 'magic paint reveal', 'jelly blocks', 'color sorting', 'glowing paint'],
      videos: [
        {
          title: 'Magic Color Slime Splatters: Red, Yellow, Blue! 🔴🟡🔵',
          channel: 'Rainbow Kids TV',
          views: Math.round(2100000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=640&q=80',
          tags: ['#learncolors', '#rainbowmagic', '#preschool'],
        },
        {
          title: 'Squishy Color Jelly Cubes Splat & Transform! 🌈🍇',
          channel: 'ColorPop Academy',
          views: Math.round(1450000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=640&q=80',
          tags: ['#colorlearning', '#jellyslime', '#toddlerfun'],
        },
        {
          title: 'Glowing Crayons Draw A Smiling Rainbow Sun ☀️🖍️',
          channel: 'Happy Palette Kids',
          views: Math.round(890000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=640&q=80',
          tags: ['#crayons', '#learncolors', '#loopingvideo'],
        },
      ],
    },
    vehicles: {
      topHashtags: [
        { tag: '#monstertruck', count: Math.round(95 * multiplier) },
        { tag: '#kidscars', count: Math.round(82 * multiplier) },
        { tag: '#firetruck', count: Math.round(77 * multiplier) },
        { tag: '#vehiclesshorts', count: Math.round(68 * multiplier) },
        { tag: '#boingcars', count: Math.round(55 * multiplier) },
        { tag: '#toddlercars', count: Math.round(49 * multiplier) },
      ],
      commonKeywords: ['bouncy monster truck', 'cheerful firetruck', 'tiny train', 'beep beep car', 'muddy wheels'],
      videos: [
        {
          title: 'Monster Truck Bounces On Gigantic Donut! 🍩🛞',
          channel: 'Vroom Toons Kids',
          views: Math.round(2300000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=640&q=80',
          tags: ['#monstertruck', '#kidscars', '#funnyshorts'],
        },
        {
          title: 'Smiling Firetruck Sprays Colorful Bubble Water 🚒🫧',
          channel: 'Rescue Buddy Junior',
          views: Math.round(1670000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=640&q=80',
          tags: ['#firetruck', '#boingcars', '#toddlerfun'],
        },
        {
          title: 'Little Steam Train Chug-Chug Into Cotton Candy Tunnel 🚂☁️',
          channel: 'ChooChoo Land',
          views: Math.round(1120000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=640&q=80',
          tags: ['#tinytrain', '#vehiclesshorts', '#kidsshorts'],
        },
      ],
    },
    nursery_fun: {
      topHashtags: [
        { tag: '#nurseryrhymes', count: Math.round(96 * multiplier) },
        { tag: '#babysongs', count: Math.round(85 * multiplier) },
        { tag: '#peekaboo', count: Math.round(74 * multiplier) },
        { tag: '#rhymesshorts', count: Math.round(69 * multiplier) },
        { tag: '#kidsanimation', count: Math.round(61 * multiplier) },
        { tag: '#toddlerlearning', count: Math.round(53 * multiplier) },
      ],
      commonKeywords: ['peekaboo teddy', 'sparkly little star', 'humpty dumpty bounce', 'happy clap game', 'rhyme loop'],
      videos: [
        {
          title: 'Peekaboo Bunny Hiding Behind Giant Sunflower 🌻🐰',
          channel: 'CuddleSong Kids',
          views: Math.round(1920000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=640&q=80',
          tags: ['#peekaboo', '#nurseryrhymes', '#toddlerlearning'],
        },
        {
          title: 'Twinkle Star Jumps Onto Marshmallow Cloud ⭐☁️',
          channel: 'Starry Lullaby Toons',
          views: Math.round(1380000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=640&q=80',
          tags: ['#babysongs', '#rhymesshorts', '#loopingvideo'],
        },
      ],
    },
    surprises: {
      topHashtags: [
        { tag: '#surpriseeggs', count: Math.round(102 * multiplier) },
        { tag: '#mysteryegg', count: Math.round(91 * multiplier) },
        { tag: '#eggopening', count: Math.round(79 * multiplier) },
        { tag: '#kidstoys', count: Math.round(70 * multiplier) },
        { tag: '#surprisetoys', count: Math.round(64 * multiplier) },
        { tag: '#popballoon', count: Math.round(57 * multiplier) },
      ],
      commonKeywords: ['golden egg crack', 'glitter slime reveal', 'surprise pop', 'mystery gift box', 'sparkle toy'],
      videos: [
        {
          title: 'Giant Golden Egg Cracks Open! What Is Inside? 🥚✨🐥',
          channel: 'EggSurprise Magic',
          views: Math.round(2850000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1522881177673-2d2c18663806?auto=format&fit=crop&w=640&q=80',
          tags: ['#surpriseeggs', '#mysteryegg', '#kidstoys'],
        },
        {
          title: 'Rainbow Balloon Popping with Glitter Confetti! 🎈🎉',
          channel: 'Sparkle Box Kids',
          views: Math.round(1760000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=640&q=80',
          tags: ['#popballoon', '#surprisetoys', '#satisfyingkids'],
        },
        {
          title: 'Pastel Mystery Gift Box Wiggles and Opens! 🎁🧸',
          channel: 'ToyJoy Factory',
          views: Math.round(1210000 * multiplier),
          thumb: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=640&q=80',
          tags: ['#eggopening', '#kidsshorts', '#mysteryegg'],
        },
      ],
    },
  };

  const preset = mockPresets[category] || mockPresets.animals;

  return {
    category,
    timeframe,
    topHashtags: preset.topHashtags,
    commonKeywords: preset.commonKeywords || categoryInfo.defaultKeywords,
    trendingVideos: preset.videos.map((v, idx) => ({
      id: `mock-${category}-${timeframe}-${idx + 1}`,
      title: v.title,
      channelTitle: v.channel,
      viewCount: v.views,
      publishedAt: new Date(Date.now() - (idx + 1) * 3600 * 1000 * 4).toISOString(),
      thumbnail: v.thumb,
      hashtags: v.tags,
    })),
    fetchedAt: new Date().toISOString(),
    isMock: true,
  };
}

