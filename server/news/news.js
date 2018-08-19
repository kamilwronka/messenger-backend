var express = require("express");
var router = express.Router();

var data = require("./data.json");

router.get("/", function(req, res) {
  res.send(data);
});

module.exports = router;
