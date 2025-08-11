import React, { useMemo, useState } from 'react';
import { Search, Send, MessageSquare } from 'lucide-react';

type Thread = {
  id: string;
  name: string;
  last: string;
  unread?: number;
  messages: { id: string; mine?: boolean; text: string; ts: string }[];
};

const seed: Thread[] = [
  {
    id: '1',
    name: 'Aman (DSLR Camera)',
    last: 'Great, let’s finalize.',
    unread: 2,
    messages: [
      { id: 'm1', text: 'Hey, still available?', ts: '10:12' },
      { id: 'm2', mine: true, text: 'Yes! Want to trade for a monitor?', ts: '10:14' },
      { id: 'm3', text: 'Sounds good. Great, let’s finalize.', ts: '10:19' },
    ],
  },
  {
    id: '2',
    name: 'Riya (Yamaha Guitar)',
    last: 'Ping me tomorrow.',
    messages: [
      { id: 'm1', mine: true, text: 'Can exchange next week?', ts: '09:01' },
      { id: 'm2', text: 'Ping me tomorrow.', ts: '09:05' },
    ],
  },
];

const Messages: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>(seed);
  const [activeId, setActiveId] = useState<string>(seed[0]?.id || '');
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState('');

  const filtered = useMemo(
    () => threads.filter((t) => t.name.toLowerCase().includes(q.toLowerCase())),
    [threads, q]
  );

  const active = filtered.find((t) => t.id === activeId) || filtered[0];

  const send = () => {
    if (!draft.trim() || !active) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? {
              ...t,
              last: draft.trim(),
              messages: [
                ...t.messages,
                { id: Math.random().toString(36).slice(2), mine: true, text: draft.trim(), ts: 'now' },
              ],
            }
          : t
      )
    );
    setDraft('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: thread list */}
      <div className="lg:col-span-4 rounded-xl border bg-white/90 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search messages…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 text-sm"
            />
          </div>
        </div>

        <ul className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
          {filtered.map((t) => (
            <li
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                active?.id === t.id ? 'bg-gray-50 dark:bg-gray-700/60' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-900 dark:text-gray-100">{t.name}</div>
                {t.unread ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600 text-white">{t.unread}</span>
                ) : (
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{t.last}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: chat window */}
      <div className="lg:col-span-8 rounded-xl border bg-white/90 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-gray-100">
          {active?.name || 'Select a conversation'}
        </div>

        <div className="flex-1 p-5 space-y-3 overflow-y-auto">
          {active?.messages.map((m) => (
            <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                  m.mine
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                {m.text}
                <div className="text-[10px] opacity-70 mt-0.5 text-right">{m.ts}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button
              onClick={send}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
