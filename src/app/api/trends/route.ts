import { NextRequest, NextResponse } from 'next/server';
import { fetchTrendingKidsShorts } from '@/lib/youtube';
import { KidsCategory, Timeframe } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category') || 'animals';
    const timeframeParam = searchParams.get('timeframe') || 'day';

    const validCategories: KidsCategory[] = ['animals', 'colors', 'vehicles', 'nursery_fun', 'surprises'];
    const validTimeframes: Timeframe[] = ['day', 'week'];

    const category: KidsCategory = validCategories.includes(categoryParam as KidsCategory)
      ? (categoryParam as KidsCategory)
      : 'animals';

    const timeframe: Timeframe = validTimeframes.includes(timeframeParam as Timeframe)
      ? (timeframeParam as Timeframe)
      : 'day';

    const trends = await fetchTrendingKidsShorts(category, timeframe);

    return NextResponse.json({
      success: true,
      data: trends,
    });
  } catch (error: unknown) {
    console.error('API /api/trends error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch trending topics',
      },
      { status: 500 }
    );
  }
}
