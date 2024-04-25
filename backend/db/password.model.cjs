const model = require('mongoose').model;
const PasswordSchema = require('./password.schema.cjs');
const PasswordModel = model('Password', PasswordSchema);

function insertPassword(password){
    return PasswordModel.create(password);
}

function deletePassword(id){
    return PasswordModel.deleteOne({_id: id});
}

function updatePassword(id, newPassword){
    return PasswordModel.findOneAndUpdate({_id: id}, newPassword);
}

function getAllPassword(){
    return PasswordModel.find().exec();
}

function getPasswordByUser(user){
    return PasswordModel.find({
        user: user,
    }).exec();
}

function getPasswordById(id){
    return PasswordModel.findById(id).exec();
}


module.exports = {
    insertPassword,
    deletePassword,
    updatePassword,
    getAllPassword,
    getPasswordByUser,
    getPasswordById
}