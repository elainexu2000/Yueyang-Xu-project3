import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

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
      navigate('/');
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
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      );
    } 
    else if (location.pathname === '/register') {
      return (
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Log In</Link></li>
        </ul>
      );
    } 
    else 
    if (location.pathname === '/password') {
      return (
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/password">Password Manager</Link></li>
          <li><button onClick={logout}>Log Out</button></li>
          <li>{username}</li>
        </ul>
      );
    } 
    else {
      return (
        <ul>
          <li><Link to="/">Home</Link></li>
          {isAuthenticated ? 
          (
            <>
              <li><Link to="/password">Password Manager</Link></li>
              <li><button onClick={logout}>Log Out</button></li>
              <li>{username}</li>
            </>
          ) : 
          (
            <>
              <li><Link to="/login">Log In</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
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
