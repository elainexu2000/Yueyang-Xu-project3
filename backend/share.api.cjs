const express = require('express');
const shareRouter = express.Router();
const ShareModel = require('./db/password.share.model.cjs');
const PasswordUserModel = require('./db/password.user.model.cjs');
const cookieHelper = require('./cookie.helper.cjs');

// /share/requests
// GET pending requests to logged in user
shareRouter.get('/requests', async (req, res) => {
    const username = cookieHelper.cookieDecryptor(req);
    if(!username) {
        res.status(401);
        return res.send("You need to be logged in to retrieve a share request.")
    }
    try {
        const pendingRequests = await ShareModel.getPendingRequestsToUser(username);
        return res.send(pendingRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching share requests.' });
    }
});

// /share/passwords
//GET passwords shared with the logged in user
shareRouter.get('/passwords', async (req, res) => {
    const username = cookieHelper.cookieDecryptor(req);
    if(!username) {
        res.status(401);
        return res.send("You need to be logged in to retrieve shared passwords.")
    }
    try {
        const sharedPasswordResponse = await ShareModel.getAllSharedPasswordsByUsername(username);
        console.log(sharedPasswordResponse);
        return res.send(sharedPasswordResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching share requests.' });
    }
});

shareRouter.post('/', async function(req, res){
    const requestBody = req.body;
    const username = cookieHelper.cookieDecryptor(req);

    if (!username) {
        res.status(401);
        return res.send("You need to be logged in to share a password entry.");
    }
    if (!requestBody.requesterUsername || !requestBody.recipientUsername){
        res.status(401);
        return res.send("Please enter a username.");
    }
    if (requestBody.requesterUsername === requestBody.recipientUsername){
        res.status(401);
        return res.send('Cannot share password with yourself.');
    }
    try {
        const recipientExists = await PasswordUserModel.checkUserExistence(requestBody.recipientUsername);
        if (!recipientExists) {
            res.status(400);
            return res.send("User " + requestBody.recipientUsername + " does not exist.");
        }
        try {
            const addShareRequestResponse1 = await ShareModel.addShareRequest(username, requestBody.recipientUsername);
            try {
                const addShareRequestResponse2 = await ShareModel.addShareRequest(requestBody.recipientUsername, username);
                return res.send({
                    requesterToRecipient: addShareRequestResponse1,
                    recipientToRequester: addShareRequestResponse2
                });
            } catch (error) {
                res.status(400);
                return res.send(error.message); 
            }
        } catch (error) {
            res.status(400);
            return res.send(error.message); 
        }
    } catch(error) {
        res.status(400);
        return res.send(error.message);
    }
});

shareRouter.put('/:reqId', async function(req, res){
    const requestId = req.params.reqId;
    const newStatus = req.body.status;
    const username = cookieHelper.cookieDecryptor(req);
    if(!username) {
        res.status(401);
        return res.send("You need to be logged in to modify a share request.")
    }
    try{
        const getShareRequestResponse = await ShareModel.getSharedRequestById(requestId);
        console.log(getShareRequestResponse);
        const newRequest = {
            requesterUsername: getShareRequestResponse.requesterUsername,
            recipientUsername: getShareRequestResponse.recipientUsername,
            status: newStatus
        }
        if(getShareRequestResponse != null && getShareRequestResponse.recipientUsername !== username){
            res.status(400);
            return res.send("You do not own this share request.");
        }
        const shareRequestUpdateResponse = await ShareModel.updateShareRequest(requestId, newStatus);
        return res.send(shareRequestUpdateResponse);
    }
    catch(error){
        res.status(400);
        return res.send(error.message);
    }
})

module.exports = shareRouter;
