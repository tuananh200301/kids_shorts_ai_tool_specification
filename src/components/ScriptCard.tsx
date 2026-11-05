'use client';

import React, { useState } from 'react';
import { VideoScript } from '@/lib/types';
import { CopyButton } from './CopyButton';
import {
  Volume2,
  Sparkles,
  Video,
  Image as ImageIcon,
  Loader2,
  Download,
  RefreshCw,
  Maximize2,
  X,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ScriptCardProps {
  script: VideoScript;
  index: number;
}

function YoutubeIcon({ className = 'w-4 h-4 text-red-500' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function ScriptCard({ script, index }: ScriptCardProps) {
  const { t } = useLanguage();

  const [previewImage, setPreviewImage] = useState<string | null>(script.previewImageUrl || null);
  const [isGeneratingImg, setIsGeneratingImg] = useState<boolean>(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Compute YouTube title & description fallbacks
  const youtubeTitle =
    script.youtubeTitle && script.youtubeTitle.trim().length > 0
      ? script.youtubeTitle
      : `${script.title} 🎈✨ #Shorts`;

  const youtubeDescription =
    script.youtubeDescription && script.youtubeDescription.trim().length > 0
      ? script.youtubeDescription
      : `Watch this cute 5-7 second loop: ${script.title}! 🎉\n\n✨ Pacing: ${script.timeline.hook_0_to_2s} -> ${script.timeline.action_2_to_5s}\n\n💖 Subscribe to our channel for more magical toddler animations and cute cartoons!\n\n${script.hashtags.join(' ')}`;

  // Handle direct image generation
  const handleGenerateImage = async () => {
    setIsGeneratingImg(true);
    setImgError(null);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: script.prompts.imagePrompt,
          scriptId: script.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate image preview');
      }

      setPreviewImage(data.imageUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error generating image';
      setImgError(msg);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  // Download image helper
  const handleDownloadImage = () => {
    if (!previewImage) return;
    const link = document.createElement('a');
    link.href = previewImage;
    link.download = `${script.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_preview.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format the full package text for 1-click clipboard export
  const fullScriptText = `🎬 TITLE: ${script.title}
🎯 CATEGORY: ${script.category}
🔊 ${t.scriptCard.sfxPrefix} ${script.recommendedSoundEffect}

📌 YOUTUBE TITLE:
${youtubeTitle}

📝 YOUTUBE DESCRIPTION:
${youtubeDescription}

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
    <>
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
                <span>
                  {t.scriptCard.sfxPrefix} {script.recommendedSoundEffect}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 self-start">
            {/* Generate Image Button if not yet generated */}
            {!previewImage && !isGeneratingImg && (
              <button
                type="button"
                onClick={handleGenerateImage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 text-white shadow-md shadow-purple-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>{t.scriptCard.generateImageBtn}</span>
              </button>
            )}

            {/* Copy Whole Script Bundle */}
            <CopyButton
              textToCopy={fullScriptText}
              label={t.scriptCard.copyBundle}
              copiedLabel={t.scriptCard.bundleCopied}
              className="text-xs bg-zinc-800 text-zinc-200 border-zinc-700"
            />
          </div>
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

        {/* AI Image Preview Container (When generating or generated) */}
        {(isGeneratingImg || previewImage || imgError) && (
          <div className="p-4 rounded-xl bg-zinc-950/90 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-purple-500/20 text-purple-300">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-purple-300">
                  {t.scriptCard.previewBadge}
                </span>
              </div>

              {previewImage && !isGeneratingImg && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
                    title={t.scriptCard.viewFullscreen}
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>{t.scriptCard.viewFullscreen}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadImage}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
                    title={t.scriptCard.downloadImage}
                  >
                    <Download className="w-3 h-3 text-emerald-400" />
                    <span>{t.scriptCard.downloadImage}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
                    title={t.scriptCard.regenerateImage}
                  >
                    <RefreshCw className="w-3 h-3 text-amber-400" />
                    <span>{t.scriptCard.regenerateImage}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isGeneratingImg && (
              <div className="flex flex-col items-center justify-center p-8 space-y-3 text-center bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <Sparkles className="w-5 h-5 text-amber-300 absolute top-3.5 left-3.5 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-200">{t.scriptCard.generatingImage}</p>
                  <p className="text-[11px] text-zinc-400">Pixar 3D 9:16 Vertical Render</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {imgError && !isGeneratingImg && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{imgError}</span>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateImage}
                  className="px-2.5 py-1 rounded bg-red-900/60 hover:bg-red-800 text-white font-medium text-[11px]"
                >
                  {t.scriptCard.regenerateImage}
                </button>
              </div>
            )}

            {/* Rendered Preview Image */}
            {previewImage && !isGeneratingImg && (
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div
                  onClick={() => setIsLightboxOpen(true)}
                  className="relative group cursor-pointer w-44 sm:w-52 aspect-[9/16] rounded-xl overflow-hidden shrink-0 border border-purple-500/40 shadow-xl bg-zinc-950"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewImage}
                    alt={script.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-medium text-xs">
                    <Maximize2 className="w-4 h-4" />
                    <span>{t.scriptCard.viewFullscreen}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-xs text-zinc-300">
                  <p className="font-semibold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {script.title} — Keyframe Concept
                  </p>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Ảnh mẫu trực quan tỷ lệ 9:16 được sinh từ prompt chính xác. Bạn có thể tải về để sử dụng trực tiếp làm thumbnail, storyboard hoặc đưa vào Kling / Runway để tạo video.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* YouTube Upload Ready Section (Title & Description) */}
        <div className="bg-zinc-950/90 border border-red-500/20 rounded-xl p-4 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <YoutubeIcon className="w-4 h-4 text-red-500" />
              <h4 className="text-xs font-bold text-white tracking-wide">
                {t.scriptCard.youtubeSectionTitle}
              </h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950/60 border border-red-800/40 text-red-300 font-medium">
              Ready to Paste
            </span>
          </div>

          {/* YouTube Title Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span>{t.scriptCard.youtubeTitleLabel}</span>
                <span className="text-[10px] font-mono text-zinc-500">
                  ({youtubeTitle.length} chars)
                </span>
              </div>
              <CopyButton
                textToCopy={youtubeTitle}
                label={t.scriptCard.copyTitleBtn}
                copiedLabel={t.scriptCard.titleCopied}
                className="text-[11px] py-1 px-2.5 bg-zinc-800 text-zinc-200"
              />
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-100 select-all leading-relaxed">
              {youtubeTitle}
            </div>
          </div>

          {/* YouTube Description Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.scriptCard.youtubeDescLabel}</span>
              </div>
              <CopyButton
                textToCopy={youtubeDescription}
                label={t.scriptCard.copyDescBtn}
                copiedLabel={t.scriptCard.descCopied}
                className="text-[11px] py-1 px-2.5 bg-zinc-800 text-zinc-200"
              />
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 whitespace-pre-line select-all leading-relaxed max-h-36 overflow-y-auto font-sans">
              {youtubeDescription}
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
              <div className="flex items-center gap-2">
                {!previewImage && !isGeneratingImg && (
                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow transition"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{t.scriptCard.generateImageBtn}</span>
                  </button>
                )}
                <CopyButton
                  textToCopy={script.prompts.imagePrompt}
                  label={t.scriptCard.copyImagePrompt}
                  copiedLabel={t.scriptCard.promptCopied}
                />
              </div>
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

      {/* Lightbox Modal */}
      {isLightboxOpen && previewImage && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm sm:max-w-md w-full bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl p-3 space-y-3"
          >
            <div className="flex items-center justify-between px-2">
              <h4 className="text-xs font-bold text-white truncate">{script.title}</h4>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt={script.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-[11px] text-zinc-400">9:16 Shorts Format</span>
              <button
                type="button"
                onClick={handleDownloadImage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.scriptCard.downloadImage}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
