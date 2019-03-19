const production = process.env.NODE_ENV === "production";
const devKeys = require("./keys_dev");

module.exports = {
  AWS_ACCESS: production ? process.env.AWS_ACCESS : devKeys.AWS_ACCESS,
  AWS_SECRET: production ? process.env.AWS_SECRET : devKeys.AWS_SECRET
};
