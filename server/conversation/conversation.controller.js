const { get, pick, omit } = require("lodash");

const Conversation = require("../conversation/conversation.model");
const requireAuth = require("../middleware/requireAuth");

module.exports = app => {
  app.get("/api/conversations/:id", requireAuth, (req, res) => {
    Conversation.findById(req.params.id)
      .populate({
        path: "participants",
        model: "User"
      })
      .exec(function(err, conversations) {
        res.send(conversations);
      });
  });

  app.get("/api/conversations/:id/info", requireAuth, (req, res) => {
    Conversation.findById(req.params.id)
      .populate({
        path: "participants",
        model: "User"
      })
      .exec(function(err, conversation) {
        conversation.participants = conversation.participants.map(
          participant => {
            return pick(participant, [
              "_id",
              "username",
              "avatar",
              "backgroundImage"
            ]);
          }
        );
        res.send(omit(conversation.toJSON(), ["messages"]));
      });
  });

  app.post("/api/conversations/:id/color", requireAuth, async (req, res) => {
    await Conversation.findByIdAndUpdate(req.params.id, {
      $set: { color: req.body.color }
    });
    let conversation = await Conversation.findById(req.params.id);
    res.send(omit(conversation.toJSON(), ["messages"]));
  });

  app.post("/api/conversations/:id/emoji", requireAuth, async (req, res) => {
    await Conversation.findByIdAndUpdate(req.params.id, {
      $set: { emoji: req.body.emoji }
    });
    let conversation = await Conversation.findById(req.params.id);
    res.send(omit(conversation.toJSON(), ["messages"]));
  });

  app.post("/api/conversations/:id/name", requireAuth, async (req, res) => {
    await Conversation.findByIdAndUpdate(req.params.id, {
      $set: { name: req.body.name }
    });
    let conversation = await Conversation.findById(req.params.id);
    res.send(omit(conversation.toJSON(), ["messages"]));
  });
};
