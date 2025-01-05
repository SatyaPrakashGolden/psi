const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
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
        default: 1,  
        enum: [1], // 1 - Admin, 2 - Manager, 5 - User
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
    accessToken: {
        type: String,  
        default: ''
    }
}, {
    timestamps: true  
});


const Admin = mongoose.model('Admin', adminSchema);
module.exports = { Admin };