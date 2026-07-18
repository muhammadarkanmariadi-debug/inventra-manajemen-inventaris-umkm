'use client';

import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Trans } from "@lingui/macro";

export interface FAQItem {
  id: string;
  category: string;
  categoryLabel: string;
  question: string;
  answer: string | React.ReactNode;
}

interface FAQAccordionProps {
  items: FAQItem[];
  openIds: string[];
  onToggle: (id: string) => void;
  showCategoryLabel?: boolean;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  openIds,
  onToggle,
  showCategoryLabel = false,
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-background border border-dashed border-border rounded-2xl p-12 text-center my-6">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-foreground mb-1">
          {/* @ts-ignore */}<Trans>Pertanyaan Tidak Ditemukan</Trans></h4>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {/* @ts-ignore */}<Trans>Tidak ada pertanyaan FAQ yang cocok dengan kata kunci pencarian atau kategori yang dipilih.</Trans></p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div
            key={item.id}
            className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'bg-background border-brand-500/50 shadow-lg shadow-brand-500/5 ring-1 ring-brand-500/20'
                : 'bg-background border-border hover:border-border/80'
            }`}
          >
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              className="w-full flex items-center justify-between text-left px-6 py-5 gap-4 focus:outline-none"
              aria-expanded={isOpen}
            >
              <div className="flex flex-col gap-1.5 flex-1 pr-2">
                {showCategoryLabel && (
                  <span className="inline-block self-start text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-500 border border-brand-500/20">
                    {item.categoryLabel}
                  </span>
                )}
                <span className="text-base sm:text-lg font-bold text-foreground leading-snug">
                  {item.question}
                </span>
              </div>
              <div
                className={`p-2 rounded-xl transition-all duration-300 shrink-0 ${
                  isOpen
                    ? 'bg-brand-600 text-white rotate-180'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            <div
              className={`transition-all duration-300 ease-in-out px-6 ${
                isOpen ? 'max-h-96 opacity-100 pb-6 pt-1' : 'max-h-0 opacity-0 py-0'
              } overflow-hidden`}
            >
              <div className="text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border pt-4">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
