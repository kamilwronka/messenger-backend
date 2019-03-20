const { get, pick, find, isEmpty } = require("lodash");

const User = require("../user/user.model");
const Request = require("../requests/requests.model");
const requireAuth = require("../middleware/requireAuth");

module.exports = (app, io, socket, user) => {
  app.get("/api/friends", requireAuth, (req, res) => {
    User.findById(req.user.id)
      .populate("friends")
      .exec((err, data) => {
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
        .send({ message: "You are trying to add yourself." });
    }

    const invitedUser = await User.findById(body.userId);

    invitedUser.requests.forEach(invitedUserRequest => {
      match = req.user.requestsSent.filter(sendingUserRequest => {
        return sendingUserRequest !== invitedUserRequest;
      });
    });

    if (!isEmpty(match)) {
      return res
        .status(400)
        .send({ message: "You have already invited this user." });
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

      io.to(invitedUser._id).emit("request", {
        fromUser: req.user,
        toUser: body.userId,
        type: body.type,
        _id: newRequest._id
      });

      res
        .status(200)
        .send({ data: `Zaproszenie do ${invitedUser.username} wysłane` });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });

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
