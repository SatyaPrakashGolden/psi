let express = require('express');
let {authenticateManager} =require('../../../middlewares/authenticateManager')
let {limiter}=require('../../../middlewares/validator.middleware')
const router = express.Router();
const { wrapAsync } = require("../../../helpers/router.helper");
const {logOut, updatedTaskByManager,TeamsUserProfile,TaskAssignToUser,TotalTaskAccessManager,login ,ManagerAllUsers} = require("../controller/manager.controller");
router.post("/login", limiter,wrapAsync(login));
router.get("/ManagerAllUsers", authenticateManager,limiter,wrapAsync(ManagerAllUsers));
router.get("/TotalTaskAccessManager", authenticateManager,limiter,wrapAsync(TotalTaskAccessManager));
router.get("/TaskAssignToUser", authenticateManager,limiter,wrapAsync(TaskAssignToUser));
router.get("/TeamsUserProfile", authenticateManager,limiter,wrapAsync(TeamsUserProfile));
router.put("/updatedTaskByManager", authenticateManager,limiter,wrapAsync(updatedTaskByManager));
router.get("/logOut", authenticateManager,limiter,wrapAsync(logOut));


module.exports = router;