const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://root:Kamilo108@ds139690.mlab.com:39690/messenger-backend1337";

mongoose.connect(
  `${MONGODB_URI}`,
  { useNewUrlParser: true }
);

mongoose.connection
  .once("open", () => console.log("Connected to database"))
  .on("error", error => {
    console.warn("Warning", error);
  });
