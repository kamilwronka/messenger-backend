const pick = require("lodash/pick");
const User = require("../user/user.model");
const requireAuth = require("../middleware/requireAuth");

module.exports = app => {
  app.post("/api/auth/login", (req, res) => {
    const body = pick(req.body, ["email", "password"]);

    User.findByCredencials(body.email, body.password)
      .then(user => {
        return user.generateAuthToken().then(token => {
          res.header("x-auth", token).send(user);
        });
      })
      .catch(err => {
        res.status(400).send();
      });
  });

  app.post("/api/auth/register", (req, res) => {
    const body = pick(req.body, ["email", "password"]);
    const user = new User(body);

    user
      .save()
      .then(user => {
        return user.generateAuthToken();
      })
      .then(token => {
        res.header("x-auth", token).send(user);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });

  app.get("/api/currentUser", requireAuth, (req, res) => {
    res.send(req.user);
  });

  app.delete("/api/auth/logout", requireAuth, (req, res) => {
    req.user.removeToken(req.token).then(
      () => {
        res.status(200).send();
      },
      () => {
        res.status(400).send();
      }
    );
  });
};
