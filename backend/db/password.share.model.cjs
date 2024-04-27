const model = require('mongoose').model;
const PasswordShareSchema = require('./password.share.schema.cjs');
const PasswordShareModel = model('PasswordShareModel', PasswordShareSchema);

const {getPasswordByUser} = require('./password.model.cjs');
async function addShareRequest(requesterUsername, recipientUsername) {
    const existingRequest = await PasswordShareModel.findOne({
        requesterUsername,
        recipientUsername
    });
    if (existingRequest) {
        throw new Error('Share request already exists for this requester and recipient.');
    }
    const shareRequest = new PasswordShareModel({
        requesterUsername,
        recipientUsername,
        status: 'pending'
    });
    return await shareRequest.save();
}

async function deleteShareRequest(requesterUsername, recipientUsername) {
    return await PasswordShareModel.deleteOne({
        requesterUsername,
        recipientUsername
    });
}

function getSharedRequestById(id){
    return PasswordShareModel.findById(id).exec();
}

async function updateShareRequest(id, newStatus) {
    try {
        const updatedRequest = await PasswordShareModel.findByIdAndUpdate(
            id,
            { status: newStatus },
            { new: true }
        );
        return updatedRequest;
    } catch (error) {
        console.error('Error updating share request:', error);
        throw error;
    }
}

async function getPendingRequestsToUser(username){
    return await PasswordShareModel.find({
        recipientUsername: username,
        status: 'pending'
    });
}
async function getAcceptedRequestsToUser(username){
    return await PasswordShareModel.find({
        recipientUsername: username,
        status: 'accepted'
    });
}

async function getAllSharedPasswordsByUsername(username) {
    try {
        const acceptedRequests = await PasswordShareModel.find({
            recipientUsername: username,
            status: 'accepted'
        });

        const requesterUsernamesSet = new Set(acceptedRequests.map(request => request.requesterUsername));
        const requesterUsernames = Array.from(requesterUsernamesSet);
        const sharedPasswords = await Promise.all(
            requesterUsernames.map(user => getPasswordByUser(user))
        );
        const allSharedPasswords = sharedPasswords.flat();
        return allSharedPasswords;
    } 
    catch (error) {
        console.error('Error fetching shared passwords:', error);
        return []; 
    }
}

module.exports = {
    addShareRequest,
    deleteShareRequest,
    updateShareRequest,
    getAllSharedPasswordsByUsername,
    getSharedRequestById,
    getPendingRequestsToUser,
    getAcceptedRequestsToUser,
    getAllSharedPasswordsByUsername
};
