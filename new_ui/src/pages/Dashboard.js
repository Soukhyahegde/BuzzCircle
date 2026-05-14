import React from 'react';
import Sidebar from '../components/Sidebar';
import MainFeed from '../components/MainFeed';
import RightSidebar from '../components/RightSidebar';

function Dashboard() {
  return (
    <div className="app-container">
      <Sidebar />
      <MainFeed />
      <RightSidebar />
    </div>
  );
}

export default Dashboard;
