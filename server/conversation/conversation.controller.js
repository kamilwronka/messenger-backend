const { get, pick } = require("lodash");

const Conversation = require("../conversation/conversation.model");
const requireAuth = require("../middleware/requireAuth");

module.exports = app => {
  app.get("/api/conversations/:id", requireAuth, (req, res) => {
    Conversation.findById(req.params.id)
      .populate("participants")
      .exec(function(err, conversations) {
        res.send(conversations);
      });
    // .then(conversation => {
    //   res.status(200).send(conversation);
    // })
    // .catch(err => {
    //   console.log(err);
    //   res.status(400).send(err);
    // });
  });

  //   app.get("/api/conversations", requireAuth, async (req, res) => {
  //     Conversation.find()
  //     .then(conversation => {
  //       res.status(200).send(conversation);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.status(400).send(err);
  //     });
  //   });
};
