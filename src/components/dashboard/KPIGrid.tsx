// src/components/dashboard/KPIGrid.tsx
import { Layers, Archive, Activity, MousePointerClick } from 'lucide-react';
import StatCard from './StatCard';
import { useBarters } from '../../hooks/useBarters';

export default function KPIGrid() {
  const { bartersQ, metrics } = useBarters();
  const loading = bartersQ?.isLoading;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Listings" value={loading ? '—' : metrics.totalListings} icon={<Layers className="w-5 h-5" />} growth="+8%" color="text-blue-500" />
      <StatCard title="Active Listings" value={loading ? '—' : metrics.activeListings} icon={<Activity className="w-5 h-5" />} growth="+5%" color="text-emerald-600" />
      <StatCard title="Archived" value={loading ? '—' : metrics.archivedListings} icon={<Archive className="w-5 h-5" />} growth="-2%" color="text-gray-500" />
      <StatCard title="Total Clicks" value={loading ? '—' : metrics.totalClicks} icon={<MousePointerClick className="w-5 h-5" />} growth="+3%" color="text-violet-600" />
    </div>
  );
}
