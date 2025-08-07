import React from 'react';
import { FaBullhorn, FaEye, FaEnvelope } from 'react-icons/fa'; // FontAwesome Icons

interface Props {
  title: string;
  value: string | number;
  description?: string;
  type: 'listings' | 'views' | 'messages';
}

const iconMap = {
  listings: <FaBullhorn size={32} className="text-blue-500" />,
  views: <FaEye size={32} className="text-green-500" />,
  messages: <FaEnvelope size={32} className="text-purple-500" />,
};

const DashboardCard: React.FC<Props> = ({ title, value, description, type }) => {
  return (
    <div className="card bg-white dark:bg-gray-800 text-black dark:text-white shadow rounded p-4">
      <div className="mr-4">
        {iconMap[type]}
      </div>
      <div>
        <h4 className="text-sm text-gray-600">{title}</h4>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
    </div>
  );
};

export default DashboardCard;
