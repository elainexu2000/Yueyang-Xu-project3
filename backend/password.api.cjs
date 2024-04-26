const express = require('express');
const passwordRouter = express.Router();
const PasswordModel = require('./db/password.model.cjs');
//const ShareModel = require('./db/password.share.model.cjs');
const cookieHelper = require('./cookie.helper.cjs');

passwordRouter.post('/', async function(req, res){
    const requestBody = req.body;
    const username = cookieHelper.cookieDecryptor(req);

    if(!username) {
        res.status(401);
        return res.send("You need to be logged in to create a password entry.")
    }
    if(!requestBody.domain || !requestBody.password){
        res.status(401);
        return res.send("API error: Please enter a non-empty domain. ")
    }
    const newPasswordEntry = {
        domain : requestBody.domain,
        password: requestBody.password,
        user: username
    }
    try{
        const insertPasswordResponse = await PasswordModel.insertPassword(newPasswordEntry);
        return res.send(insertPasswordResponse);
    } catch(error){
        res.status(400);
        return res.send(error);
    }
})

// get all password entries belonging to the same user
passwordRouter.get('/', async function(req, res){
    const username = cookieHelper.cookieDecryptor(req);
    if(!username) {
        res.status(401);
        return res.send("You need to be logged in to retrieve a password entry.")
    }
    try{
        const allPasswordResponse = await PasswordModel.getPasswordByUser(username);
        return res.send(allPasswordResponse);
    }
    catch(error){
        res.status(400);
        return res.send("Error retrieving password entry from database. ");
    }
})

// get password by ID
passwordRouter.get('/:pwId', async function(req, res){
    const username = cookieHelper.cookieDecryptor(req);
    if(!username) {
        res.status(401);
        return res.send("You need to be logged in to retrieve a password entry.")
    }
    const passwordId = req.params.pwId;
    try{
        const getPasswordResponse = await PasswordModel.getPasswordById(passwordId);
        return res.send(getPasswordResponse);
    }catch(error){
        res.send(400);
        return res.send(error);
    }
})

passwordRouter.put('/:pwId', async function(req, res){
    const passwordId = req.params.pwId;
    const passwordData = req.body;
    const username = cookieHelper.cookieDecryptor(req);

    if(!username) {
        res.status(401);
        return res.send("You need to be logged in to modify a password entry.")
    }
    if(!passwordData.domain || !passwordData.password){
        res.status(400);
        return res.send("Invalid input: please include domain name and password. ")
    }
    try{
        const getPasswordResponse = await PasswordModel.getPasswordById(passwordId);
        if(getPasswordResponse != null && getPasswordResponse.user !== username){
            res.status(400);
            return res.send("You do not own this password entry.");
        }
        const passwordUpdateResponse = await PasswordModel.updatePassword(passwordId, passwordData);
        //const shareRequestUpdateResponse = await ShareModel.updateShareRequest(requestId, requestBody.status);

        return res.send(passwordUpdateResponse);
    }
    catch(error){
        res.status(400);
        return res.send(error);
    }
})

passwordRouter.delete('/:pwId', async function(req, res){
    const passwordId = req.params.pwId;
    const username = cookieHelper.cookieDecryptor(req);
    if(!username) {
        res.status(401);
        return res.send("You need to be logged in to delete a password entry. ")
    }
    try{
        const getPasswordResponse = await PasswordModel.getPasswordById(passwordId);
        if(getPasswordResponse != null && getPasswordResponse.user !== username){
            res.status(400);
            return res.send("You do not own this password entry.");
        }
        const deletePasswordResponse = await PasswordModel.deletePassword(passwordId);
        return res.send("Password entry deleted successfully.");
    }
    catch(error){
        res.status(400);
    return res.send("Failed to delete password entry: " + error.message);
    }
})

// POST route to create a new sharing request
// passwordRouter.post('/share', async function(req, res) {
//     const requestBody = req.body;
//     const username = cookieHelper.cookieDecryptor(req);

//     if (!username) {
//         res.status(401);
//         return res.send("You need to be logged in to share a password entry.");
//     }
//     if (!requestBody.recipientUsername || !requestBody.passwordId) {
//         res.status(400);
//         return res.send("Invalid input: please include recipient username and password ID.");
//     }

//     try {
//         const shareRequest = await ShareModel.addShareRequest(username, requestBody.recipientUsername, requestBody.passwordId);
//         return res.send(shareRequest);
//     } catch (error) {
//         res.status(400);
//         return res.send(error);
//     }
// });

// // GET route to retrieve all sharing requests for the user
// passwordRouter.get('/share', async function(req, res) {
//     const username = cookieHelper.cookieDecryptor(req);

//     if (!username) {
//         res.status(401);
//         return res.send("You need to be logged in to view sharing requests.");
//     }

//     try {
//         const sharingRequests = await ShareModel.getSharingRequestsForUser(username);
//         return res.send(sharingRequests);
//     } catch (error) {
//         res.status(400);
//         return res.send(error);
//     }
// });

// // PUT route to accept or reject a sharing request
// passwordRouter.put('/share/:requestId', async function(req, res) {
//     const username = cookieHelper.cookieDecryptor(req);
//     const requestId = req.params.requestId;
//     const action = req.body.action; // 'accept' or 'reject'

//     if (!username) {
//         res.status(401);
//         return res.send("You need to be logged in to respond to sharing requests.");
//     }
//     if (!action || (action !== 'accept' && action !== 'reject')) {
//         res.status(400);
//         return res.send("Invalid input: please specify 'accept' or 'reject' as the action.");
//     }

//     try {
//         if (action === 'accept') {
//             const acceptRequest = await ShareModel.acceptShareRequest(requestId, username);
//             return res.send(acceptRequest);
//         } else {
//             const rejectRequest = await ShareModel.rejectShareRequest(requestId, username);
//             return res.send(rejectRequest);
//         }
//     } catch (error) {
//         res.status(400);
//         return res.send(error);
//     }
// });

module.exports = passwordRouter;