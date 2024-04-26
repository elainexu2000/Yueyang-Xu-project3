const model = require('mongoose').model;
const passwordUserSchema = require('./password.user.schema.cjs');

const passwordUserModel = model('PasswordUser', passwordUserSchema);

function insertUser(user) {
    return passwordUserModel.create(user);
}

function getUserByUsername(username) {
    return passwordUserModel.findOne({username: username}).exec();
}

// function checkUserExistence(username) {
//     const user = getUserByUsername(username);
//     return user ? true : false;
// }

// function checkUserExistence(username) {
//     const count = passwordUserModel.countDocuments({ username });
//     console.log("Username " + username + " occured " + count + "instances");
//     return count > 0;
// }
async function checkUserExistence(username) {
    try {
        const count = await passwordUserModel.countDocuments({ username });
        console.log("Username " + username + " occurred " + count + " instances");
        return count > 0;
    } catch (error) {
        console.error("Error checking user existence:", error);
        return false; // Return false if an error occurs
    }
}

module.exports = {
    insertUser,
    getUserByUsername,
    checkUserExistence
}