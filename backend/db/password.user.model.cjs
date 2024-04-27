const model = require('mongoose').model;
const passwordUserSchema = require('./password.user.schema.cjs');

const passwordUserModel = model('PasswordUser', passwordUserSchema);

function insertUser(user) {
    return passwordUserModel.create(user);
}

function getUserByUsername(username) {
    return passwordUserModel.findOne({username: username}).exec();
}

async function checkUserExistence(username) {
    try {
        const count = await passwordUserModel.countDocuments({ username });
        return count > 0;
    } catch (error) {
        console.error("Error checking user existence:", error);
        return false; 
    }
}

module.exports = {
    insertUser,
    getUserByUsername,
    checkUserExistence
}