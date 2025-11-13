import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard',  label: 'Dashboard' },
    { path: '/purchases',  label: 'Purchases' },
    { path: '/transfers',  label: 'Transfers' },
    { path: '/assignments',  label: 'Assignments' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;