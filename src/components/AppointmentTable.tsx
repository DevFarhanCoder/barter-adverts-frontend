import React from 'react';

const trades = [
  {
    name: 'iPhone 13 ↔ Yamaha Guitar',
    date: 'Aug 4, 2025',
    time: 'Trade Proposed',
    with: 'Riya',
    status: 'Pending',
  },
  {
    name: 'Office Chair ↔ DSLR Camera',
    date: 'Aug 5, 2025',
    time: 'Trade Accepted',
    with: 'Aman',
    status: 'Confirmed',
  },
  {
    name: 'MacBook Air ↔ Gaming PC',
    date: 'Aug 5, 2025',
    time: 'Trade Cancelled',
    with: 'Sanjay',
    status: 'Cancelled',
  },
];

const statusColor = {
  Confirmed: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
  Pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
  Cancelled: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300',
};

const AppointmentTable: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-8">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Recent Trades
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3">Trade</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Stage</th>
              <th className="px-6 py-3">With</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr
                key={index}
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{trade.name}</td>
                <td className="px-6 py-4">{trade.date}</td>
                <td className="px-6 py-4">{trade.time}</td>
                <td className="px-6 py-4">{trade.with}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[trade.status as keyof typeof statusColor]}`}
                  >
                    {trade.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
