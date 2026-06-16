import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '15px', alignItems: 'center' }}>
      <Link to="/" style={{ fontWeight: 'bold' }}>UrbanFinder</Link>
      <Link to="/hotels">Hotels</Link>
      <Link to="/guides">Guides</Link>
      <Link to="/packages">Packages</Link>
      {user ? (
        <>
          <Link to="/conversations">Chat</Link>
          <Link to="/notifications">Notifications</Link>
          <Link to="/profile">Profile ({user.username})</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
