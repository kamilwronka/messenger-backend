var app = require("express")();
const mongoose = require("mongoose");
var http = require("http").Server(app);

mongoose.Promise = global.Promise;

const USER = process.env.MONGO_USER;
const PASS = process.env.MONGO_PASS;
const PORT = process.env.MONGO_PORT;
const IP = process.env.MONGO_IP;

const user = require("./server/user/user");

mongoose.connect(
  `mongodb://${USER}:${PASS}@${IP}:${PORT}/game_test?authSource=admin`,
  { useNewUrlParser: true }
);

mongoose.connection
  .once("open", () => console.log("Connected to database"))
  .on("error", error => {
    console.warn("Warning", error);
  });

app.use("/user", user);

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`App is listening at PORT: ${8080}`);
});
