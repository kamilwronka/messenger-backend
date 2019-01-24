const User = require("../user/user.model");

const socketRequireAuth = (socket, next) => {
  const token = socket.handshake.query.token;

  User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject();
      }

      socket.user = user;
      socket.token = token;
      return next();
    })
    .catch(err => {
      return next(new Error("auth error"));
    });
};

module.exports = socketRequireAuth;
