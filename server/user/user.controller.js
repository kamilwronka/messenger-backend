const User = require("../user/user.model");
const requireAuth = require("../middleware/requireAuth");

module.exports = app => {
  app.get("/api/users", (req, res) => {
    User.find()
      .then(users => {
        res.status(200).send(users);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });
};
