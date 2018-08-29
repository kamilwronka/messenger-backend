var data = require("./data.json");

module.exports = (app) => {
  app.get('/news', (req, res) => res.send(data))
}
