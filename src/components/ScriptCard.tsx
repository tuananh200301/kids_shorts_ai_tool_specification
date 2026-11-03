'use client';

import React from 'react';
import { VideoScript } from '@/lib/types';
import { CopyButton } from './CopyButton';
import { Volume2, Sparkles, Video, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ScriptCardProps {
  script: VideoScript;
  index: number;
}

export function ScriptCard({ script, index }: ScriptCardProps) {
  const { t } = useLanguage();

  // Format the full package text for 1-click clipboard export
  const fullScriptText = `🎬 TITLE: ${script.title}
🎯 CATEGORY: ${script.category}
🔊 ${t.scriptCard.sfxPrefix} ${script.recommendedSoundEffect}

⏱️ ${t.scriptCard.timelineTitle}:
• ${t.scriptCard.hookTitle}: ${script.timeline.hook_0_to_2s}
• ${t.scriptCard.actionTitle}: ${script.timeline.action_2_to_5s}
• ${t.scriptCard.loopTitle}: ${script.timeline.loop_payoff_5_to_7s}

🏷️ HASHTAGS:
${script.hashtags.join(' ')}

🎨 ${t.scriptCard.imagePromptTitle}:
${script.prompts.imagePrompt}

🎥 ${t.scriptCard.motionPromptTitle}:
${script.prompts.motionPrompt}
`;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl p-5 sm:p-6 space-y-5 transition-all shadow-xl shadow-black/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/30">
              #{index + 1}
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">{script.title}</h3>
          </div>

          {/* Sound FX Pill */}
          <div className="flex items-center gap-2 pt-0.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.scriptCard.sfxPrefix} {script.recommendedSoundEffect}</span>
            </div>
          </div>
        </div>

        {/* Copy Whole Script Bundle */}
        <CopyButton
          textToCopy={fullScriptText}
          label={t.scriptCard.copyBundle}
          copiedLabel={t.scriptCard.bundleCopied}
          className="self-start text-xs bg-zinc-800 text-zinc-200 border-zinc-700"
        />
      </div>

      {/* 3-Part Micro-Timeline */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          {t.scriptCard.timelineTitle}
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Step 1: Hook */}
          <div className="bg-zinc-950/70 border border-rose-500/20 rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-rose-400">
              <span>{t.scriptCard.hookTitle}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/20">
                {t.scriptCard.hookBadge}
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{script.timeline.hook_0_to_2s}</p>
          </div>

          {/* Step 2: Action */}
          <div className="bg-zinc-950/70 border border-amber-500/20 rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
              <span>{t.scriptCard.actionTitle}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                {t.scriptCard.actionBadge}
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{script.timeline.action_2_to_5s}</p>
          </div>

          {/* Step 3: Loop */}
          <div className="bg-zinc-950/70 border border-emerald-500/20 rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
              <span>{t.scriptCard.loopTitle}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                {t.scriptCard.loopBadge}
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{script.timeline.loop_payoff_5_to_7s}</p>
          </div>
        </div>
      </div>

      {/* Prompts Section */}
      <div className="space-y-3 pt-1">
        {/* Midjourney / Flux Prompt */}
        <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.scriptCard.imagePromptTitle}</span>
            </div>
            <CopyButton
              textToCopy={script.prompts.imagePrompt}
              label={t.scriptCard.copyImagePrompt}
              copiedLabel={t.scriptCard.promptCopied}
            />
          </div>
          <p className="text-xs font-mono text-zinc-300 bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-800 leading-relaxed select-all">
            {script.prompts.imagePrompt}
          </p>
        </div>

        {/* Kling / Runway Motion Prompt */}
        <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.scriptCard.motionPromptTitle}</span>
            </div>
            <CopyButton
              textToCopy={script.prompts.motionPrompt}
              label={t.scriptCard.copyMotionPrompt}
              copiedLabel={t.scriptCard.promptCopied}
            />
          </div>
          <p className="text-xs font-mono text-zinc-300 bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-800 leading-relaxed select-all">
            {script.prompts.motionPrompt}
          </p>
        </div>
      </div>

      {/* Hashtags Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
        <div className="flex flex-wrap gap-1.5">
          {script.hashtags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-400 font-medium hover:text-pink-300 transition"
            >
              {tag}
            </span>
          ))}
        </div>

        <CopyButton
          textToCopy={script.hashtags.join(' ')}
          label={t.scriptCard.copyHashtags}
          copiedLabel={t.scriptCard.tagsCopied}
          className="text-[11px]"
        />
      </div>
    </div>
  );
}
