const model = require('mongoose').model;
const passwordUserSchema = require('./password.user.schema.cjs');

const passwordUserModel = model('PasswordUser', passwordUserSchema);

function insertUser(user) {
    return passwordUserModel.create(user);
}

function getUserByUsername(username) {
    return passwordUserModel.findOne({username: username}).exec();
}

module.exports = {
    insertUser,
    getUserByUsername,
}