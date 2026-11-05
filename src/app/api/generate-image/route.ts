import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, scriptId } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // Clean up Midjourney flags like --ar 9:16 --stylize 250 for cleaner prompt input
    const cleanPrompt = prompt
      .replace(/--ar\s+\d+:\d+/gi, '')
      .replace(/--stylize\s+\d+/gi, '')
      .replace(/--v\s+\d+(\.\d+)?/gi, '')
      .trim();

    // 1. First attempt: Try Gemini Image Generation if API key is present
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        // Attempt with gemini-2.5-flash-image
        const imageRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: `Generate a high quality vertical 9:16 3D Pixar animation style illustration for kids: ${cleanPrompt}`,
        });

        for (const part of imageRes.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData?.data && part.inlineData.mimeType) {
            const dataUri = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            return NextResponse.json({
              success: true,
              imageUrl: dataUri,
              provider: 'gemini-imagen',
              scriptId,
            });
          }
        }
      } catch (geminiError: unknown) {
        console.warn(
          'Gemini Imagen unavailable (quota limit or unbilled tier), falling back to high-speed AI image renderer:',
          (geminiError as Error)?.message?.slice(0, 100)
        );
      }
    }

    // 2. High-speed Fallback: Free AI Image Renderer (Vertical 9:16 576x1024)
    const encodedPrompt = encodeURIComponent(cleanPrompt.slice(0, 400));
    const seed = Math.floor(Math.random() * 100000);
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=576&height=1024&nologo=true&seed=${seed}`;

    const imgResponse = await fetch(fallbackUrl);
    if (!imgResponse.ok) {
      throw new Error(`Image service returned status: ${imgResponse.status}`);
    }

    const arrayBuffer = await imgResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = imgResponse.headers.get('content-type') || 'image/jpeg';
    const base64Data = buffer.toString('base64');
    const dataUri = `data:${contentType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUri,
      provider: 'ai-renderer',
      scriptId,
    });
  } catch (error: unknown) {
    console.error('API /api/generate-image error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate image preview',
      },
      { status: 500 }
    );
  }
}
