'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { KidsCategory, Timeframe, TrendAnalysisResult, VideoScript } from '@/lib/types';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { TrendingTagsPanel } from '@/components/TrendingTagsPanel';
import { ScriptCard } from '@/components/ScriptCard';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Film, RefreshCw, AlertCircle, Copy, Check } from 'lucide-react';

export default function KidsShortsDashboard() {
  const { t, lang } = useLanguage();
  const [timeframe, setTimeframe] = useState<Timeframe>('day');
  const [category, setCategory] = useState<KidsCategory>('animals');
  const [scriptCount, setScriptCount] = useState<number>(3);

  const [trends, setTrends] = useState<TrendAnalysisResult | null>(null);
  const [scripts, setScripts] = useState<VideoScript[]>([]);
  const [isTrendsLoading, setIsTrendsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Fetch trends from API
  const fetchTrends = useCallback(
    async (cat = category, tf = timeframe) => {
      setIsTrendsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/trends?category=${cat}&timeframe=${tf}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch trends');
        }
        setTrends(data.data);
        return data.data as TrendAnalysisResult;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        return null;
      } finally {
        setIsTrendsLoading(false);
      }
    },
    [category, timeframe]
  );

  // 2. Generate scripts from API
  const generateScripts = useCallback(
    async (cat = category, tags: string[] = [], count = scriptCount) => {
      setIsGenerating(true);
      setError(null);
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: cat,
            trendsSummary: tags,
            count,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to generate scripts');
        }
        setScripts(data.data.scripts);
        showToast(t.dashboard.toastGenerated(data.data.scripts.length));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
      } finally {
        setIsGenerating(false);
      }
    },
    [category, scriptCount, t]
  );

  // Combined action: Scan trends & generate
  const handleScanAndGenerate = async () => {
    const fetchedTrends = await fetchTrends(category, timeframe);
    const tags = fetchedTrends?.topHashtags?.map((h) => h.tag) || [];
    await generateScripts(category, tags, scriptCount);
  };

  // Initial load
  useEffect(() => {
    handleScanAndGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When category or timeframe changes, refresh trends automatically
  const handleCategoryChange = (newCat: KidsCategory) => {
    setCategory(newCat);
    fetchTrends(newCat, timeframe);
  };

  const handleTimeframeChange = (newTf: Timeframe) => {
    setTimeframe(newTf);
    fetchTrends(category, newTf);
  };

  // Quick hashtag click handler
  const handleTagClick = async (tag: string) => {
    try {
      await navigator.clipboard.writeText(tag);
      showToast(t.dashboard.toastCopiedTag(tag));
    } catch {
      showToast(t.dashboard.toastSelectedTag(tag));
    }
  };

  // Copy all scripts combined
  const copyAllScripts = async () => {
    if (scripts.length === 0) return;
    const combined = scripts
      .map(
        (s, i) => `=== SCRIPT #${i + 1}: ${s.title} ===
📌 YOUTUBE TITLE:
${s.youtubeTitle || `${s.title} 🎈✨ #Shorts`}

📝 YOUTUBE DESCRIPTION:
${s.youtubeDescription || `Watch this cute cartoon loop: ${s.title}!\n\n${s.hashtags.join(' ')}`}

SFX: ${s.recommendedSoundEffect}
Hook (0-2s): ${s.timeline.hook_0_to_2s}
Action (2-5s): ${s.timeline.action_2_to_5s}
Loop (5-7s): ${s.timeline.loop_payoff_5_to_7s}

Image Prompt:
${s.prompts.imagePrompt}

Motion Prompt:
${s.prompts.motionPrompt}

Tags: ${s.hashtags.join(' ')}
`
      )
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(combined);
      showToast(t.dashboard.toastCopiedAll);
    } catch {
      showToast(t.dashboard.toastCopyFailed);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Header
        isMockTrends={trends?.isMock ?? true}
        isMockScripts={scripts.length > 0 ? false : true}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-medium text-xs shadow-2xl shadow-indigo-500/30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Control Bar */}
        <FilterBar
          timeframe={timeframe}
          setTimeframe={handleTimeframeChange}
          category={category}
          setCategory={handleCategoryChange}
          count={scriptCount}
          setCount={setScriptCount}
          onScanAndGenerate={handleScanAndGenerate}
          onRefreshTrends={() => fetchTrends(category, timeframe)}
          isLoading={isTrendsLoading || isGenerating}
          isTrendsLoading={isTrendsLoading}
        />

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Trend Intelligence (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <TrendingTagsPanel
              trends={trends}
              isLoading={isTrendsLoading}
              onTagClick={handleTagClick}
            />
          </aside>

          {/* Right Column: Production-Ready Script Cards (8 cols) */}
          <section className="lg:col-span-8 space-y-5">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    {t.dashboard.scriptsSectionTitle}
                    {scripts.length > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                        {t.dashboard.readyBadge(scripts.length)}
                      </span>
                    )}
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    {t.dashboard.scriptsSectionSubtitle}
                  </p>
                </div>
              </div>

              {scripts.length > 0 && (
                <button
                  type="button"
                  onClick={copyAllScripts}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 hover:text-white border border-zinc-700 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.dashboard.copyAllConcepts}</span>
                </button>
              )}
            </div>

            {/* Script Cards Container */}
            {isGenerating ? (
              <div className="space-y-4">
                {Array.from({ length: scriptCount }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 animate-pulse"
                  >
                    <div className="flex justify-between items-center">
                      <div className="w-1/3 h-5 bg-zinc-800 rounded" />
                      <div className="w-24 h-6 bg-zinc-800 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-16 bg-zinc-800/80 rounded-xl" />
                      <div className="h-16 bg-zinc-800/80 rounded-xl" />
                      <div className="h-16 bg-zinc-800/80 rounded-xl" />
                    </div>
                    <div className="h-20 bg-zinc-800/60 rounded-xl" />
                    <div className="h-20 bg-zinc-800/60 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : scripts.length > 0 ? (
              <div className="space-y-5">
                {scripts.map((script, idx) => (
                  <ScriptCard key={script.id || idx} script={script} index={idx} />
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-12 text-center space-y-3">
                <Sparkles className="w-10 h-10 mx-auto text-zinc-600" />
                <h3 className="text-base font-semibold text-zinc-300">{t.dashboard.noScriptsTitle}</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  {t.dashboard.noScriptsText}
                </p>
                <button
                  type="button"
                  onClick={handleScanAndGenerate}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.dashboard.generateNow}</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        <p>{t.dashboard.footerText}</p>
      </footer>
    </div>
  );
}
