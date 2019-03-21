const AWS = require("aws-sdk");
const uuid = require("uuid/v1");

const requireAuth = require("../middleware/requireAuth");
const keys = require("../../config/keys");

const S3 = new AWS.S3({
  region: "eu-central-1",
  signatureVersion: "v4",
  accessKeyId: keys.AWS_ACCESS,
  secretAccessKey: keys.AWS_SECRET
});

module.exports = app => {
  app.get("/api/upload", requireAuth, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpg`;

    S3.getSignedUrl(
      "putObject",
      {
        Bucket: "messenger-dev-bucket",
        ContentType: "image/jpeg",
        Key: key
      },
      (err, url) => {
        res.send({ key, url });
      }
    );
  });

  app.get("/api/upload/video", requireAuth, (req, res) => {
    const key = `${req.user.id}/${uuid()}.mp4`;

    S3.getSignedUrl(
      "putObject",
      {
        Bucket: "messenger-dev-bucket",
        ContentType: "video/mp4",
        Key: key
      },
      (err, url) => {
        res.send({ key, url });
      }
    );
  });
};
