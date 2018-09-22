const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  authorName: String,
  authorImg: String,
  date: Date,
  content: String
});

const News = mongoose.model("news", NewsSchema);

module.exports = News;
