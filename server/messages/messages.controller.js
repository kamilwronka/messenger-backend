const Message = require("./messages.model");

module.exports = (app, io) => {
  io.on("connection", function(socket) {
    console.log("connected");
    socket.on("message", function(msg) {
      const message = new Message({ ...msg, date: new Date().toISOString() });
      console.log(msg);
      message.save().then(msg => io.emit("message", msg));
    });
  });
  app.get("/api/messages", (req, res) => {
    Message.find().then(messages => {
      res.send(messages);
    });
  });
};
