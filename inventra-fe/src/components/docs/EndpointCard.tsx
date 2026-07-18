'use client';

import React from 'react';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { CodeSnippet, SnippetTab } from './CodeSnippet';
import { Trans } from "@lingui/macro";

export interface ParamField {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface EndpointCardProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  tier?: 'Starter' | 'Professional' | 'Enterprise';
  params?: ParamField[];
  bodyParams?: ParamField[];
  snippetTabs?: SnippetTab[];
  children?: React.ReactNode;
}

export const EndpointCard: React.FC<EndpointCardProps> = ({
  method,
  path,
  title,
  description,
  tier = 'Starter',
  params,
  bodyParams,
  snippetTabs,
  children,
}) => {
  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'GET':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'POST':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'PUT':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'DELETE':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  const getTierBadge = (t: string) => {
    switch (t) {
      case 'Starter':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {/* @ts-ignore */}<Trans>Starter+</Trans></span>
        );
      case 'Professional':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> {/* @ts-ignore */}<Trans>Professional+</Trans></span>
        );
      case 'Enterprise':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5" /> {/* @ts-ignore */}<Trans>Enterprise Only</Trans></span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm my-8">
      {/* Top Header & Tier Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          {title}
        </h3>
        <div>{getTierBadge(tier)}</div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        {description}
      </p>

      {/* HTTP Method + Path Bar */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-sm mb-6">
        <span
          className={`px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider border ${getMethodBadge(
            method
          )}`}
        >
          {method}
        </span>
        <span className="font-semibold text-slate-800 dark:text-slate-200 overflow-x-auto">
          {path}
        </span>
      </div>

      {/* Query/Path Parameters Table */}
      {params && params.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {/* @ts-ignore */}<Trans>Query / Path Parameters</Trans></h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">{/* @ts-ignore */}<Trans>Parameter</Trans></th>
                  <th className="px-4 py-3">{/* @ts-ignore */}<Trans>Tipe</Trans></th>
                  <th className="px-4 py-3">{/* @ts-ignore */}<Trans>Wajib</Trans></th>
                  <th className="px-4 py-3">{/* @ts-ignore */}<Trans>Deskripsi</Trans></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {params.map((p) => (
                  <tr key={p.name}>
                    <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {p.type}
                    </td>
                    <td className="px-4 py-3">
                      {p.required ? (
                        <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
                          {/* @ts-ignore */}<Trans>Wajib</Trans></span>
                      ) : (
                        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {/* @ts-ignore */}<Trans>Opsional</Trans></span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">
                      {p.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Body Parameters Table */}
      {bodyParams && bodyParams.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {/* @ts-ignore */}<Trans>Request Body JSON</Trans></h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">{/* @ts-ignore */}<Trans>Key</Trans></th>
                  <th className="px-4 py-3">{/* @ts-ignore */}<Trans>Tipe</Trans></th>
                  <th className="px-4 py-3">{/* @ts-ignore */}<Trans>Wajib</Trans></th>
                  <th className="px-4 py-3">{/* @ts-ignore */}<Trans>Deskripsi</Trans></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {bodyParams.map((p) => (
                  <tr key={p.name}>
                    <td className="px-4 py-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {p.type}
                    </td>
                    <td className="px-4 py-3">
                      {p.required ? (
                        <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
                          {/* @ts-ignore */}<Trans>Wajib</Trans></span>
                      ) : (
                        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {/* @ts-ignore */}<Trans>Opsional</Trans></span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">
                      {p.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Code Snippets */}
      {snippetTabs && snippetTabs.length > 0 && (
        <CodeSnippet tabs={snippetTabs} title="Contoh Request & Response" />
      )}

      {children}
    </div>
  );
};
