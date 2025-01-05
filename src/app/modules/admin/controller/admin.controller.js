const {AllTask,logOut,AddUsersInManagerTeam ,AddTaskForManager,CreateUser,CreateManager,DeleteTask,getAllTaskbyAdmin,SignUp,login ,AddTask,updateTask }=require('../business/admin.business')
exports.SignUp = async req => await SignUp(req.body)
exports.login = async req => await login(req.body)
exports.AddTask = async req => await AddTask(req.user,req.body,req.query)
exports.updateTask = async req => await updateTask(req.user,req.body,req.query)
exports.DeleteTask = async req => await DeleteTask(req.user,req.body,req.query)
exports.getAllTaskbyAdmin= async req => await getAllTaskbyAdmin(req.user,req.body,req.query)
exports.CreateManager= async req => await CreateManager(req.user,req.body,req.query)
exports.CreateUser= async req => await CreateUser(req.user,req.body,req.query)
exports.AddTaskForManager= async req => await AddTaskForManager(req.user,req.body,req.query)
exports.AddUsersInManagerTeam= async req => await AddUsersInManagerTeam(req.user,req.body,req.query)
exports.logOut= async req => await logOut(req.user,req.body,req.query)
exports.AllTask= async req => await AllTask(req.user,req.body,req.query)


// CreateManager  CreateUser AddTaskForManager AddUsersInManagerTeam logOut