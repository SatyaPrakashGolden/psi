const {  Admin  } = require('../model/admin.model');
const {Task}=require('../../task/model/task.model')
const {Manager }=require('../../manager/model/manager.model')
const {User}=require('../../user/model/user.model')
const bcrypt = require('bcrypt');
const rateLimit = require("express-rate-limit");
const jwt = require('jsonwebtoken');
const db = require('../../../db/mongoose');  
const nodemailer = require('nodemailer');
const { isValidEmail, isValidPassword } = require('../../../middlewares/validator.middleware');
require('dotenv').config();

const sendRegisterEmail = async (email) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'satya.21754@knit.ac.in',
        pass: 'Satya@123'
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email for registration',
      text: 'You have successfully registered.'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Registration email sent to:', email);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const SignUp = async (body) => {
    const { username, email, password } = body;
    if (!isValidEmail(email))  throw ("Invalid email format.");
    if (!isValidPassword(password)) throw ("Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.");
    const existingUser = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingUser) throw ("Username or email already exists.");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Admin({
        username,
        email,
        password: hashedPassword
    });
    await newUser.save();
    const token = jwt.sign(
        { userId: newUser._id, username: newUser.username, email: newUser.email },
        process.env.JWT_SECERET,  
        { expiresIn: '100h' }
    );
    newUser.accessToken = token;
    await newUser.save();
    await sendRegisterEmail(email);
    return { message: "User registered successfully!", token };
};

const login = async (data) => {
    const { usernameOrEmail, password } = data;  
    if (!usernameOrEmail || !password)  throw ('Username/email and password are required.');
    const user = await Admin.findOne({
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
        const { _id: adminId } = user;
        await Admin.findByIdAndUpdate(adminId, { $set: { accessToken: null } });
        return { 
            msg: "Logout successful. Access token removed." 
        };
};


const AddTask = async (user, body) => {
    const { _id } = user;
    const taskData = {
        ...body,
        createdBy: _id 
    };
    const task = new Task(taskData);  
    await task.save();
    return {
        msg: "success",
        data: task
    };
};

const AllTask = async (user, body, query) => {
    const { key } = query;  
    const searchQuery = {};

    if (key) {
        const isDate = !isNaN(Date.parse(key));  
        if (isDate) {
            searchQuery.dueDate = new Date(key);  
        } else {
        
            searchQuery.$or = [
                { title: { $regex: key.trim(), $options: 'i' } }, 
                { description: { $regex: key.trim(), $options: 'i' } }, 
                { priority: { $regex: key.trim(), $options: 'i' } }
            ];
        }
    }

    // Fetch tasks based on the search query, and sort by createdAt descending
    const tasks = await Task.find(searchQuery).sort({ createdAt: -1 });

    return {
        msg: "success",
        data: tasks,
    };
};




const updateTask = async (user, body, query) => {
    const { taskId } = query;
    const { title, description } = body;
    const task = await Task.findById(taskId);
    if (!task) throw ("Task not found");
    task.title = title;
    task.description = description;
    await task.save();
    return {
        msg: "Task updated successfully",
        data: task
    };
};

const DeleteTask = async (user,body, query) => {
    const { taskId } = query;
    const task = await Task.findById(taskId);
    if (!task)  throw ("Task not found");
    await Task.findByIdAndDelete(taskId);
    return {
        msg: "Task deleted successfully"
    };
};

const getAllTaskbyAdmin = async (user,body,query) => {
    const { key } = query;
    console.log("---------------->",key)
    const searchQuery = key
        ? {
            $or: [
                { title: { $regex: key.trim(), $options: 'i' } }, 
                { description: { $regex: key.trim(), $options: 'i' } }, 
            ]
        }
        : {}; 

    const tasks = await Task.find(searchQuery);
    return {
        msg: "Tasks retrieved successfully",
        total:tasks.length,
        data: tasks
    };
};


const CreateManager = async (user, body, query) => {
    const { username, email, password, profilePicture, bio } = body;
    if (!isValidEmail(email))  throw new Error("Invalid email format.");
    if (!isValidPassword(password))  throw new Error("Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.");
    const existingManager = await Manager.findOne({ $or: [{ username }, { email }] });
    if (existingManager) throw new Error("Username or email already exists.");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newManager = new Manager({
        username,
        email,
        password: hashedPassword,
        profilePicture: profilePicture || '',
        bio: bio || '',
    });
    await newManager.save();
    return {
        message: "Manager created successfully!"
    };
};






const CreateUser = async (user, body, query) => {
    const { username, email, password, profilePicture, bio } = body;
    if (!isValidEmail(email))  throw new Error("Invalid email format.");
    if (!isValidPassword(password))  throw new Error("Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.");
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) throw new Error("Username or email already exists.");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        profilePicture: profilePicture || '',
        bio: bio || '',
    });
    await newUser.save();
    return {
        message: "User created successfully!"
    };
};



const AddTaskForManager = async (user, body, query) => {
    const { taskId, ManagerId } = query;
    const task = await Task.findById(taskId);
    if (!task) throw ("Task not found.");
    const manager = await Manager.findById(ManagerId);
    if (!manager) throw ("Manager not found.");
    if (manager.tasksManaged.includes(taskId)) throw ("Task is already assigned to this manager.");
    manager.tasksManaged.push(taskId);
    await manager.save();
    return {
        message: "Task added successfully to the manager.",
        manager
    };
};


const AddUsersInManagerTeam = async (user, body, query) => {
    const { ManagerId } = query;
    const { Users } = body;
    const manager = await Manager.findById(ManagerId);
    if (!manager)throw ("Manager not found.");
    const users = await User.find({ '_id': { $in: Users } });
    if (users.length !== Users.length)   throw ("Some users not found.");
    Users.forEach(userId => {
        if (!manager.team.includes(userId)) {
            manager.team.push(userId);
        }
    });
    await manager.save();
    return {
        message: "Users added to the manager's team successfully.",
        manager
    };
};








module.exports = {AllTask,logOut,AddUsersInManagerTeam,AddTaskForManager,  CreateUser ,CreateManager,SignUp, login,AddTask,updateTask,DeleteTask,getAllTaskbyAdmin }