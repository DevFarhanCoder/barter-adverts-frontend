// src/components/dashboard/EngagementRow.tsx
import { MousePointerClick, Mail } from 'lucide-react';
import { useBarters } from '../../hooks/useBarters';

export default function EngagementRow() {
  const { bartersQ, metrics } = useBarters();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-white/90 px-6 py-5 dark:border-gray-700 dark:bg-gray-800/70">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-violet-600 text-white">
            <MousePointerClick className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Clicks (last 7 days)</div>
            <div className="text-xl font-semibold">{bartersQ?.isLoading ? '—' : metrics.clicks7d}</div>
            <div className="text-xs text-gray-400">from website & marketplace</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white/90 px-6 py-5 dark:border-gray-700 dark:bg-gray-800/70">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-600 text-white">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Unread messages</div>
            <div className="text-xl font-semibold">{metrics.unreadMessages}</div>
            <div className="text-xs text-gray-400">across active threads</div>
          </div>
        </div>
      </div>
    </div>
  );
}
