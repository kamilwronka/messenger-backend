const Message = require("./messages.model");
const User = require("../user/user.model");
const Conversation = require("../conversation/conversation.model");

const { isEmpty, find } = require("lodash");

module.exports = (app, io) => {
  io.on("connection", function(socket) {
    console.log("connected");
    const user = socket.user;
    user.online = true;
    user.lastOnline = Date.now();
    user.save().then(() => console.log("online"));

    socket.on("disconnect", () => {
      user.online = false;
      user.save().then(() => console.log("offline"));
    });

    socket.on("message", async function(conversationId, msg, toUsers) {
      // const message = new Message({ ...msg, date: new Date().toISOString() });
      console.log(conversationId);
      const conversation = await Conversation.findById(conversationId);

      console.log(user.id, toUsers);

      if (!isEmpty(conversation) === "dupa") {
        conversation.messages.push(msg);
        // console.log(conversation.messages);
        conversation.save().then(() => console.log("zapisano w bazie"));
      } else {
        // console.log(toUsers, user.id);
        const newConversation = new Conversation({
          participants: [user.id, ...toUsers],
          messages: [msg]
        });
        newConversation.save().then(conversation => {
          // console.log(conversation);
          user.conversations.push(conversation._id);
          User.findByIdAndUpdate(
            { _id: toUsers[0] },
            {
              $push: {
                conversations: conversation._id
              }
            }
          )
            .then(() => console.log("saved"))
            .catch(() => console.log("couldnt find"));
          user.save().then(user => {
            console.log("emitted");
            io.emit("newConversation", conversation._id);
          });
        });
      }
      console.log(msg);
      // message.save().then(msg => io.emit("message", msg));
      io.emit("message", msg);
    });
  });
  app.get("/api/messages", (req, res) => {
    Message.find().then(messages => {
      res.send(messages);
    });
  });
};
