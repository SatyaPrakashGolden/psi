const {Task}=require('../../task/model/task.model')
const {Manager }=require('../../manager/model/manager.model')
const {User}=require('../model/user.model')
const bcrypt = require('bcrypt');
const rateLimit = require("express-rate-limit");
const jwt = require('jsonwebtoken');
const db = require('../../../db/mongoose');  
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { isValidEmail, isValidPassword } = require('../../../middlewares/validator.middleware');
require('dotenv').config();


const login = async (data) => {
    const { usernameOrEmail, password } = data;  
    if (!usernameOrEmail || !password)  throw ('Username/email and password are required.');
    const user = await User.findOne({
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

const AssignedTask = async (user, body, query) => {
    const { _id: userId } = user; 
    const dbUser = await User.findById(userId).populate('assignedTask'); 
    if (!dbUser) throw new Error('User not found.');
    return {
      message: 'Tasks retrieved successfully.',
      tasks: dbUser.assignedTask
    };
  };

  const MyProfile = async (user, body, query) => {
    const { _id: userId } = user; 

    const dbUser = await User.findById(userId).populate('assignedTask'); 
  
    if (!dbUser) throw new Error('User not found.');
  
    return {
      message: 'Profile retrieved successfully.',
      user: {
        username: dbUser.username,
        email: dbUser.email,
        profilePicture: dbUser.profilePicture,
        bio: dbUser.bio,
        assignedTasks: dbUser.assignedTask, 
      }
    };
  };

  const SubmitTask = async (user, body, query) => {
    const { _id: userId } = user; 
    const { TaskId } = body; 
    if (!mongoose.Types.ObjectId.isValid(TaskId)) throw new Error('Invalid Task ID.');
    const task = await Task.findById(TaskId);
    if (!task) throw new Error('Task not found.');
    const dbUser = await User.findById(userId);
    if (!dbUser) throw new Error('User not found.');
    if (!dbUser.assignedTask.includes(TaskId)) {
        throw new Error('You are not assigned to this task.');
    }
    if (task.submmitedUser.includes(userId)) {
        throw new Error('You have already submitted this task.');
    }
    task.submmitedUser.push(userId);
    await task.save();
    return {
        message: 'Task successfully submitted.',
        task
    };
};

const logOut = async (user) => {
  const { _id: adminId } = user;
  await User.findByIdAndUpdate(adminId, { $set: { accessToken: null } });
  return { 
      msg: "Logout successful. Access token removed." 
  };
};



  

module.exports = {logOut ,SubmitTask , MyProfile,login, AssignedTask}