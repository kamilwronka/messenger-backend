const { pick } = require("lodash");
const WorldSchema = require("./worlds.model");

module.exports = app => {
  app.get("/api/worlds", (req, res) => {
    WorldSchema.find().then(worlds => {
      res.send(worlds);
    });
  });

  app.post("/api/worlds", (req, res) => {
    const body = pick(req.body, ["name"]);
    const world = new WorldSchema(body);

    world
      .save()
      .then(world => {
        return res.status(200).send(world);
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });
  app.delete("/api/worlds/:id", (req, res) => {
    const id = req.params.id;
  });
};
