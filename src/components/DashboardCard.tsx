import React from 'react';
import { FaBullhorn, FaEye, FaEnvelope } from 'react-icons/fa';

interface Props {
  title: string;
  value: string | number;
  description?: string;
  type: 'listings' | 'views' | 'messages';
}

const iconMap = {
  listings: <FaBullhorn size={24} className="text-blue-500" />,
  views: <FaEye size={24} className="text-green-500" />,
  messages: <FaEnvelope size={24} className="text-purple-500" />,
};

const DashboardCard: React.FC<Props> = ({ title, value, description, type }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl p-4 border shadow-sm
      bg-white/90 border-gray-200
      dark:bg-gray-800/70 dark:border-gray-700 backdrop-blur">
      <div className="mr-2">{iconMap[type]}</div>
      <div>
        <h4 className="text-sm text-gray-600 dark:text-gray-300">{title}</h4>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
    </div>
  );
};

export default DashboardCard;
