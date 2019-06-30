const { get, pick, omit } = require("lodash");
const { ObjectId } = require("mongoose").Types;

const Conversation = require("../conversation/conversation.model");
const requireAuth = require("../middleware/requireAuth");

module.exports = app => {
  app.get("/api/conversations/:id", requireAuth, (req, res) => {
    const { pageSize, page } = req.query;
    Conversation.aggregate()
      .lookup({
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants"
      })
      .project({
        _id: { $toString: "$_id" },
        metadata: {
          totalMessages: { $size: "$messages" }
        },
        reversed: {
          $reverseArray: "$messages"
        }
      })
      .project({
        messages: {
          $slice: ["$reversed", pageSize * page, parseInt(pageSize, 10)]
        }
      })
      // .project({
      //   messages: {
      //     $reverseArray: "$tempMessages"
      //   }
      // })
      .match({
        _id: { $regex: req.params.id, $options: "i" }
      })
      .exec(function(err, conversation) {
        res.send(conversation[0]);
      });
  });

  app.get("/api/conversations/:id/photos", requireAuth, (req, res) => {
    const { pageSize, page } = req.query;
    Conversation.aggregate()
      .lookup({
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants"
      })
      .project({
        reversed: {
          $reverseArray: "$messages"
        }
      })
      .project({
        _id: { $toString: "$_id" },
        filtered: {
          $filter: {
            input: "$reversed",
            as: "message",
            cond: {
              $eq: ["$$message.messageType", "photo"]
            }
          }
        }
      })
      .project({
        metadata: {
          totalPhotos: {
            $size: "$filtered"
          }
        },
        photos: {
          $slice: ["$filtered", pageSize * page, parseInt(pageSize, 10)]
        }
      })
      .match({
        _id: { $regex: req.params.id, $options: "i" }
      })
      .exec(function(err, conversation) {
        res.send(conversation[0]);
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
