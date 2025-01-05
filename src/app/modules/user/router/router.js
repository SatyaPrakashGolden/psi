let express = require('express');
let {authenticateUser}=require('../../../middlewares/jwt.middleware')
let {limiter}=require('../../../middlewares/validator.middleware')
const router = express.Router();
const {logOut,SubmitTask,MyProfile, login,AssignedTask } = require("../controller/user.controller");
const { wrapAsync } = require("../../../helpers/router.helper");
router.post("/login", limiter,wrapAsync(login));
router.get("/AssignedTask", authenticateUser,limiter,wrapAsync(AssignedTask));
router.get("/MyProfile", authenticateUser,limiter,wrapAsync(MyProfile));
router.post("/SubmitTask", authenticateUser,limiter,wrapAsync(SubmitTask));
router.get("/logOut", authenticateUser,limiter,wrapAsync(logOut));

module.exports = router;
