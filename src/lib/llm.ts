import { GoogleGenAI, Type } from '@google/genai';
import { KidsCategory, VideoScript } from './types';
import { SYSTEM_PROMPT, STYLE_PRESETS, buildScriptGenerationUserPrompt } from './prompts';

export async function generateKidsShortScripts(
  category: KidsCategory,
  trendsSummary: string[] = [],
  count: number = 3
): Promise<{ scripts: VideoScript[]; isMock: boolean }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If no Gemini API Key is configured, fall back to high-quality procedural mock generation
  if (!apiKey) {
    return {
      scripts: generateMockScripts(category, trendsSummary, count),
      isMock: true,
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const userPrompt = buildScriptGenerationUserPrompt(category, trendsSummary, count);

    const scriptSchema = {
      type: Type.ARRAY,
      description: 'List of 5-7 second kid-safe looping short scripts',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          category: { type: Type.STRING },
          recommendedSoundEffect: { type: Type.STRING },
          timeline: {
            type: Type.OBJECT,
            properties: {
              hook_0_to_2s: { type: Type.STRING },
              action_2_to_5s: { type: Type.STRING },
              loop_payoff_5_to_7s: { type: Type.STRING },
            },
            required: ['hook_0_to_2s', 'action_2_to_5s', 'loop_payoff_5_to_7s'],
          },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          prompts: {
            type: Type.OBJECT,
            properties: {
              imagePrompt: { type: Type.STRING },
              motionPrompt: { type: Type.STRING },
            },
            required: ['imagePrompt', 'motionPrompt'],
          },
        },
        required: ['id', 'title', 'category', 'recommendedSoundEffect', 'timeline', 'hashtags', 'prompts'],
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: scriptSchema,
        temperature: 0.7,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(responseText) as VideoScript[];
    
    // Ensure all prompts adhere strictly to style presets
    const sanitizedScripts = parsed.map((script, idx) => ({
      ...script,
      id: script.id || `script-${Date.now()}-${idx + 1}`,
      category,
      prompts: {
        imagePrompt: script.prompts.imagePrompt.includes('Pixar 3D animation style')
          ? script.prompts.imagePrompt
          : `${script.prompts.imagePrompt}, ${STYLE_PRESETS.imageSuffix} --ar 9:16`,
        motionPrompt: script.prompts.motionPrompt.includes('seamless loop')
          ? script.prompts.motionPrompt
          : `${script.prompts.motionPrompt}, ${STYLE_PRESETS.motionSuffix}`,
      },
    }));

    return {
      scripts: sanitizedScripts,
      isMock: false,
    };
  } catch (err) {
    console.error('Error invoking Gemini API, falling back to mock generator:', err);
    return {
      scripts: generateMockScripts(category, trendsSummary, count),
      isMock: true,
    };
  }
}

// Procedural high-retention mock scripts generator
function generateMockScripts(
  category: KidsCategory,
  trendsSummary: string[] = [],
  count: number = 3
): VideoScript[] {
  const timestamp = Date.now();
  const baseTags = trendsSummary.length > 0 ? trendsSummary.slice(0, 4) : ['#kidsshorts', '#animation', '#toddlerfun'];

  const categoryPresets: Record<
    KidsCategory,
    Array<{
      title: string;
      sfx: string;
      hook: string;
      action: string;
      loop: string;
      imageSubject: string;
      motionAction: string;
      extraTags: string[];
    }>
  > = {
    animals: [
      {
        title: 'Chubby Baby Panda Jell-O Trampoline',
        sfx: '*BOING-BOING* -> *squeaky giggle* -> *spring pop!*',
        hook: 'Chubby baby panda wearing tiny strawberry shoes drops from sky onto a gigantic wobbly pink strawberry jelly cube.',
        action: 'Panda bounces three times with comical squishy physics; giant jelly jiggles vibrantly sending rainbow sparkles across screen.',
        loop: 'On highest third bounce, panda performs a slow-motion somersault facing camera, landing right back at apex ready to drop again.',
        imageSubject:
          'Macro vertical shot of an ultra-fluffy baby panda bear bouncing joyfully on a translucent giant pastel pink strawberry jelly pudding cube, glowing sugar sprinkles in air, candy landscape background',
        motionAction:
          'Vertical camera track following bouncing panda. Jiggle jelly elastic deformation at 2s, panda rotates 360 degrees mid-air at 4s, returns to exact initial drop position at 6.8s',
        extraTags: ['#babypanda', '#cuteanimals', '#boing'],
      },
      {
        title: 'Curious Kitten Pops Rainbow Bubble Gum',
        sfx: '*balloon stretch* -> *POP!* -> *purr bell chime*',
        hook: 'Calico kitten with oversized sapphire eyes blows an enormous shimmering bubblegum sphere that covers the whole screen.',
        action: 'Bubble gum expands to translucent rainbow sheen reflecting pastel clouds; kitten gently taps it with a tiny paw.',
        loop: 'Bubble pops into cute heart-shaped confetti that swirl in circle and reconstitute instantly back into fresh bubble gum.',
        imageSubject:
          'Close-up vertical portrait of an ultra-cute calico kitten with huge glossy eyes blowing a huge iridescent pastel bubblegum bubble that shines like a glass globe, soft cozy studio lighting',
        motionAction:
          'Slow zoom in as bubble inflates dynamically from 0-3s, quick dramatic pop at 4.5s with particle confetti explosion, swirling vortex reverses back into initial bubble at 6.5s',
        extraTags: ['#funnycat', '#rainbowbubble', '#satisfying'],
      },
      {
        title: 'Baby Corgi Ice Cream Slide Adventure',
        sfx: '*slurp whoosh* -> *ding ding* -> *happy panting*',
        hook: 'Smiling baby corgi sits atop a towering triple-scoop mint & strawberry ice cream cone with chocolate drip.',
        action: 'Corgi slides down the silky smooth chocolate drip like a water slide, wagging its little heart-shaped tail in pure joy.',
        loop: 'Corgi hits a waffle-cone mini jump at base, launch-flips in air, and lands smoothly back on top scoop where slide began.',
        imageSubject:
          'Dynamic vertical composition of a smiling round fluffy Corgi puppy sliding down a giant melting 3D pastel ice cream mountain with colorful rainbow sprinkles and glossy strawberry glaze',
        motionAction:
          'Fast smooth downward camera dolly tracking corgi slide along curved ice cream slope, sweet ramp launch at 4.8s, clean circular loop reset at 6.5s',
        extraTags: ['#corgipuppy', '#icecream', '#kidstoys'],
      },
      {
        title: 'Baby Otter Claps Dancing Sea Star',
        sfx: '*splash clap* -> *squeak* -> *water droplet tune*',
        hook: 'Wholesome baby otter floating on gentle turquoise waves claps paws rhythmically to an upbeat melody.',
        action: 'A glowing rainbow sea star hops from wave to wave onto the otter tummy, spinning like a joyful top.',
        loop: 'Otter gives sea star a gentle high-five, water ripples expand outward in concentric hearts and reset the wave loop.',
        imageSubject:
          'Whimsical vertical shot of a cute baby river otter floating on turquoise crystal water, holding a glowing golden starfish, sunlight caustics dancing on water surface',
        motionAction:
          'Gentle harmonic ocean wave bobbing motion, otter paws clapping in synchronized 120bpm cadence, water ripple wave cycle restarts seamlessly',
        extraTags: ['#babyotter', '#oceanfriends', '#cuteanimals'],
      },
    ],
    colors: [
      {
        title: 'Magic Color Slime Splat & Blossom',
        sfx: '*SPLAT!* -> *shimmer sparkle* -> *accordion stretch*',
        hook: 'Three giant colorful jelly raindrops (Cyan, Magenta, Yellow) fall simultaneously toward white marble table.',
        action: 'They splat into smiling liquid characters, blend together into a radiant rainbow swirl, and bloom into candy flowers.',
        loop: 'Flowers fold into nectar droplets that shoot straight upward into sky, returning precisely to initial falling frame.',
        imageSubject:
          'Vertical dynamic shot of three glossy translucent color drops splashing onto bright reflective surface, creating smiling cartoon liquid splashes with big friendly eyes',
        motionAction:
          'High-speed capture 60fps slowed to 24fps, fluid morphing dynamics, rainbow swirl rotates 360 degrees and pulls back up seamlessly',
        extraTags: ['#learncolors', '#rainbowmagic', '#slime'],
      },
      {
        title: 'Squishy Jelly Block Color Sorter',
        sfx: '*plop* -> *squeaky stretch* -> *tada fanfare*',
        hook: 'A bright red bouncy jelly bear hops into an empty transparent glass cube that instantly glows ruby red.',
        action: 'A blue jelly bear and yellow jelly bear join in; upon bumping heads, they chime musical chord notes C-E-G.',
        loop: 'All three bears turn into bouncy spheres, bounce once simultaneously against screen glass, and reform at starting line.',
        imageSubject:
          'Macro 3D vertical still of three gummy jelly bears in primary colors inside a crystalline glass toy maze, glossy subsurface scattering gelatin texture',
        motionAction:
          'Energetic rhythmic bounce sequence, synchronized squash-and-stretch animation, elastic rebound resets to original pose',
        extraTags: ['#colorlearning', '#jellybear', '#preschool'],
      },
      {
        title: 'Glowing Crayon Draws Living Rainbow Sun',
        sfx: '*scribble scribble* -> *ding!* -> *giggle sun chuckle*',
        hook: 'A chubby golden crayon with cute animated face draws a bright yellow arc that radiates warm volumetric beams.',
        action: 'Arcs of orange, pink, and violet complete a smiling cartoon sun that blinks and winks directly at camera.',
        loop: 'Sun giggles and spins like a windmill, sending color sparks back into the tip of the crayon ready to draw again.',
        imageSubject:
          'Vertical scene of a lively smiling Pixar-style crayon drawing neon glowing light strokes in a dreamy bedroom wall environment',
        motionAction:
          'Fast sweeping motion blur arcs, character rotation, light bloom pulse matching the 5-second musical loop beat',
        extraTags: ['#learncolors', '#crayons', '#sunshine'],
      },
    ],
    vehicles: [
      {
        title: 'Monster Truck Bouncing on Giant Marshmallow',
        sfx: '*VROOOM!* -> *boing squeak* -> *confetti cannon pop*',
        hook: 'A chunky neon-green monster truck with enormous cartoon tires revs engine at edge of a powdered donut ramp.',
        action: 'Truck leaps in high arc, landing smack-dab on a massive bouncy marshmallow that squishes down and launches truck skyward.',
        loop: 'At peak altitude, truck performs a barrel-roll with exhaust blowing colorful star smoke, descending right to start ramp.',
        imageSubject:
          'Low angle dynamic vertical shot of an ultra-cute stylized monster truck with giant rubber wheels jumping over a landscape of candy donuts and pastel marshmallows',
        motionAction:
          'Extreme suspension squash and stretch physics, slow-motion airborne spin, camera rolls 180 degrees and loops to initial ramp',
        extraTags: ['#monstertruck', '#kidscars', '#vroom'],
      },
      {
        title: 'Happy Firetruck Bubble Wash Fun',
        sfx: '*siren whoop whoop* -> *bubble splash* -> *clean squeak*',
        hook: 'Smiling red firetruck covered in playful mud spots rolls into an automated carwash filled with rainbow bubbles.',
        action: 'Spinning foam rollers with smiley faces tickle the firetruck; huge bubble cannon sprays glistening soapy clouds.',
        loop: 'Firetruck emerges sparkling clean with a gleam sparkle on windshield, then a stray joyful mud droplet drops to start again.',
        imageSubject:
          'Eye-level vertical shot of a cute anthropomorphic red fire engine with expressive headlights inside a whimsical rainbow foam car wash',
        motionAction:
          'Continuous forward wheel rotation, foam simulation swirling around vehicle body, water spray loop seamlessly cycles',
        extraTags: ['#firetruck', '#vehiclesshorts', '#carwash'],
      },
      {
        title: 'Little Choo-Choo Cotton Candy Express',
        sfx: '*toot toot!* -> *chugga chugga* -> *wind chime bell*',
        hook: 'A miniature lavender steam locomotive chugs across a rainbow suspension bridge suspended between fluffy cloud peaks.',
        action: 'Chimney puffs heart-shaped cotton candy steam clouds that turn into floating musical notes as bells chime.',
        loop: 'Train enters a spiral loop-de-loop track tunnel and exits precisely where the bridge begins, sustaining momentum.',
        imageSubject:
          'Cinematic vertical establishing shot of a charming vintage cartoon steam train chugging across a candy-cane trestle bridge above cotton candy clouds',
        motionAction:
          'Fluid roller-coaster style track camera follow, dynamic steam particle emitter, seamless circular track transition',
        extraTags: ['#tinytrain', '#choochoo', '#kidsshorts'],
      },
    ],
    nursery_fun: [
      {
        title: 'Peekaboo Teddy Behind Sunflower',
        sfx: '*peekaboo whisper* -> *tada horn* -> *baby giggle*',
        hook: 'A giant golden sunflower gently sways its petals closed in center frame, hiding something playful.',
        action: 'Petals unfurl rapidly to reveal a chubby plush teddy bear with button eyes waving both paws: "PEEK-A-BOO!"',
        loop: 'Teddy giggles, gives a big teddy hug toward the lens, and petals gently close back up to beginning position.',
        imageSubject:
          'Warm vertical portrait of a lush oversized sunflower unfolding in a fairytale garden to reveal a sweet fuzzy brown teddy bear smiling warmly',
        motionAction:
          'Petal unfolding radial animation, fast reveal zoom into teddy bear eyes, gentle sway closing loop at 6.2s',
        extraTags: ['#peekaboo', '#nurseryrhymes', '#teddybear'],
      },
      {
        title: 'Twinkle Star Marshmallow Jump',
        sfx: '*twinkle chime* -> *boing* -> *soft yawn chime*',
        hook: 'A glowing five-pointed golden star with rosy cheeks glides down from night sky onto a fluffy cloud mattress.',
        action: 'Star bounces like a trampoline, leaving trails of stardust sparks; smiling crescent moon applauds in background.',
        loop: 'Star catches a tiny floating cloud pillow, spins around into a cozy tuck, and bounces back into its starting night sky spot.',
        imageSubject:
          'Magical vertical bedtime scene of an adorable luminous golden cartoon star character bouncing on soft volumetric pastel clouds under crescent moon',
        motionAction:
          'Floating zero-gravity bounce physics, glowing particle emission trail, smooth parabolic trajectory returning to start',
        extraTags: ['#twinkletwinkle', '#bedtime', '#babysongs'],
      },
      {
        title: 'Five Little Ducks Bubble Slip',
        sfx: '*quack quack quack* -> *splash* -> *water whistle*',
        hook: 'A bright yellow rubber duckling wearing tiny swimming goggles slides down a spiral rainbow water slide.',
        action: 'Duckling catches up with four matching mini ducklings in a bubble pool; they form a rotating flower circle.',
        loop: 'A gentle water spout fountain lifts mother duck and ducklings upward back to the slide entrance.',
        imageSubject:
          'Vibrant vertical shot of adorable stylized yellow rubber ducks splashing inside a pastel waterpark playground with crystal splashing drops',
        motionAction:
          'Smooth track slide curve, joyful quacking head bobs, fountain geyser cycle resets to slide crest',
        extraTags: ['#fivelittleducks', '#quack', '#toddlerfun'],
      },
    ],
    surprises: [
      {
        title: 'Golden Mystery Egg Crack & Pop',
        sfx: '*tap tap tap* -> *CRACK!* -> *fanfare party horn*',
        hook: 'A shiny golden egg decorated with pastel polka dots wobbles on a velvet cushion, glowing with magical light fissures.',
        action: 'The shell cracks with a loud satisfying POP, bursting into golden confetti and revealing a tiny winged baby dragon wearing pajamas.',
        loop: 'Baby dragon blows a tiny heart-shaped smoke puff, yawns cutely, and curls back inside the shell which zips shut seamlessly.',
        imageSubject:
          'Extreme macro vertical shot of an ornate golden cartoon egg cracking open on a soft velvet cushion, radiant beams bursting from inside fractures',
        motionAction:
          'Rapid wobble vibrations intensifying 0-2s, shell burst physics at 3s with slow motion particle confetti, clean shell re-assembly loop at 6.5s',
        extraTags: ['#surpriseeggs', '#mysteryegg', '#unboxing'],
      },
      {
        title: 'Rainbow Balloon Magic Pin Pop',
        sfx: '*suspense hum* -> *POP!* -> *sparkle celebration*',
        hook: 'A glossy giant multi-colored swirl balloon floats gently toward a tiny friendly cartoon safety pin with sunglasses.',
        action: 'The pin gives the balloon a playful tap: POP! A flood of plush gummy candy bears and stars rain down toward camera.',
        loop: 'The candy pieces swirl in a colorful vortex funnel that inflates back into the original round swirl balloon.',
        imageSubject:
          'Ultra-vibrant vertical render of a giant metallic pearlescent rainbow balloon reflecting studio softboxes, ready to pop with miniature toys inside',
        motionAction:
          'Balloon elasticity stretch, instantaneous high-impact pop burst with radial toy ejection, vortex reverse rewind loop',
        extraTags: ['#popballoon', '#kidstoys', '#surprisetoys'],
      },
      {
        title: 'Pastel Surprise Box Ribbon Untie',
        sfx: '*ribbon whoosh* -> *spring boing* -> *joyful laugh*',
        hook: 'A mint-green gift box with a gigantic satin lavender bow begins to shake and dance across a wooden floor.',
        action: 'Ribbon unties itself like magic, lid flies off with a spring sound, and a fluffy baby bunny pops up holding a heart cookie.',
        loop: 'Bunny winks at viewer, ducks back into box, lid snaps back down with ribbon retying itself in one swift loop.',
        imageSubject:
          'Vertical scene of a luxury pastel toy gift box with glowing satin ribbon shaking with excitement in a sunlit playroom, hyper-detailed texture',
        motionAction:
          'Anticipation shake curve, explosive lid pop at 2.5s, rabbit pop-up pose with snappy follow-through, spring rewind at 6s',
        extraTags: ['#giftbox', '#surprise', '#loopingvideo'],
      },
    ],
  };

  const pool = categoryPresets[category] || categoryPresets.animals;
  const selected = pool.slice(0, count);

  return selected.map((item, index) => {
    const scriptId = `script-${category}-${timestamp}-${index + 1}`;
    const allTags = Array.from(new Set([...baseTags, ...item.extraTags]));

    return {
      id: scriptId,
      title: item.title,
      category,
      recommendedSoundEffect: item.sfx,
      timeline: {
        hook_0_to_2s: item.hook,
        action_2_to_5s: item.action,
        loop_payoff_5_to_7s: item.loop,
      },
      hashtags: allTags,
      prompts: {
        imagePrompt: `${item.imageSubject}, ${STYLE_PRESETS.imageSuffix} --ar 9:16 --stylize 250`,
        motionPrompt: `${item.motionAction}, ${STYLE_PRESETS.motionSuffix}`,
      },
    };
  });
}

