

const {logOut,SubmitTask ,MyProfile, AssignedTask,login}=require('../business/user.business')
exports.login = async req => await login(req.body)
exports.AssignedTask = async req => await AssignedTask(req.user,req.body,req.query)
exports.MyProfile = async req => await MyProfile(req.user,req.body,req.query)
exports.SubmitTask = async req => await SubmitTask(req.user,req.body,req.query)
exports.logOut = async req => await logOut(req.user,req.body,req.query)
