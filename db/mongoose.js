const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const USER = process.env.MONGO_USER;
const PASS = process.env.MONGO_PASS;
const PORT = process.env.MONGO_PORT;
const IP = process.env.MONGO_IP;

mongoose.connect(
  `mongodb://${USER}:${PASS}@${IP}:${PORT}/game_test?authSource=admin`,
  { useNewUrlParser: true }
);

mongoose.connection
  .once("open", () => console.log("Connected to database"))
  .on("error", error => {
    console.warn("Warning", error);
  });
