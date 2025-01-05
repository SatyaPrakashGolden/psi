let express = require('express');
let {authenticateAdmin}=require('../../../middlewares/authenticateAdmin')
let {limiter}=require('../../../middlewares/validator.middleware')
const router = express.Router();
const {AllTask,logOut,AddUsersInManagerTeam,AddTaskForManager,CreateUser, CreateManager,getAllTaskbyAdmin ,DeleteTask, SignUp,login,AddTask ,updateTask} = require("../controller/admin.controller");
const { wrapAsync } = require("../../../helpers/router.helper");
router.post("/login", limiter,wrapAsync(login));
router.post("/SignUp", limiter,wrapAsync(SignUp));
router.post("/AddTask", limiter,authenticateAdmin,wrapAsync(AddTask));
router.put("/updateTask", limiter,authenticateAdmin,wrapAsync(updateTask));
router.delete("/DeleteTask", limiter,authenticateAdmin,wrapAsync(DeleteTask));
router.get("/getAllTaskbyAdmin", limiter,authenticateAdmin,wrapAsync(getAllTaskbyAdmin  ));
router.post("/CreateManager", limiter,authenticateAdmin,wrapAsync(CreateManager));
router.post("/CreateUser", limiter,authenticateAdmin,wrapAsync(CreateUser));
router.get("/AddTaskForManager", limiter,authenticateAdmin,wrapAsync(AddTaskForManager));
router.post("/AddUsersInManagerTeam", limiter,authenticateAdmin,wrapAsync(AddUsersInManagerTeam));
router.get("/logOut", limiter,authenticateAdmin,wrapAsync(logOut));
router.get("/AllTask", limiter,authenticateAdmin,wrapAsync(AllTask));
module.exports = router;