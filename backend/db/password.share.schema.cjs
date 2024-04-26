const Schema = require('mongoose').Schema;

module.exports = new Schema({
    requesterUsername: {
        type: String,
        required: true
    },
    recipientUsername: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['accepted', 'pending', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'PasswordShareRequests' });
