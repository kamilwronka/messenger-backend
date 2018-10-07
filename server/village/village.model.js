const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isNil, find } = require("lodash");
const { initialBuildings, buildingsConf } = require("../../config/buildings");

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
  buildings: [buildingsSchema],
  rawMaterials: rawMaterialsSchema,
  buildsInProggress: [
    {
      buildingId: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      start: {
        type: Number,
        required: true
      },
      end: {
        type: Number,
        required: true
      },
      fromLevel: {
        type: Number,
        required: true
      },
      toLevel: {
        type: Number,
        required: true
      }
    }
  ]
});

VillageSchema.pre("save", function(next) {
  const village = this;

  if (village.isNew) {
    village.buildings = initialBuildings;
    next();
  }
  next();
});

VillageSchema.methods = {
  addBuildingToTheQueue: function(buildingId) {
    const village = this;

    const isBuildingOnList = () => {
      const building = find(
        village.buildsInProggress,
        building => building.buildingId === buildingId
      );
      return !isNil(building);
    };

    if (isBuildingOnList()) {
      return Promise.reject("Wybrany budynek jest już rozbudowywany");
    } else {
      const desiredBuilding = find(
        village.buildings,
        building => buildingId === building.id
      );
      if (desiredBuilding.level >= desiredBuilding.maxLevel) {
        console.log(desiredBuilding.level, desiredBuilding.maxLevel);
        return Promise.reject(
          `${desiredBuilding.name} jest już maksymalnie rozbudowany.`
        );
      }
      const timestamp = Date.now();
      const timeout =
        buildingsConf[desiredBuilding.id].buildTimes[desiredBuilding.level];
      return village.update({
        $push: {
          buildsInProggress: {
            name: desiredBuilding.name,
            buildingId,
            start: timestamp,
            end: timestamp + timeout,
            fromLevel: desiredBuilding.level,
            toLevel: desiredBuilding.level + 1
          }
        }
      });
    }
  }
};

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
