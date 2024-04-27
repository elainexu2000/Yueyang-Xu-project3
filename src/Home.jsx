import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import './index.css';

function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

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
            <ul>
                The goal of this project is to create a website that allows users to store, manage, and              
                share passwords for a variety of domains. It also serves as an introduction to components of
                a full stack project. 
            </ul>
            <h2>Creator</h2>
            <ul>Yueyang Xu</ul>
            <h2>Github Repository</h2>
            <ul>https://github.com/elainexu2000/Yueyang-Xu-project3</ul>
            <h2>Render Deployment</h2>
            <ul>https://yueyang-xu-project3.onrender.com/</ul>
        </>
    );
}

export default Home;
