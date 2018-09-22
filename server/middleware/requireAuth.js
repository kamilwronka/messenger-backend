const User = require("../user/user.model");

const requireAuth = (req, res, next) => {
  const token = req.header("Authorization");

  User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject();
      }

      req.user = user;
      req.token = token;
      next();
    })
    .catch(err => {
      res.status(401).send("Unauthorized");
    });
};

module.exports = requireAuth;
