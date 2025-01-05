const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500,
    },
    dueDate: {
        type: Date,
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
    }],
    submmitedUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',  
    }
}, {
    timestamps: true  
});

const Task = mongoose.model('Task', taskSchema);

module.exports = { Task };
