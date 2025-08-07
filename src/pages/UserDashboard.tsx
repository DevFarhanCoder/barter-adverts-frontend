// src/pages/UserDashboard.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../Layout/DashboardLayout';

const UserDashboard = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default UserDashboard;
