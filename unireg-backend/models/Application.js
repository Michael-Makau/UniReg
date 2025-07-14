const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    program: {
        type: String,
        required: true
    },
    kcseIndex: {
        type: String,
        required: true
    },
    kcseYear: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'review', 'interview', 'approved', 'rejected'],
        default: 'pending'
    },
    documents: [{
        type: String,
        required: true
    }],
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);
