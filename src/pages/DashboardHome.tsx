import React from 'react';
import DashboardCard from '../components/DashboardCard';
import StatCard from '../components/dashboard/StatCard';
import MyBartersTable from '../components/MyBartersTable';
import { useBarters } from '../hooks/useBarters';
import { FaBullhorn, FaUsers, FaHandshake, FaUserCheck } from 'react-icons/fa';

const DashboardHome: React.FC = () => {
  const token = localStorage.getItem('token') || null;
  const { bartersQ } = useBarters(undefined, token);
  const items = bartersQ.data ?? [];

  const totalListings = items.length;
  const activeOffers = items.filter((x) => String(x.status).toLowerCase() === 'active').length;
  const openRequests = items.filter((x) =>
    ['pending', 'proposed', 'countered'].includes(String(x.status || '').toLowerCase())
  ).length;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Listings" value={totalListings} icon={<FaBullhorn />} growth="+8%" color="text-blue-500" />
        <StatCard title="Active Offers" value={activeOffers} icon={<FaHandshake />} growth="+5%" color="text-green-500" />
        <StatCard title="Open Requests" value={openRequests} icon={<FaUsers />} growth="-2%" color="text-red-500" />
        <StatCard title="Verified Users" value={575} icon={<FaUserCheck />} growth="+3%" color="text-purple-500" />
      </div>

      {/* Secondary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="My Listings" value={totalListings} description="Active + Archived" type="listings" />
        <DashboardCard title="Total Views" value={2345} description="All time" type="views" />
        <DashboardCard title="Messages" value={54} description="Unread & Read" type="messages" />
      </div>

      {/* My Barters (edit/delete with auto-refresh) */}
      <MyBartersTable authToken={token} />
    </div>
  );
};

export default DashboardHome;
