const { get, pick, find } = require("lodash");

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
    let match;
    const body = pick(req.body, ["userId", "type"]);

    if (`${req.user._id}` === body.userId) {
      return res
        .status(400)
        .send("Nie możesz dodać samego siebie do znajomch.");
    }

    const invitedUser = await User.findById(body.userId);

    invitedUser.requests.forEach(invitedUserRequest => {
      match = req.user.requestsSent.filter(sendingUserRequest => {
        return sendingUserRequest !== invitedUserRequest;
      });
    });

    if (match) {
      return res
        .status(400)
        .send("Nie możesz wysłać ponownie zaproszenia tej osobie.");
    }

    const newRequest = new Request({
      fromUser: req.user._id,
      toUser: body.userId,
      type: body.type
    });

    await newRequest.save();

    try {
      await User.findOneAndUpdate(
        { _id: body.userId },
        {
          $push: {
            requests: newRequest._id
          }
        }
      );

      req.user.requestsSent.push(newRequest._id);
      await req.user.save();

      res
        .status(200)
        .send({ data: `Zaproszenie do ${invitedUser.username} wysłane` });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });
};
