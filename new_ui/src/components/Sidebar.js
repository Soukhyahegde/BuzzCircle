import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/login');
  };
  const navItems = [
    { icon: '👤', label: 'Profile', active: false },
    { icon: '🔍', label: 'Explore', active: false },
    { icon: '💬', label: 'Messages', active: false },
    { icon: '🔔', label: 'Notifications', active: false },
    { icon: '📚', label: 'Bookmarks', active: false },
    { icon: '⚙️', label: 'Settings', active: false },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">B</div>
        <span>BUZZCIRCLE.</span>
      </div>
      <ul className="sidebar-nav">
        {navItems.map((item, index) => (
          <li key={index} className={item.active ? 'active' : ''}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '10px',
            background: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
