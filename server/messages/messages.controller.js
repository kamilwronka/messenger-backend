const Message = require("./messages.model");
const User = require("../user/user.model");
const Conversation = require("../conversation/conversation.model");

const { isEmpty, find } = require("lodash");

module.exports = (app, io, socket, user) => {
  socket.on("disconnect", () => {
    user.online = false;
    user.save().then(() => console.log("offline"));
  });

  socket.on("message", async function(conversationId, msg, toUsers) {
    console.log("msg");
    const participants = [user.id, ...toUsers];
    const conversation = await Conversation.findById(conversationId);
    const preparedMsg = {
      ...msg,
      date: new Date().toISOString(),
      read: false
    };

    console.log(user.id, toUsers);

    conversation.messages.push(preparedMsg);
    await conversation.save();

    participants.forEach(elem => {
      io.to(elem).emit("message", preparedMsg);
      // io.to(elem).emit("message2", preparedMsg);
    });
  });
  app.get("/api/messages", (req, res) => {
    Message.find().then(messages => {
      res.send(messages);
    });
  });
};
