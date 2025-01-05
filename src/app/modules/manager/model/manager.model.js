const mongoose = require('mongoose');
const managerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/  
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    roles: {
        type: Number,
        default: 2,  
        enum: [2], // 1 - Admin, 2 - Manager, 5 - User
    },
    profilePicture: {
        type: String,  
        default: ''
    },
    bio: {
        type: String,
        maxlength: 500,
        default: ''
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
    }],
    tasksManaged: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    accessToken: {
        type: String,  
        default: ''
    }
}, {
    timestamps: true  
});

const Manager = mongoose.model('Manager', managerSchema);

module.exports = { Manager};