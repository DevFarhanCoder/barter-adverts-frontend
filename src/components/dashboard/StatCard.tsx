import React from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  growth?: string;
  color?: string;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, growth, color }) => {
  return (
    <div className="rounded-xl p-5 w-full border shadow-sm
      bg-white/90 border-gray-200
      dark:bg-gray-800/70 dark:border-gray-700 backdrop-blur">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</div>
        <div className={`text-2xl ${color || 'text-blue-500'}`}>{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
        {growth && <span className="text-sm text-green-500 dark:text-green-400 font-medium">{growth}</span>}
      </div>
    </div>
  );
};

export default StatCard;
