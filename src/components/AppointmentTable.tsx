// src/components/AppointmentTable.tsx

import React from 'react';

const appointments = [
  {
    name: 'John Doe',
    date: 'Aug 4, 2025',
    time: '10:00 AM',
    doctor: 'Dr. Smith',
    status: 'Confirmed',
  },
  {
    name: 'Sarah Lee',
    date: 'Aug 5, 2025',
    time: '2:30 PM',
    doctor: 'Dr. Patel',
    status: 'Pending',
  },
  {
    name: 'Michael Brown',
    date: 'Aug 5, 2025',
    time: '11:15 AM',
    doctor: 'Dr. Khan',
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
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Upcoming Appointments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">Patient</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Time</th>
              <th scope="col" className="px-6 py-3">Doctor</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr
                key={index}
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{appt.name}</td>
                <td className="px-6 py-4">{appt.date}</td>
                <td className="px-6 py-4">{appt.time}</td>
                <td className="px-6 py-4">{appt.doctor}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[appt.status as keyof typeof statusColor]}`}
                  >
                    {appt.status}
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
