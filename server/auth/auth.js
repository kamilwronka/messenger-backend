require("../../services/passport");
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

const User = require("../user/user");

module.exports = app => {
  app.get("/", requireAuth, (req, res) => {
    res.send({ hi: "there" });
  });

  app.get("/currentUser", requireAuth, (req, res) => {
    console.log("something");
    res.send(req.user);
  });

  app.post("/signin", requireSignin, async (req, res) => {
    const token = await req.user.generateAuthToken();

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000 * 30,
      httpOnly: true
    });
    res.send({ user: req.user });
  });
  app.post("/signup", async (req, res) => {
    const user = await new User(req.body).save();
    const token = await user.generateAuthToken();

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000 * 30,
      httpOnly: true
    });
    res.send({ user });
  });
};
