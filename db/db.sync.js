const VillageModel = require("../server/village/village.model");

const syncDatabase = async () => {
  VillageModel.find({
    "buildsInProggress.end": {
      $lt: Date.now()
    }
  }).then(villages => {
    villages.map(village => {
      let upgradedBuildings = [];
      village.buildsInProggress = village
        .toObject()
        .buildsInProggress.filter(elem => {
          if (elem.end < Date.now()) {
            upgradedBuildings.push(elem);
          }
          return elem.end > Date.now();
        });

      village.buildings = village.toObject().buildings.map(elem => {
        upgradedBuildings.map(upgraded => {
          console.log(upgraded, elem);
          if (upgraded.buildingId === elem.id) {
            elem.level = upgraded.toLevel;
            return elem;
          } else {
            return elem;
          }
        });
        return elem;
      });
      return village.save();
    });
  });
};

module.exports = () => {
  setInterval(syncDatabase, 5000);
};
