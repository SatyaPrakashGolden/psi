const jwt = require('jsonwebtoken');
const { Manager} = require("../modules/manager/model/manager.model");
const { Admin } = require("../modules/admin/model/admin.model");
require('dotenv').config();

exports.authenticateManager = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECERET);
    let user;
     user = await Manager.findById(decoded.userId);  
     if(user==undefined){
      user = await Admin.findById(decoded.userId); 
     }
    

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    if (user.roles !== 1 && user.roles !== 2) {
      return res.status(403).json({ error: "Forbidden: You are not authorized" });
    }
    if (token !== user.accessToken) {
      return res.status(401).json({ error: "Unauthorized: Token mismatch, please login again" });
    }
 
    req.user = user;  
    next();
  } catch (err) {
    console.error("Authentication error:", err);  
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
