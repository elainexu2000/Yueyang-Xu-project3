const model = require('mongoose').model;
const PasswordShareSchema = require('./password.share.schema.cjs');
const PasswordShareModel = model('PasswordShareModel', PasswordShareSchema);

async function addShareRequest(requesterUsername, recipientUsername) {
    const shareRequest = new PasswordShareModel({
        requesterUsername,
        recipientUsername,
        status: 'rejected' // New requests start as rejected
    });
    return await shareRequest.save();
}

async function deleteShareRequest(requesterUsername, recipientUsername) {
    return await PasswordShareModel.deleteOne({
        requesterUsername,
        recipientUsername
    });
}

async function acceptShareRequest(id) {
    return await PasswordShareModel.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
}

async function rejectShareRequest(id) {
    return await PasswordShareModel.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
}

async function getAllSharedPasswords(username) {
    return await PasswordShareModel.find({
        recipientUsername: username,
        status: 'accepted' 
    });
}

module.exports = {
    addShareRequest,
    deleteShareRequest,
    acceptShareRequest,
    rejectShareRequest,
    getAllSharedPasswords
};
