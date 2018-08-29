const NewsSchema = require("./newsSchema");

module.exports = app => {
  app.get("/news", (req, res) => {
    NewsSchema.find().then(news => {
      res.send(news);
    });
  });
};
