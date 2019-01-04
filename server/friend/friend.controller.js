const { get, pick } = require("lodash");

const User = require("../user/user.model");
const requireAuth = require("../middleware/requireAuth");

module.exports = app => {
  app.get("/api/friends", requireAuth, (req, res) => {
    User.findById(req.user.id)
      .then(user => {
        const friends = get(user, "friends");
        res.status(200).send(friends);
      })
      .catch(err => {
        console.log(err);
        res.status(400).send(err);
      });
  });

  app.post("/api/friends", requireAuth, (req, res) => {
    const body = pick(req.body, ["userId", "type"]);
    const date = new Date().toISOString();

    //we are getting sender id from param

    User.findById(req.user.id)
      .then(user => {
        const requestReceived = {
          ...body,
          date,
          direction: "received"
        };
        // we are getting receiver id from body

        console.log(requestReceived);

        User.findOneAndUpdate(
          { _id: body.userId },
          {
            $push: {
              requests: requestReceived
            }
          }
        )
          .then(user => {
            // user
            //   .push({
            //     requests: { ...request, direction: "sent", resolved: false }
            //   })
            //   .then(() => {
            //     res.status(200).send({ data: "Zaproszenie wysłane" });
            //   })
            //   .catch(() => {
            //     res
            //       .status(400)
            //       .send({ data: "Nie udało się wysłać zaproszenia." });
            //   });
            res
              .status(200)
              .send({ data: `Zaproszenie do ${user.username} wysłane` });
          })
          .catch(err => {
            console.log(err);
            res.status(400).send(err);
          });
      })
      .catch(err => {
        res.status(404).send(err);
      });
  });
};
