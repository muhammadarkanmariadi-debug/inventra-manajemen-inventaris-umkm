"use client";

import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useTranslate } from "@/hooks/useTranslate";

export interface SnippetTab {
  id: 'curl' | 'js' | 'json';
  label: string;
  code: string;
}

interface CodeSnippetProps {
  tabs: SnippetTab[];
  title?: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ tabs, title }) => {
  const [activeTab, setActiveTab] = useState<SnippetTab['id']>(tabs[0]?.id || 'curl');
  const [copied, setCopied] = useState(false);
  const { _ } = useTranslate();

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  const handleCopy = async () => {
    if (!currentTab) return;
    try {
      await navigator.clipboard.writeText(currentTab.code);
      setCopied(true);
      toast.success(_("Kode berhasil disalin ke clipboard!"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(_("Gagal menyalin kode"));
    }
  };

  const getIcon = (id: SnippetTab['id']) => {
    switch (id) {
      case 'curl':
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'js':
        return <Code2 className="w-4 h-4 text-amber-400" />;
      case 'json':
        return <FileJson className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl my-6 font-mono text-sm">
      {/* Top Header / Tab Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800/80">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-1.5 mr-3">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {title && (
            <span className="text-xs font-semibold text-slate-400 font-sans mr-4 hidden md:inline">
              {title}
            </span>
          )}

          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {getIcon(tab.id)}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Salin kode"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-sans transition-colors border border-slate-700/60"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">{/* @ts-ignore */}<Trans>Disalin!</Trans></span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{/* @ts-ignore */}<Trans>Copy</Trans></span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-5 overflow-x-auto text-slate-200 leading-relaxed custom-scrollbar bg-slate-950/95">
        <pre className="whitespace-pre">
          <code>{currentTab?.code || ''}</code>
        </pre>
      </div>
    </div>
  );
};
