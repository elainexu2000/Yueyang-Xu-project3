import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import './NavBar.css'

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    isLoggedIn();
  }, []);

  const isLoggedIn = async () => {
    try {
      const response = await axios.get('/api/passwordUser/loggedIn');
      const username = response.data.username;
      setUsername(username);
      setIsAuthenticated(true);
    } catch (error) {
      //navigate('/');
      setIsAuthenticated(false);
      setUsername('');
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post('/api/passwordUser/logout');
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const renderNavItems = () => {
    if (location.pathname === '/login') {
      return (
        <div className='navbar'>
          <div className='navbar-element'><Link to="/">Home</Link></div>
          <div className='navbar-element'><Link to="/register">Register</Link></div>
        </div>
      );
    } 
    else if (location.pathname === '/register') {
      return (
        <div className='navbar'>
          <div className='navbar-element'><Link to="/">Home</Link></div>
          <div className='navbar-element'><Link to="/login">Log In</Link></div>
        </div>
      );
    } 
    else 
    if (location.pathname === '/password') {
      return (
        <div className='navbar'>
          <div className='navbar-element'><Link to="/">Home</Link></div>
          <div className='navbar-element'><Link to="/password">Password Manager</Link></div>
          <div className='navbar-element'><button onClick={logout}>Log Out</button></div>
          <div className='navbar-element'>Hello, {username}</div>
        </div>
      );
    } 
    else {
      return (
        <>
        {isAuthenticated? 
          (<div className='navbar'>
            <div className='navbar-element'><Link to="/">Home</Link></div>
            <div className='navbar-element'><Link to="/password">Password Manager</Link></div>
            <div className='navbar-element'><button onClick={logout}>Log Out</button></div>
            <div className='navbar-element'>Hello, {username}</div>
          </div>):
          (<div className='navbar'>
            <div className='navbar-element'><Link to="/">Home</Link></div>
            <div className='navbar-element'><Link to="/login">Log In</Link></div>
            <div className='navbar-element'><Link to="/register">Register</Link></div>
          </div>)}
        </>
      );
    }
  };

  return (
    <nav>
      {renderNavItems()}
    </nav>
  );
};

export default NavBar;
