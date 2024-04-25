const express = require('express');
const passwordRouter = express.Router();
const PasswordModel = require('./db/password.model.cjs');

passwordRouter.get('/', async function(req, res){
    const user = req.cookies.passwordUser;
    try{
        //const allPasswordResponse = await PasswordModel.getAllPassword();
        const allPasswordResponse = await PasswordModel.getPasswordByUser(user);
        return res.send(allPasswordResponse);
    }
    catch(error){
        res.status(400);
        return res.send("Error retrieving password from database. ");
    }
})

// passwordRouter.get('/:pwId', async function(req, res){
//     const passwordId = req.params.pwId;
//     try{
//         const getPasswordResponse = await PasswordModel.getPasswordById(passwordId);
//         return res.send(getPasswordResponse);
//     }catch(error){
//         res.send(400);
//         return res.send(error);
//     }
// })

passwordRouter.post('/', async function(req, res){
    const requestBody = req.body;
    if(!requestBody.domain || !requestBody.password){
        res.status(401);
        return res.send("Empty domain or password!")
    }
    const newPassword = {
        domain: requestBody.domain,
        password: requestBody.password,
        user: "v"
    }
    //console.log(newPassword);
    try{
        const insertPasswordResponse = await PasswordModel.insertPassword(newPassword);
        res.cookie('passwordUser', "v");
        return res.send(insertPasswordResponse);
    } catch(error){
        res.status(400);
        return res.send(error);
    }
})


passwordRouter.put('/:pwId', async function(req, res){
    const passwordId = req.params.pwId;
    const passwordData = req.body;
    if(!passwordData.domain || !passwordData.password){
        res.status(401);
        return res.send("Empty domain or password!")
    }
    try{
        const passwordUpdateResponse = await PasswordModel.updatePassword(passwordId, passwordData);
        return res.send(passwordUpdateResponse);
    }catch(error){
        res.send(400);
        return res.send(error);
    }
})

passwordRouter.delete('/:pwId', async function(req, res){
    const passwordId = req.params.pwId;
    try{
        const deletePasswordResponse = await PasswordModel.deletePassword(passwordId);
        return res.send(deletePasswordResponse);
    }catch(error){
        res.status(400);
        return res.send(error);
    }
})

module.exports = passwordRouter;