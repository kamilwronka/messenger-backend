const { pick } = require("lodash");

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

  app.post("/api/users/avatar", requireAuth, async (req, res) => {
    const body = pick(req.body, ["url"]);
    let user;

    console.log(body);

    try {
      user = await User.findByIdAndUpdate(req.user.id, {
        $set: { avatar: body.url }
      });
      res.status(200).send(user.avatar);
    } catch (err) {
      res.status(400).send(err);
    }
  });
};
