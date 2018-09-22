const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");

const token = jwt.sign();

var message = "I am asdasd";
var hash = SHA256(message).toString();

console.log(message, hash);
