'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/ui/alert/Alert';
import { askGemini } from '../../../../../services/dashboard.service';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const { _ } = useLingui();

  const QUICK_QUESTIONS = [
    _(msg`Produk apa yang paling laris bulan ini?`),
    _(msg`Bagaimana kondisi keuangan bisnis saya?`),
    _(msg`Produk apa yang perlu di-restock?`),
    _(msg`Berikan analisis keuntungan bisnis saya`),
    _(msg`Berapa total pemasukan dan pengeluaran?`),
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      content: _(msg`Halo! 👋 Saya adalah asisten AI Inventra. Saya bisa membantu Anda menganalisis data bisnis:\n\n• 📦 Stok & inventori\n• 💰 Keuangan & transaksi\n• 📊 Penjualan & tren\n\nSilakan tanyakan apa saja tentang bisnis Anda!`),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (question?: string) => {
    const text = question || input.trim();
    if (!text || sending) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const res = await askGemini(text);
      let aiText = '';
      if (res.status) {
        if (typeof res.data === 'string') {
          aiText = res.data;
        } else if (res.data?.text) {
          aiText = res.data.text;
        } else if (res.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiText = res.data.candidates[0].content.parts[0].text;
        } else {
          aiText = JSON.stringify(res.data);
        }
      } else {
        aiText = res.message || _(msg`Maaf, saya tidak bisa menjawab saat ini.`);
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      toast.error(_(msg`Gagal mengirim pesan. Silakan coba lagi.`));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <PageBreadcrumb pageTitle="Chatbot AI" />


      {/* Chat Container */}
      <div className="flex-1 flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] lg:max-w-[65%]`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-brand-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-bl-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                </div>
                <div className={`mt-1 text-xs text-gray-400 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.role === 'assistant' && <span className="mr-1">🤖</span>}
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 dark:bg-gray-800">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>


        {messages.length <= 1 && (
          <div className="px-4 md:px-6 pb-3">
            <p className="text-xs text-gray-400 mb-2"><Trans id="Pertanyaan cepat:" /></p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={sending}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-brand-500/10 dark:hover:border-brand-500/30 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={_(msg`Tanyakan sesuatu tentang bisnis Anda...`)}
                rows={1}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500 dark:focus:ring-brand-500/20 transition-all"
                style={{ maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
            </div>
            <Button
              size="sm"
              onClick={() => sendMessage()}
              disabled={sending || !input.trim()}
              className="h-11 px-4"
            >
              {sending ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </Button>
          </div>
          <p className="mt-2 text-xs text-gray-400 text-center">
            <Trans id="AI menganalisis data produk, penjualan, dan keuangan bisnis Anda secara real-time" />
          </p>
        </div>
      </div>
    </div>
  );
}
