'use client';

import React from 'react';
import { TrendAnalysisResult } from '@/lib/types';
import { CopyButton } from './CopyButton';
import { TrendingUp, Hash, Eye, ExternalLink, Sparkles, Flame, Tag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TrendingTagsPanelProps {
  trends: TrendAnalysisResult | null;
  isLoading: boolean;
  onTagClick?: (tag: string) => void;
}

function formatViews(views: number, lang: string): string {
  if (views >= 1_000_000) {
    const millionSuffix = lang === 'vi' ? 'Tr' : 'M';
    return `${(views / 1_000_000).toFixed(1)}${millionSuffix}`;
  }
  if (views >= 1_000) {
    const thousandSuffix = lang === 'vi' ? 'N' : 'K';
    return `${(views / 1_000).toFixed(0)}${thousandSuffix}`;
  }
  return views.toString();
}

export function TrendingTagsPanel({ trends, isLoading, onTagClick }: TrendingTagsPanelProps) {
  const { lang, t } = useLanguage();

  if (isLoading) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-6 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-zinc-800 rounded-full" />
          <div className="w-36 h-5 bg-zinc-800 rounded-lg" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-20 h-7 bg-zinc-800 rounded-lg" />
          ))}
        </div>
        <div className="space-y-3 pt-4">
          <div className="w-48 h-4 bg-zinc-800 rounded" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-zinc-800/80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!trends) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500">
        <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-400" />
        <p className="text-sm">{t.trendingPanel.emptyText}</p>
      </div>
    );
  }

  const allTagsString = trends.topHashtags.map((h) => h.tag).join(' ');

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-6 backdrop-blur">
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              {t.trendingPanel.title}
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-normal">
                {trends.timeframe === 'day' ? t.trendingPanel.timeframeDay : t.trendingPanel.timeframeWeek}
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">{t.trendingPanel.subtitle}</p>
          </div>
        </div>

        <CopyButton
          textToCopy={allTagsString}
          label={t.trendingPanel.copyAllTags}
          copiedLabel={t.trendingPanel.tagsCopied}
          className="text-[11px] py-1 px-2.5 bg-zinc-800 text-zinc-200"
        />
      </div>

      {/* Hashtag Cloud */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-pink-400" />
            {t.trendingPanel.topHashtagsTitle}
          </span>
          <span className="text-[11px] text-zinc-500">{t.trendingPanel.clickToCopy}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {trends.topHashtags.map(({ tag, count }) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick?.(tag)}
              className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all text-xs text-zinc-300 hover:text-white"
              title={`${t.trendingPanel.clickToCopy} ${tag} (${count})`}
            >
              <span className="text-pink-400 font-semibold group-hover:text-pink-300">{tag}</span>
              <span className="text-[10px] text-zinc-500 font-mono bg-zinc-800/80 px-1.5 py-0.2 rounded group-hover:bg-zinc-700 group-hover:text-zinc-300">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Common Niche Keywords */}
      {trends.commonKeywords && trends.commonKeywords.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-800/60">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.trendingPanel.sensoryKeywordsTitle}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {trends.commonKeywords.map((kw) => (
              <span
                key={kw}
                className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top Reference Shorts */}
      <div className="space-y-3 pt-2 border-t border-zinc-800/60">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t.trendingPanel.benchmarkShortsTitle}
          </span>
          <span className="text-[11px] text-zinc-500">{t.trendingPanel.sortedByViews}</span>
        </div>

        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {trends.trendingVideos.map((video) => (
            <div
              key={video.id}
              className="group flex items-start gap-3 p-2.5 rounded-xl bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-800/70 hover:border-zinc-700 transition"
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-zinc-800 border border-zinc-700/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 backdrop-blur text-[9px] font-bold text-white flex items-center gap-0.5">
                  <Eye className="w-2.5 h-2.5 text-amber-400" />
                  {formatViews(video.viewCount, lang)}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-zinc-200 hover:text-indigo-400 line-clamp-2 transition flex items-center gap-1"
                >
                  <span>{video.title}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition shrink-0" />
                </a>

                <p className="text-[11px] text-zinc-500 truncate">{video.channelTitle}</p>

                {video.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {video.hashtags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] text-pink-400/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
