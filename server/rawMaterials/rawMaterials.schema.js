const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isNil } = require("lodash");

//raw materials schema

const RawMaterialsSchema = new Schema(
  {
    clay: {
      amount: {
        type: Number,
        default: 500,
        required: true
      }
    },
    iron: {
      amount: {
        type: Number,
        default: 500,
        required: true
      }
    },
    wood: {
      amount: {
        type: Number,
        default: 500,
        required: true
      }
    }
  },
  { _id: false }
);

module.exports = RawMaterialsSchema;
