const production = process.env.NODE_ENV === "production";
const devKeys = production ? {} : require("./keys_dev");

console.log(
  process.env.AWS_ACCESS,
  process.env.AWS_SECRET,
  process.env.MONGODB_URI
);

module.exports = {
  AWS_ACCESS: production ? process.env.AWS_ACCESS : devKeys.AWS_ACCESS,
  AWS_SECRET: production ? process.env.AWS_SECRET : devKeys.AWS_SECRET
};
