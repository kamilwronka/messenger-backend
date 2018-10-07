const second = 100; // shortened for development
const minute = second * 60;
const hour = minute * 60;

const buildingsConf = {
  1: {
    buildingId: 1,
    name: "Ratusz",
    buildCosts: [
      { clay: 100, iron: 100, wood: 100 },
      { clay: 200, iron: 200, wood: 200 }
    ],
    buildTimes: [minute, minute * 2, minute * 3],
    maxLevel: 3,
    defaultLevel: 1
  },
  2: {
    buildingId: 2,
    name: "Koszary",
    buildCosts: [
      { clay: 100, iron: 100, wood: 100 },
      { clay: 200, iron: 200, wood: 200 }
    ],
    buildTimes: [minute, minute * 2, minute * 3],
    maxLevel: 3,
    defaultLevel: 1
  },
  3: {
    buildingId: 3,
    name: "Cegielnia",
    buildCosts: [
      { clay: 100, iron: 100, wood: 100 },
      { clay: 200, iron: 200, wood: 200 }
    ],
    buildTimes: [minute, minute * 2, minute * 3],
    maxLevel: 3,
    defaultLevel: 1
  },
  4: {
    buildingId: 4,
    name: "Kopalnia żelaza",
    buildCosts: [
      { clay: 100, iron: 100, wood: 100 },
      { clay: 200, iron: 200, wood: 200 }
    ],
    buildTimes: [minute, minute * 2, minute * 3],
    maxLevel: 3,
    defaultLevel: 1
  }
};

const initialBuildings = [
  {
    id: 1,
    name: buildingsConf[1].name,
    level: buildingsConf[1].defaultLevel,
    maxLevel: buildingsConf[1].maxLevel
  },
  {
    id: 2,
    name: buildingsConf[2].name,
    level: buildingsConf[2].defaultLevel,
    maxLevel: buildingsConf[2].maxLevel
  },
  {
    id: 3,
    name: buildingsConf[3].name,
    level: buildingsConf[3].defaultLevel,
    maxLevel: buildingsConf[3].maxLevel
  },
  {
    id: 4,
    name: buildingsConf[4].name,
    level: buildingsConf[4].defaultLevel,
    maxLevel: buildingsConf[4].maxLevel
  }
];
//
// { id: 5, name: "Tartak", level: 1 },
// { id: 6, name: "Spichlerz", level: 1 },
// { id: 7, name: "Farma", level: 1 },
// { id: 8, name: "Mur Obronny", level: 0 }

module.exports = { buildingsConf, initialBuildings };
