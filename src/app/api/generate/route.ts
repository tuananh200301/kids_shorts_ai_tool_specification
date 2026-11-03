import { NextRequest, NextResponse } from 'next/server';
import { generateKidsShortScripts } from '@/lib/llm';
import { KidsCategory } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category = 'animals', trendsSummary = [], count = 3 } = body;

    const validCategories: KidsCategory[] = ['animals', 'colors', 'vehicles', 'nursery_fun', 'surprises'];
    const safeCategory: KidsCategory = validCategories.includes(category) ? category : 'animals';

    const safeCount = Math.min(Math.max(Number(count) || 3, 1), 6);

    const result = await generateKidsShortScripts(safeCategory, trendsSummary, safeCount);

    return NextResponse.json({
      success: true,
      data: {
        scripts: result.scripts,
        category: safeCategory,
        isMock: result.isMock,
      },
    });
  } catch (error: unknown) {
    console.error('API /api/generate error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate scripts',
      },
      { status: 500 }
    );
  }
}
