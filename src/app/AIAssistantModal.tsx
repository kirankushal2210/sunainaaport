'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function AIAssistantModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Local state for input handling
  const [input, setInput] = useState('');

  // Vercel AI SDK chat hook
  const { messages, sendMessage, status, error } = useChat();

  const isLoading = status === 'streaming' || status === 'submitted';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput(''); // Clear input instantly

    // Send message to stream response from backend
    await sendMessage({
      text: userMessage,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-md h-[580px] bg-[#0E0E0E] text-[#E5E5E5] rounded-xl border border-[#262626] flex flex-col justify-between shadow-2xl overflow-hidden font-mono text-xs">
        
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#262626] bg-[#141414]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tracking-widest uppercase font-semibold text-[#A3A3A3]">
              AI ASSISTANT
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#A3A3A3] hover:text-white transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center p-6 text-[#737373] leading-relaxed">
              Ask me anything about Sunaina&apos;s experience, design philosophy, or portfolio projects.
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <span className="text-[10px] text-[#525252] mb-1 uppercase tracking-wider">
                  {m.role === 'user' ? 'YOU' : 'ASSISTANT'}
                </span>
                <div
                  className={`p-3.5 rounded-lg max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#262626] text-white border border-[#333333]'
                      : 'bg-[#171717] text-[#D4D4D4] border border-[#262626]'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-sm">
                    {m.parts?.map((part, idx) => {
                      if (part.type === 'text') {
                        return <span key={idx}>{part.text}</span>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="text-[#737373] text-[11px] animate-pulse">
              Assistant is thinking...
            </div>
          )}
          {error && (
            <div className="text-red-400 text-[11px]">
              {error.message || 'Something went wrong. Please try again.'}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-[#262626] bg-[#141414] flex gap-2 items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-[#0E0E0E] border border-[#262626] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#525252] focus:outline-none focus:border-[#525252] transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#E5E5E5] hover:bg-white text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isLoading ? '...' : 'SEND'}
          </button>
        </form>

      </div>
    </div>
  );
}
