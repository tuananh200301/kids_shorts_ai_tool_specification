'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  iconOnly?: boolean;
}

export function CopyButton({
  textToCopy,
  label,
  copiedLabel,
  className = '',
  iconOnly = false,
}: CopyButtonProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const displayLabel = label ?? t.common.copy;
  const displayCopiedLabel = copiedLabel ?? t.common.copied;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      title={copied ? displayCopiedLabel : displayLabel}
      className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
        copied
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in duration-200" />
          {!iconOnly && <span>{displayCopiedLabel}</span>}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-zinc-400" />
          {!iconOnly && <span>{displayLabel}</span>}
        </>
      )}
    </button>
  );
}
