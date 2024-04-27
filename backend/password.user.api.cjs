const cookieHelper = require('./cookie.helper.cjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const passwordUserModel = require('./db/password.user.model.cjs');

router.post('/register', async function(request, response) {
    const requestBody = request.body;

    const username = requestBody.username;
    const password = requestBody.password;

    const newUser = {
        username: username,
        password: password
    };

    try {
        const createUserResponse = await passwordUserModel.insertUser(newUser);
        const cookieData = {username: username};
        const token = jwt.sign(cookieData, 'PASSWORD_SECRET', {
            expiresIn: '14d'
        });
        response.cookie('token', token, {httpOnly: true});
        return response.send('User with username ' + username + ' successfully created.' )
    } 
    catch (error) {
        response.status(400);
        return response.send('Failed to create user: ' + error)
    }
});

router.get(':/userId', async function(request, response){
    const username = request.params.username;
    try {
        const getUserResponse = await passwordUserModel.getUserByUsername(username);
        return response.send('User with username ' + username + ' found.' )
    } 
    catch (error) {
        response.status(400);
        return response.send('Failed to get user: ' + error)
    }
})

router.post('/login', async function(request, response) {
    const username = request.body.username;
    const password = request.body.password

    try {
        const getUserResponse = await passwordUserModel.getUserByUsername(username);
        if(!getUserResponse) {
            response.status(400);
            return response.send('User with username ' + username + ' not found.' )
        }
        if (password !== getUserResponse.password) {
            response.status(400)
            return response.send('Incorrect password.' )
        }
        const cookieData = {username: username};
        const token = jwt.sign(cookieData, 'PASSWORD_SECRET', {
            expiresIn: '14d'
        });
        response.cookie('token', token, {httpOnly: true});
        return response.send('Logged in!' )
    } catch (error) {
        response.status(400);
        return response.send('Failed to login: ' + error)
    }
});

router.get('/loggedIn', function(request, response) {
    const username = cookieHelper.cookieDecryptor(request);
    if(username) {
        return response.send({
            username: username,
        });
    } else {
        response.status(400);
        return response.send('Not logged in');
    }
})

router.post('/logout', function(request, response) {
    response.clearCookie('username');
    return response.send('Logged out');
});

module.exports = router;