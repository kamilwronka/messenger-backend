const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorldSchema = new Schema({
  id: {
    type: Number
  },
  name: {
    type: String,
    required: true
  }
});

const World = mongoose.model("worlds", WorldSchema);

module.exports = World;
