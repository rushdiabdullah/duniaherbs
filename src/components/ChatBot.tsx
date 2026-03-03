'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const EMMA_INTRO = `Hai! 👋 Saya **Emma** — pembantu jualan Dunia Herbs.

Saya boleh tolong anda cari produk lotion pati halia yang sesuai — sama ada untuk ibu berpantang, ketidakselesaan sendi, gym, atau kegunaan harian.

Tanya apa sahaja, saya sedia membantu! 💬`;

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, append, isLoading, error } = useChat({
    api: '/api/chat',
    id: 'emma-chat',
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendQuickReply(text: string) {
    if (isLoading) return;
    append({ role: 'user', content: text });
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-herb-gold text-herb-dark shadow-lg shadow-herb-gold/20 transition hover:bg-herb-goldLight"
        style={{
          bottom: 'max(1.5rem, env(safe-area-inset-bottom, 24px))',
          right: 'max(1.5rem, env(safe-area-inset-right, 24px))',
        }}
        aria-label={open ? 'Tutup chat' : 'Buka chat'}
        initial={reduceMotion ? undefined : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reduceMotion ? { duration: 0 } : { delay: 0.5, type: 'spring', stiffness: 200 }}
        whileHover={reduceMotion ? undefined : { scale: 1.08 }}
        whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </motion.button>

      {open && (
        <div
          className="fixed z-40 flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-blue-950/50 bg-herb-surface shadow-xl"
          style={{
            bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
            right: 'max(1.5rem, env(safe-area-inset-right, 24px))',
          }}
        >
          <div className="border-b border-blue-950/50 bg-herb-card px-4 py-3">
            <h3 className="font-semibold text-herb-gold">Emma 💬</h3>
            <p className="text-xs text-stone-500">Pembantu Jualan Dunia Herbs • Online</p>
          </div>

          <div className="flex h-80 flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-herb-card text-stone-200 border border-blue-950/50">
                    <div className="chat-markdown [&_strong]:font-semibold [&_strong]:text-inherit [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-2 [&_li]:my-0.5 [&_p]:my-1 first:[&_p]:mt-0 last:[&_p]:mb-0">
                      <ReactMarkdown>{EMMA_INTRO}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-red-950/50 text-red-200 border border-red-900/50">
                    {error.message}
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === 'user'
                        ? 'bg-herb-gold text-herb-dark'
                        : 'bg-herb-card text-stone-200 border border-blue-950/50'
                    }`}
                  >
                    {m.role === 'user' ? (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    ) : (
                      <div className="chat-markdown [&_strong]:font-semibold [&_strong]:text-inherit [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-2 [&_li]:my-0.5 [&_p]:my-1 first:[&_p]:mt-0 last:[&_p]:mb-0">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}
              className="border-t border-blue-950/50 p-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Tulis mesej..."
                  className="flex-1 rounded-xl border border-stone-600 bg-herb-dark px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:border-herb-gold focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="rounded-xl bg-herb-gold px-4 py-2.5 text-sm font-medium text-herb-dark transition hover:bg-herb-goldLight disabled:opacity-50"
                >
                  Hantar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
