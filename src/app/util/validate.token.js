const { User } = require("../modules/user/models");

const message = require("../../config/message");
const  { errorHandler } = require("../helpers/errorHandling.helper");



exports.userauthentication = async (req, res, next) => {
  try {

    const auth = req.header("Authorization");
    if (!auth) throw message.msg.unauthorisedRequest;
    const token = auth.substr(auth.indexOf(" ") + 1);
    const user = await User.findByToken(token, res);

    req.user = user;
    if (!user) throw msg.unauthorisedRequest;
    return next();
  } catch (err) {
    const error = errorHandler(err, 401);
    return res.status(error.status).send(error);
  }
};
