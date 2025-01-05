const jwt = require('jsonwebtoken');
const { Admin } = require("../modules/admin/model/admin.model");
require('dotenv').config();

exports.authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECERET);
    const user = await Admin.findById(decoded.userId);  

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }
    if (token !== user.accessToken) {
      return res.status(401).json({ error: "Unauthorized:  please login again" });
    }


    if (user.roles !== 1) {
      return res.status(403).json({ error: "Forbidden: You are not an admin" });
    }
 
    req.user = user; 
    next();
  } catch (err) {
    console.error("Authentication error:", err); 
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
