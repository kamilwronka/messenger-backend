const { pick, find, omit, last } = require("lodash");

const User = require("../user/user.model");
const Conversation = require("../conversation/conversation.model");
const requireAuth = require("../middleware/requireAuth");

module.exports = app => {
  app.get("/api/users", (req, res) => {
    User.find({ $text: { $search: req.query.query } })
      .limit(10)
      .exec(function(err, docs) {
        if (err) {
          res.send(err);
        }
        res.send(docs);
      });
  });

  app.get("/api/users/conversations", requireAuth, async (req, res) => {
    // res.send(req.user.conversations);
    User.findById(req.user.id)
      .populate({
        path: "conversations",
        populate: {
          path: "participants",
          model: "User"
        }
      })
      .exec((err, data) => {
        const desiredData = data.conversations.map(conversation => {
          const desiredConversation = pick(conversation, [
            "_id",
            "participants",
            "color",
            "name"
          ]);
          desiredConversation.lastMessage = last(conversation.messages);
          desiredConversation.participants = desiredConversation.participants.map(
            participant => {
              return pick(participant, [
                "_id",
                "username",
                "avatar",
                "online",
                "lastOnline"
              ]);
            }
          );
          return desiredConversation;
        });

        res.send(desiredData);
      });

    // });
  });

  app.post("/api/users/avatar", requireAuth, async (req, res) => {
    const body = pick(req.body, ["url"]);

    try {
      await User.findByIdAndUpdate(req.user.id, { $set: { avatar: body.url } });
      const user = await User.findById(req.user.id);
      res.send(user.avatar);
    } catch (err) {
      res.status(400).send("Wystąpił problem, spróbuj ponownie.");
    }
  });

  app.post("/api/users/backgroundImage", requireAuth, async (req, res) => {
    const body = pick(req.body, ["url"]);

    try {
      await User.findByIdAndUpdate(req.user.id, {
        $set: { backgroundImage: body.url }
      });
      const user = await User.findById(req.user.id);
      res.send(user.backgroundImage);
    } catch (err) {
      res.status(400).send("Wystąpił problem, spróbuj ponownie.");
    }
  });

  app.post("/api/users/requests/:id", requireAuth, async (req, res) => {
    const desiredRequest = find(
      req.user.requests,
      i => `${i._id}` === req.params.id
    );

    const preparedFriend = {
      userId: desiredRequest.userId
    };

    const response = await req.user.addToFriends(desiredRequest.userId);
    await req.user.deleteRequest(desiredRequest);
    await User.findByIdAndUpdate(
      { _id: desiredRequest.userId },
      {
        $push: {
          friends: req.user.id
        }
      }
    );
    res.status(200).send(response);

    // try {
    //   await User.findByIdAndUpdate(req.user.id, { $push: { friends: body.url } });
    //   const user = await User.findById(req.user.id);
    //   res.send(user.avatar);
    // } catch (err) {
    //   res.status(400).send("Wystąpił problem, spróbuj ponownie.");
    // }
  });
};
