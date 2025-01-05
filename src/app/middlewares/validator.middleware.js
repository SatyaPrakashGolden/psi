const rateLimit = require("express-rate-limit");
const {User }= require('../modules/user/model/user.model');
exports.isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  return true
} 

const limiter = rateLimit({
  max: 1, 
  windowMs: 5 * 1000, 
  message: "Too many requests, please try again later."
});

const checkAdmin=async(_id)=>{
  const userAdmin = await User.findById(_id);  
  if (!userAdmin || userAdmin.roles !== 1) {
      throw new Error("You are not an admin");
  }else{
    return true;
  }
}

const isValidEmail = (email) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};


function generateTrackingNumber(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let trackingNumber = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      trackingNumber += characters[randomIndex];
  }
  return trackingNumber;
}

const getTrackingNumber =async  () =>{
  let trackingNumber;
  let isUnique = false;

  while (!isUnique) {
      trackingNumber = generateTrackingNumber();
      const existingUser = await User.findOne({ 'assignedTasks.trackingNumber': trackingNumber }); // Check uniqueness in DB
      isUnique = !existingUser; 
  }
  return trackingNumber;
}


module.exports = {  isValidEmail, isValidPassword ,checkAdmin,limiter ,getTrackingNumber };