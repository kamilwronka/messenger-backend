const NewsSchema = require("./newsSchema");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const USER = process.env.MONGO_USER;
const PASS = process.env.MONGO_PASS;
const PORT = process.env.MONGO_PORT;
const IP = process.env.MONGO_IP;

describe("Creating records", () => {
  mongoose.connect(
    `mongodb://${USER}:${PASS}@${IP}:${PORT}/game_test?authSource=admin`
  );
  mongoose.connection
    .once("open", () => console.log("Good to go!"))
    .on("error", error => {
      console.warn("Warning", error);
    });
  it("should save a user", () => {
    const news = new NewsSchema({
      authorName: "Kamil",
      authorImg: "http://getdrawings.com/img/person-silhouette-icon-23.png",
      date: new Date(),
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    });
    news
      .save()
      .then(() => {
        console.log("news saved");
        expect(news.isNew).toBe(false);
      })
      .catch(err => console.log(err));
  });
});
