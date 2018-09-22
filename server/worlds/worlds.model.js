const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorldSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

const World = mongoose.model("worlds", WorldSchema);

module.exports = World;
