const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { pick } = require("lodash");

const UserSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 1
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  tokens: [
    {
      token: String,
      createdAt: Number
    }
  ],
  mail: {
    type: String,
    unique: true,
    required: true,
    minlength: 5
  }
});

UserSchema.pre("save", function(next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else next();
});

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  return pick(userObject, ["_id", "login"]);
};

UserSchema.methods.generateAuthToken = async function() {
  const user = this;

  const createdAt = new Date().getTime();
  const token = jwt
    .sign(
      { sub: user.id, createdAt },
      "asda1231sda8sd7a87sa78sda8987dsa8da798sad8s7da88u7vucgj78"
    )
    .toString();

  user.tokens = user.tokens.concat([{ createdAt, token }]);

  return user.save().then(() => token);
};

UserSchema.statics.findByCredentials = async function(login, password) {
  const User = this;
  const user = await User.findOne({ login });
  if (!user) return Promise.reject();

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, res) => {
      if (err) return reject();
      return res ? resolve(user) : reject();
    });
  });
};

module.exports = mongoose.model("user", UserSchema);
