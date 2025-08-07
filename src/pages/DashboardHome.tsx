// src/pages/DashboardHome.tsx
import React from 'react';
import StatCard from '../components/StatCard';
import AppointmentTable from '../components/AppointmentTable';
import { FaUserMd, FaUsers, FaCalendarAlt, FaBriefcaseMedical } from 'react-icons/fa';

const DashboardHome = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="px-4 md:px-6 py-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-6">
        Hello, <span className="text-blue-600 dark:text-blue-400">{user.firstName || "User"}</span> 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Appointment" value="7,365" icon={<FaCalendarAlt />} growth="+25% 25 days" color="text-blue-500" />
        <StatCard title="Total Patients" value="5,656" icon={<FaUsers />} growth="+15% 30 days" color="text-indigo-500" />
        <StatCard title="Total Vacancy" value="636" icon={<FaBriefcaseMedical />} growth="-5% 30 days" color="text-red-500" />
        <StatCard title="Total Doctors" value="575" icon={<FaUserMd />} growth="+3% 20 days" color="text-sky-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 min-h-[300px]">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Patient Visited</h2>
          <div className="text-gray-400 text-center">[Chart will go here]</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 min-h-[300px] lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Patient Visit</h2>
          <div className="text-gray-400 text-center">[Map/Chart will go here]</div>
        </div>
      </div>

      <AppointmentTable />
    </div>
  );
};

export default DashboardHome;
