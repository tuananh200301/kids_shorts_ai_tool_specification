'use client';

import React from 'react';
import { Timeframe, KidsCategory } from '@/lib/types';
import { CATEGORIES } from '@/lib/prompts';
import { Calendar, Clock, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FilterBarProps {
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  category: KidsCategory;
  setCategory: (cat: KidsCategory) => void;
  count: number;
  setCount: (c: number) => void;
  onScanAndGenerate: () => void;
  onRefreshTrends: () => void;
  isLoading: boolean;
  isTrendsLoading: boolean;
}

export function FilterBar({
  timeframe,
  setTimeframe,
  category,
  setCategory,
  count,
  setCount,
  onScanAndGenerate,
  onRefreshTrends,
  isLoading,
  isTrendsLoading,
}: FilterBarProps) {
  const { t } = useLanguage();
  const categoryKeys = Object.keys(CATEGORIES) as KidsCategory[];

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40 backdrop-blur space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="space-y-1.5 flex-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {t.filterBar.nicheLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            {categoryKeys.map((catKey) => {
              const catInfo = CATEGORIES[catKey];
              const categoryTranslation = t.categories[catKey] || catInfo;
              const isSelected = category === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setCategory(catKey)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md shadow-pink-500/20 ring-2 ring-pink-400/30 font-semibold'
                      : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50'
                  }`}
                >
                  <span className="text-base">{catInfo.emoji}</span>
                  <span>{categoryTranslation.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeframe & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {t.filterBar.trendWindowLabel}
            </label>
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setTimeframe('day')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeframe === 'day'
                    ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.filterBar.last24h}</span>
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('week')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeframe === 'week'
                    ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.filterBar.past7Days}</span>
              </button>
            </div>
          </div>

          {/* Scripts Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {t.filterBar.conceptsLabel}
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="bg-zinc-950 text-xs font-medium text-zinc-200 border border-zinc-800 rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
            >
              <option value={3}>{t.filterBar.conceptsCount(3)}</option>
              <option value={4}>{t.filterBar.conceptsCount(4)}</option>
              <option value={5}>{t.filterBar.conceptsCount(5)}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-zinc-400">
          {t.filterBar.targetingPrefix}{' '}
          <span className="text-zinc-200 font-medium">
            {t.categories[category]?.description || CATEGORIES[category]?.description}
          </span>
        </p>

        <div className="flex items-center gap-2">
          {/* Refresh Trends Only */}
          <button
            type="button"
            onClick={onRefreshTrends}
            disabled={isTrendsLoading}
            title={t.filterBar.scanTrendsBtn}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 hover:text-white border border-zinc-700/60 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTrendsLoading ? 'animate-spin' : ''}`} />
            <span>{t.filterBar.scanTrendsBtn}</span>
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onScanAndGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:via-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{t.filterBar.harvestingAndGeneratingBtn}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>{t.filterBar.scanAndGenerateBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
