const Message = require("./messages.model");
const User = require("../user/user.model");
const Conversation = require("../conversation/conversation.model");

const { isEmpty, find } = require("lodash");

module.exports = (app, io) => {
  io.on("connection", function(socket) {
    socket.join(socket.user.id);
    console.log(socket.user.id);
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
      const participants = [user.id, ...toUsers];
      const conversation = await Conversation.findById(conversationId);
      const preparedMsg = {
        ...msg,
        date: new Date().toISOString(),
        read: false
      };

      console.log(user.id, toUsers);

      if (!isEmpty(conversation)) {
        conversation.messages.push(preparedMsg);
        // console.log(conversation.messages);
        conversation.save().then(() => console.log("zapisano w bazie"));
      } else {
        // console.log(toUsers, user.id);
        const newConversation = new Conversation({
          participants,
          messages: [preparedMsg]
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
      console.log(preparedMsg);
      // message.save().then(preparedMsg => io.emit("message", preparedMsg));

      participants.forEach(elem => {
        console.log(elem);
        io.to(elem).emit("message", preparedMsg);
      });
    });
  });
  app.get("/api/messages", (req, res) => {
    Message.find().then(messages => {
      res.send(messages);
    });
  });
};
