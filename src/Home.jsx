import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import './index.css';

function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
      }, []);

    useEffect(() => {
        isLoggedIn();
    }, [isAuthenticated]);

    async function isLoggedIn() {
        try {
            const response = await axios.get('/api/passwordUser/loggedIn');
            const username = response.data.username;
            setUsername(username);
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
            setUsername('');
        }
    }

    return (
        <>
            <h1>Home Page</h1>
            <NavBar isAuthenticated={isAuthenticated} username={username} />
            <h2>Product Description</h2>
            <p>The goal of this project is to create a website that allows users to store, manage, and              share passwords for a variety of domains. 
            </p>
            <h2>Creators</h2>
            <p>Yueyang Xu</p>
            <h2>Github Repository</h2>
            <p>https://github.com/elainexu2000/Yueyang-Xu-project3</p>
            <h2>Render Deployment</h2>
            <p>https://yueyang-xu-project3.onrender.com/</p>
        </>
    );
}

export default Home;
