const Message = require("./messages.model");
const User = require("../user/user.model");
const Conversation = require("../conversation/conversation.model");
const gcm = require("node-gcm");

const { isEmpty, find } = require("lodash");

const getPushNotificationContent = (msg, username) => {
  console.log(msg);
  switch (msg.messageType) {
    case "video":
      return `${username} sent video.`;
    case "photo":
      return `${username} sent photo.`;
    default:
      return msg.messageContent;
  }
};

module.exports = (app, io, socket, user, sender) => {
  socket.on("changeConversationColor", async ({ conversationId, color }) => {
    Conversation.update(
      { _id: conversationId, participants: { $in: [socket.user._id] } },
      { $set: { color: color } },
      err => {
        if (err) {
          //error fallback
          socket.emit("changeConversationColor", err);
          return;
        } else {
          Conversation.findById(conversationId, (err, conversation) => {
            if (err) {
              socket.emit("changeConversationColor", err);
            }

            const message = {
              messageType: "colorChange",
              userId: socket.user._id,
              messageContent: color,
              date: new Date().toISOString(),
              read: false
            };

            conversation.participants.forEach(elem => {
              io.to(elem).emit("changeConversationColor", {
                color,
                conversationId
              });

              io.to(elem).emit("message", message);
            });
          });
        }
      }
    );
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

    const participantsData = await Promise.all(
      participants.map(participant => {
        return User.findById(participant);
      })
    );

    const deviceTokens = participantsData.map(participant => {
      return participant.pushNotificationsToken;
    });
    const msgContent = getPushNotificationContent(msg, user.username);

    const gcmMessage = new gcm.Message({
      data: null,
      collapseKey: user.username,
      notification: {
        title: user.username,
        body: msgContent,
        tag: user.username
      }
    });

    console.log(user.username, msgContent);

    // const gcmMessage = new gcm.Message();

    console.log(user.id, toUsers);

    conversation.messages.push(preparedMsg);
    await conversation.save();

    console.log(deviceTokens);

    sender.send(
      gcmMessage,
      { registrationTokens: deviceTokens },
      (err, response) => {
        console.log(response);
      }
    );

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
