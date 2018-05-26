const {User} = require('./../models/users');

let authenticate = function(req, res, next) {
  let token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if(!user) {
      Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((err) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};
