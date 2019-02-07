const { get, pick } = require("lodash");

const User = require("../user/user.model");
const requireAuth = require("../middleware/requireAuth");

module.exports = app => {
  app.get("/api/requests", requireAuth, (req, res) => {
    User.findById(req.user.id)
      .populate({
        path: "requests",
        model: "Request",
        populate: [
          { path: "fromUser", model: "User" },
          { path: "toUser", model: "User" }
        ]
      })
      .exec((err, data) => {
        if (err) {
          return res.status(400).send();
        }

        const parsed = get(data.toJSON(), "requests", []);

        const desiredData = parsed.map(elem => {
          elem.toUser = pick(elem.toUser, [
            "username",
            "avatar",
            "_id",
            "online"
          ]);
          elem.fromUser = pick(elem.fromUser, [
            "username",
            "avatar",
            "_id",
            "online"
          ]);
          return elem;
        });

        res.send(desiredData);
      });
  });
};
