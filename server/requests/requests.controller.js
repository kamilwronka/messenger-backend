const { get } = require("lodash");

const User = require("../user/user.model");
const requireAuth = require("../middleware/requireAuth");

module.exports = app => {
  app.get("/api/requests", requireAuth, (req, res) => {
    res.status(200).send(get(req.user, "requests"));
    // User.findById(req.params.id)
    //   .then(user => {
    //     const requests = get(user, "requests");
    //     res.status(200).send(requests);
    //   })
    //   .catch(err => {
    //     res.status(400).send(err);
    //   });
  });
};
