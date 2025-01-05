const {logOut,updatedTaskByManager,TeamsUserProfile,TaskAssignToUser,TotalTaskAccessManager,login,ManagerAllUsers}=require('../business/manager.business')
exports.login = async req => await login(req.body)
exports.ManagerAllUsers = async req => await ManagerAllUsers(req.user,req.body,req.query)
exports.TotalTaskAccessManager = async req => await TotalTaskAccessManager(req.user,req.body,req.query)
exports.TaskAssignToUser = async req => await TaskAssignToUser(req.user,req.body,req.query)
exports.TeamsUserProfile = async req => await TeamsUserProfile(req.user,req.body,req.query)
exports.logOut = async req => await logOut(req.user,req.body,req.query)
exports.updatedTaskByManager= async req => await updatedTaskByManager(req.user,req.body,req.query,req.app.get('socketio'))

// logOut