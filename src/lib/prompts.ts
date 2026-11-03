import { KidsCategory, CategoryInfo } from './types';

export const CATEGORIES: Record<KidsCategory, CategoryInfo> = {
  animals: {
    id: 'animals',
    label: 'Cute Animals',
    emoji: '🐼',
    description: 'Chubby baby animals doing clumsy, delightful, and funny actions',
    defaultKeywords: ['cute baby animals', 'funny pets', 'chubby puppy', 'baby panda', 'kitten play'],
  },
  colors: {
    id: 'colors',
    label: 'Color Learning',
    emoji: '🎨',
    description: 'Vibrant color transformations, jelly splashing, and object reveals',
    defaultKeywords: ['learn colors for kids', 'color sorting', 'rainbow slime', 'color surprise', 'magic painting'],
  },
  vehicles: {
    id: 'vehicles',
    label: 'Funny Vehicles',
    emoji: '🚒',
    description: 'Bouncy monster trucks, smiling fire engines, and friendly construction cars',
    defaultKeywords: ['monster truck kids', 'fire truck cartoon', 'friendly car', 'wheels on the bus', 'train cartoon'],
  },
  nursery_fun: {
    id: 'nursery_fun',
    label: 'Nursery Rhyme Fun',
    emoji: '🎶',
    description: 'Catchy rhythmic micro-actions inspired by nursery rhymes and baby games',
    defaultKeywords: ['nursery rhymes shorts', 'peekaboo baby', 'baby shark animation', 'five little monkeys', 'finger family'],
  },
  surprises: {
    id: 'surprises',
    label: 'Surprise Eggs & Magic',
    emoji: '🥚',
    description: 'Cracking colorful surprise eggs, mystery gift boxes, and popping bubbles',
    defaultKeywords: ['surprise eggs opening', 'mystery egg surprise', 'pop balloon toys', 'magic box kids', 'sparkle surprise'],
  },
};

export const STYLE_PRESETS = {
  imageSuffix:
    'Pixar 3D animation style, vibrant pastel colors, ultra-cute character, 8k resolution, soft ambient lighting, high contrast, clean volumetric render, Unreal Engine 5 render, kid-safe aesthetics',
  motionSuffix:
    'smooth continuous looping motion, 24fps cinematic camera, gentle physics, perfectly seamless loop where ending frame position matches beginning frame',
};

export const SYSTEM_PROMPT = `You are an elite AI Creative Director specializing in ultra-engaging, high-retention 5-7 second YouTube Shorts for toddlers and preschoolers (ages 2-6).

CRITICAL DIRECTIVES:
1. Target Audience: Toddlers & young children (2-6 years old).
2. Video Length: Strictly 5 to 7 seconds total.
3. 3-Part Micro-Timeline:
   - Hook (0-2s): Immediate high-contrast visual grabber or surprise that stops the scroll instantly.
   - Action (2-5s): High-sensory, joyful, comical or educational micro-interaction.
   - Loop Payoff (5-7s): Seamless circular loop transition where the final motion or state seamlessly connects back to the 0s opening frame.
4. Kid Safety & COPPA:
   - Strictly positive, gentle, wholesome, and uplifting.
   - NO scary elements, NO sudden loud jumpscares, NO sharp dangerous items, NO dark gloomy shadows.
5. Sound Effects:
   - Include clear sensory onomatopoeia (e.g., *pop*, *boing*, *squeak*, *giggle*, *tinkle*, *whoosh*).
6. Prompts Generation:
   - Midjourney/Flux Image Prompt: Formulate a detailed master frame prompt with vivid descriptors, subject, framing, and automatically include: "${STYLE_PRESETS.imageSuffix}".
   - Kling/Runway/Pika Motion Prompt: Formulate motion camera movements, character kinetic action, and loop direction, ending with: "${STYLE_PRESETS.motionSuffix}".
7. Output Format:
   - You MUST output strictly valid JSON conforming to the requested schema. No conversational filler.`;

export function buildScriptGenerationUserPrompt(
  category: KidsCategory,
  trendsSummary: string[] = [],
  count: number = 3
): string {
  const categoryInfo = CATEGORIES[category] || CATEGORIES.animals;
  const trendingTagsText = trendsSummary.length > 0 
    ? trendsSummary.slice(0, 10).join(', ')
    : categoryInfo.defaultKeywords.join(', ');

  return `Generate ${count} distinct, viral-potential 5-7 second kid-safe animation short concepts for the category "${categoryInfo.label}" (${categoryInfo.description}).

Current trending tags & keywords in this niche: ${trendingTagsText}

Each concept must feature:
- A unique cute character or sensory theme
- A specific catchy sound effect
- Hook (0-2s), Action (2-5s), Loop Payoff (5-7s)
- 4-6 high-velocity hashtags
- Midjourney/Flux image prompt formatted for 9:16 aspect ratio (--ar 9:16)
- Motion prompt for AI video generators (Kling / Runway Gen-3 / Hailuo / Pika)

Output ONLY valid JSON matching the requested structure.`;
}

