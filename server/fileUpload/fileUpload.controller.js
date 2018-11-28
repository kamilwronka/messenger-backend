const AWS = require("aws-sdk");
const uuid = require("uuid/v1");

const requireAuth = require("../middleware/requireAuth");
const keys = require("../../config/keys");

const S3 = new AWS.S3({
  accessKeyId: keys.AWS_ACCESS,
  secretAccessKey: keys.AWS_SECRET
});

module.exports = app => {
  app.get("/api/upload", requireAuth, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    S3.getSignedUrl(
      "putObject",
      {
        Bucket: "messenger-dev-bucket",
        ContentType: "jpeg",
        Key: key
      },
      (err, url) => {
        res.send({ key, url });
      }
    );
  });
};
