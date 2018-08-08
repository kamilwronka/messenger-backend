var express = require("express");
var router = express.Router();

var data = require("./data.json");

router.get("/about", function(req, res) {
  res.send(data);
});

module.exports = router;
