import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Military Asset Management</h2>
      </div>
      
      <div className="navbar-user">
        <span className="user-info">
          Welcome, <strong>{user?.username}</strong> ({user?.role})
        </span>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;