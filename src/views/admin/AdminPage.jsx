import './adminPage.css';

import React from 'react';

import AdminHeader from './AdminHeader';
import AdminDashboard from './Dashboard';

export default function AdminPage({

}) {
  return (
    <div className="adminPage">
      <AdminHeader />
      <AdminDashboard />
    </div>
  );
}