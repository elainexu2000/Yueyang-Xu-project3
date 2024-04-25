const model = require('mongoose').model;
const UserSchema = require('./pokemon.user.schema.cjs');

const UserModel = model('User', UserSchema);

function insertUser(user) {
    return UserModel.create(user);
}

function getUserByUsername(username) {
    return UserModel.findOne({username: username}).exec();
}

module.exports = {
    insertUser,
    getUserByUsername,
}