const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI);

mongoose.connection
  .once("open", () => console.log("Connected to database"))
  .on("error", error => {
    console.warn("Warning", error);
  });
