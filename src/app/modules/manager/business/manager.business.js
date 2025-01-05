
const {Task}=require('../../task/model/task.model')
const {Manager }=require('../model/manager.model')
const {User}=require('../../user/model/user.model')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { isValidEmail, isValidPassword } = require('../../../middlewares/validator.middleware');
require('dotenv').config();

const login = async (data) => {
    const { usernameOrEmail, password } = data;  
    if (!usernameOrEmail || !password)  throw ('Username/email and password are required.');
    const user = await Manager.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });
    if (!user) throw ('User not found.');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw ('Invalid password.');
    const token = jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        'satyaSingh',  
        { expiresIn: '100h' }  
    );
    user.accessToken = token;
    await user.save();
    return { 
        message: 'Login successful!', 
        token:token 
    };
}

const logOut = async (user) => {
    const { _id:ManagerId } = user;
    await Manager.findByIdAndUpdate(ManagerId, { $set: { accessToken: null } });
    return { 
        msg: "Logout successful. Access token removed." 
    };
};

const ManagerAllUsers = async (user, body, query) => {
 
    const { _id } = user;
        const manager = await Manager.findById(_id).populate('team', 'username email profilePicture bio'); 
        if (!manager) throw ("Manager not found.");
        return {
            message: "Manager's team members fetched successfully.",
            teamMembers: manager.team
        };
};



const TotalTaskAccessManager = async (user, body, query) => {
    const {_id:ManagerId}=user;
    if (!ManagerId)    throw ('Manager ID is required.');
    if (!mongoose.Types.ObjectId.isValid(ManagerId)) throw ('Invalid Manager ID.');
    const manager = await Manager.findById(ManagerId).populate('tasksManaged', 'title description dueDate');
    if (!manager) throw ('Manager not found.');
    if (!manager.tasksManaged || manager.tasksManaged.length === 0) {
        return {
            status: 'success',
            message: 'This manager does not have any tasks assigned.',
            data: [],
        };
    }

    return {
        status: 'success',
        message: "Manager's tasks fetched successfully.",
        data: manager.tasksManaged,
    };
};




const TaskAssignToUser = async (user, body, query) => {
    const { _id: ManagerId } = user;  
    const { UserId, TaskId } = query;  
    if (!UserId || !TaskId) throw ('User ID and Task ID are required.');
    if (!mongoose.Types.ObjectId.isValid(UserId) || !mongoose.Types.ObjectId.isValid(TaskId))  
        throw ('Invalid User ID or Task ID.');
    const manager = await Manager.findById(ManagerId);
    if (!manager) throw ('Manager not found.');
    const dbUser = await User.findById(UserId);  
    if (!dbUser) throw ('User not found.');
    const task = await Task.findById(TaskId);
    if (!task) throw ('Task not found.');
    if (!manager.tasksManaged.includes(TaskId)) throw ('Manager does not have this task.');
    if (task.assignedTo.includes(UserId)) throw ('User is already assigned to this task.');
    task.assignedTo.push(UserId);
    await task.save();
    if (!dbUser.assignedTask.includes(TaskId)) {
        dbUser.assignedTask.push(TaskId);
        await dbUser.save();
    }
    if (!manager.team.includes(UserId)) {
        manager.team.push(UserId);
        await manager.save();
    }
    return {
        message: 'Task successfully assigned to the user.',
        task: task,
        user: dbUser
    };
};






const TeamsUserProfile = async (user, body, query) => {
    const { _id: ManagerId } = user; 
    const manager = await Manager.findById(ManagerId).populate('team', 'username email profilePicture bio'); 
    if (!manager) throw ('Manager not found.');
    return {
        message: 'Team members fetched successfully.',
        teamMembers: manager.team 
    };
};


const updatedTaskByManager = async (user, body, query, io) => {
    const { _id: ManagerId } = user; 
    const { TaskId } = query; 
    const { title, description, dueDate } = body; 
    const task = await Task.findById(TaskId);
    if (!task) throw new Error('Task not found.');
    const manager = await Manager.findById(ManagerId).populate('team', '_id username email'); 
    if (!manager) throw new Error('Manager not found.');
    if (!manager.tasksManaged.includes(TaskId)) throw ('Manager does not have access to this task.');
    task.title = title || task.title; 
    task.description = description || task.description; 
    task.dueDate = dueDate || task.dueDate; 
    await task.save();

    const teamMembers = manager.team;
    
    io.emit('taskUpdated', {
        message: 'Task updated successfully.',
        task,
        teamMembers
    });
    return {
        message: 'Task updated successfully.',
        task,
        teamMembers
    };
};














module.exports = { logOut, updatedTaskByManager,TeamsUserProfile ,TaskAssignToUser , TotalTaskAccessManager,login,ManagerAllUsers}