const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isNil, find } = require("lodash");

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
  const initialBuildings = [
    { id: 1, name: "Ratusz", level: 1 },
    { id: 2, name: "Koszary", level: 0 },
    { id: 3, name: "Cegielnia", level: 1 },
    { id: 4, name: "Kopalnia żelaza", level: 1 },
    { id: 5, name: "Tartak", level: 1 },
    { id: 6, name: "Spichlerz", level: 1 },
    { id: 7, name: "Farma", level: 1 },
    { id: 8, name: "Mur Obronny", level: 0 }
  ];

  village.buildings = initialBuildings;
  next();
});

VillageSchema.methods = {
  addBuildingToTheQueue: function(buildingId) {
    const village = this;

    console.log(village.buildings);
    const desiredBuilding = find(
      village.buildings,
      building => buildingId === building.id
    );

    console.log(desiredBuilding);

    const timestamp = Date.now();
    const timeout = 1000 * 60 * 10;

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
