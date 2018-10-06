const { pick, isNil } = require("lodash");
const requireAuth = require("../middleware/requireAuth");
const VillageModel = require("./village.model");

module.exports = app => {
  app.get("/api/villages/:ownerId", requireAuth, (req, res) => {
    const ownerId = req.params.ownerId;

    VillageModel.findByOwnerId(ownerId)
      .then(villages => {
        res.send(villages);
      })
      .catch(err => res.send(err));
  });

  app.get("/api/villages/details/:id", requireAuth, (req, res) => {
    const id = req.params.id;
    VillageModel.findById(id, (err, village) => {
      if (!isNil(err)) {
        res.status(404).send(err);
        return Promise.reject();
      }
      res.status(200).send(village);
      return Promise.resolve();
    }).catch(err => res.send(err));
  });

  app.post("/api/villages", (req, res) => {
    const body = pick(req.body, [
      "name",
      "ownerId",
      "positionX",
      "positionY",
      "buildings",
      "rawMaterials"
    ]);
    const village = new VillageModel(body);

    village
      .save()
      .then(village => {
        return res.status(200).send(village);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });

  app.post("/api/villages/:id/upgrade", requireAuth, (req, res) => {
    const body = pick(req.body, ["buildingId", "buildingName"]);

    VillageModel.findById(req.params.id, (err, village) => {
      if (!isNil(err)) {
        res.status(404).send(err);
        return Promise.reject();
      }
      village
        .addBuildingToTheQueue(body.buildingId)
        .then(() => {
          VillageModel.findById(req.params.id, (err, village) => {
            return res.status(200).send(village);
          }).catch(err => res.send(err));
        })
        .catch(err => res.send(err));
      return Promise.resolve();
    }).catch(err => {
      console.log(err);
    });
  });

  app.delete("/api/worlds/:id", (req, res) => {
    const id = req.params.id;
  });
};
