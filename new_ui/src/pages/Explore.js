import React from 'react';
import Sidebar from '../components/Sidebar';
import MainFeed from '../components/MainFeed';
import RightSidebar from '../components/RightSidebar';

function Explore() {
  return (
    <div className="app-container">
      <Sidebar />
      <MainFeed maxCircles={null} />
      <RightSidebar />
    </div>
  );
}

export default Explore;
