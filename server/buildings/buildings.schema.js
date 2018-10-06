const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isNil } = require("lodash");

//buildings schema

const BuildingsSchema = new Schema(
  {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      default: 1,
      required: true
    }
  },
  { _id: false }
);

//
// BuildingsSchema.statics = {

// };

module.exports = BuildingsSchema;
