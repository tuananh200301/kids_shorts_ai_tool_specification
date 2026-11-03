'use client';

import React from 'react';
import { Sparkles, Film, ShieldCheck, Repeat, Bot, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  isMockTrends?: boolean;
  isMockScripts?: boolean;
}

function YoutubeIcon({ className = 'w-3 h-3 text-red-500' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function Header({ isMockTrends = true, isMockScripts = true }: HeaderProps) {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-indigo-500 p-[2px] shadow-lg shadow-pink-500/10">
            <div className="w-full h-full bg-zinc-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                {t.header.title}
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {t.header.badge}
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400">
              {t.header.subtitle}
            </p>
          </div>
        </div>

        {/* Right Controls: Feature Pills & Language Switcher */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Feature Pills */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Repeat className="w-3.5 h-3.5 text-pink-400" />
            <span>{t.header.zeroSeamLoop}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.header.coppaKidSafe}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.header.pixar3D}</span>
          </div>

          {/* Source indicator pills */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isMockTrends
                ? 'bg-amber-950/40 border-amber-800/50 text-amber-300'
                : 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
            }`}
            title={isMockTrends ? t.header.trendsTooltipSimulated : t.header.trendsTooltipLive}
          >
            <YoutubeIcon className="w-3 h-3 text-red-400" />
            <span>{isMockTrends ? t.header.trendsSimulated : t.header.trendsLive}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isMockScripts
                ? 'bg-purple-950/40 border-purple-800/50 text-purple-300'
                : 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
            }`}
            title={isMockScripts ? t.header.aiTooltipProcedural : t.header.aiTooltipGemini}
          >
            <Bot className="w-3 h-3 text-cyan-400" />
            <span>{isMockScripts ? t.header.aiProcedural : t.header.aiGemini}</span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center p-0.5 bg-zinc-900 border border-zinc-800 rounded-xl ml-1">
            <button
              type="button"
              onClick={() => setLang('vi')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                lang === 'vi'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Chuyển sang Tiếng Việt"
            >
              <span>🇻🇳</span>
              <span>VI</span>
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                lang === 'en'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Switch to English"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
