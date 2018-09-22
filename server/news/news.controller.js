const NewsSchema = require("./news.model");

module.exports = app => {
  app.get("/news", (req, res) => {
    NewsSchema.find().then(news => {
      res.send(news);
    });
  });
};
