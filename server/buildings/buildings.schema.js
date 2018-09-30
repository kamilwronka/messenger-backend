const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isNil } = require("lodash");

//buildings schema

const BuildingsSchema = new Schema({
  townHall: {
    level: {
      type: Number,
      default: 1,
      required: true
    }
  },
  defensiveWall: {
    level: {
      type: Number,
      default: 0,
      required: true
    }
  }
});

//
// BuildingsSchema.statics = {

// };

module.exports = BuildingsSchema;
