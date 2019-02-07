const { get, pick } = require("lodash");

const User = require("../user/user.model");
const Request = require("../requests/requests.model");
const requireAuth = require("../middleware/requireAuth");

module.exports = app => {
  app.get("/api/friends", requireAuth, (req, res) => {
    User.findById(req.user.id)
      .populate("friends")
      .exec((err, data) => {
        console.log(data.friends);
        const desiredData = data.friends.map(friend => {
          return pick(friend, [
            "_id",
            "online",
            "username",
            "avatar",
            "lastOnline"
          ]);
        });

        res.send(desiredData);
      });
  });

  app.post("/api/friends", requireAuth, async (req, res) => {
    const body = pick(req.body, ["userId", "type"]);

    const newRequest = new Request({
      fromUser: req.user._id,
      toUser: body.userId,
      type: body.type
    });

    await newRequest.save();

    try {
      let invitedUser = await User.findOneAndUpdate(
        { _id: body.userId },
        {
          $push: {
            requests: newRequest._id
          }
        }
      );

      res
        .status(200)
        .send({ data: `Zaproszenie do ${invitedUser.username} wysłane` });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });
};
