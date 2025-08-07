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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 w-full transition-colors duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</div>
        <div className={`text-2xl ${color || 'text-blue-500'}`}>{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
        {growth && (
          <span className="text-sm text-green-500 dark:text-green-400 font-medium">{growth}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
