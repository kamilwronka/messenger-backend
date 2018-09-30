const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isNil } = require("lodash");

const buildingsSchema = require("../buildings/buildings.schema");
const rawMaterialsSchema = require("../rawMaterials/rawMaterials.schema");

//w wiosce bedzie kolekcja budynkow, kolekcja wojsk i inne metadane

const VillageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  },
  positionX: {
    type: Number,
    required: true
  },
  positionY: {
    type: Number,
    required: true
  },
  buildings: buildingsSchema,
  rawMaterials: rawMaterialsSchema
});

VillageSchema.statics = {
  findByOwnerId: function(ownerId) {
    const Village = this;

    return Village.find({ ownerId }).then(villages => {
      if (isNil(villages)) {
        return Promise.reject();
      }

      return Promise.resolve(villages);
    });
  }
};

const Village = mongoose.model("villages", VillageSchema);

module.exports = Village;
