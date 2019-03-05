const { pick, find, omit, last } = require("lodash");

const User = require("../user/user.model");
const Request = require("../requests/requests.model");
const Conversation = require("../conversation/conversation.model");
const requireAuth = require("../middleware/requireAuth");

module.exports = app => {
  app.get("/api/users", requireAuth, (req, res) => {
    User.find({ $text: { $search: req.query.query } })
      .limit(10)
      .exec(function(err, docs) {
        if (err) {
          return res.send(err);
        }
        const desiredData = docs.map(elem => {
          const isOnFriendsList = find(
            elem.friends,
            friend => friend === req.user.id
          );
          if (isOnFriendsList) {
            return { ...elem, onFriendsList: true };
          } else {
            return elem;
          }
        });

        console.log(desiredData);

        res.send(desiredData);
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
        },
        options: { sort: { updatedAt: -1 } }
      })
      // .sort({ updatedAt: -1 })
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
    const desiredRequest = await Request.findById(req.params.id);
    const response = await req.user.addToFriends(desiredRequest.fromUser._id);

    await User.findByIdAndUpdate(
      { _id: desiredRequest.fromUser._id },
      {
        $push: {
          friends: req.user.id
        }
      }
    );

    if (desiredRequest.type === "friendsRequest") {
      const participants = [desiredRequest.fromUser, desiredRequest.toUser];
      const newConversation = new Conversation({
        participants,
        messages: []
      });
      const user = req.user;

      newConversation.save().then(conversation => {
        // console.log(conversation);
        user.conversations.push(conversation._id);
        User.findByIdAndUpdate(
          { _id: desiredRequest.fromUser },
          {
            $push: {
              conversations: conversation._id
            }
          }
        )
          .then(() => console.log("saved"))
          .catch(() => console.log("couldnt find"));
        user.save();
      });
    }

    await Request.findByIdAndDelete(desiredRequest._id);
    res.status(200).send(response);
  });

  app.delete("/api/users/requests/:id", requireAuth, async (req, res) => {
    await Request.findByIdAndDelete(req.params.id);

    res.status(200).send();
  });
};
