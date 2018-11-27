const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { pick, isNil } = require("lodash");
const bcrypt = require("bcryptjs");

const conversation = require("../conversation/conversation.model");
const friend = require("../friend/friend.model");
const request = require("../requests/requests.model");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  conversations: [conversation],
  friends: [friend],
  requests: [request],
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

UserSchema.pre("save", function(next) {
  const user = this;

  console.log(user.isNew);

  if (user.isNew) {
    user.friends = [];
    user.conversations = [];
    user.requests = [];
  }

  console.log(user);

  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods = {
  generateAuthToken: function() {
    const user = this;
    const access = "auth";
    const token = jwt
      .sign({ _id: user._id.toHexString(), access }, "secret")
      .toString();

    user.tokens.push({
      access,
      token
    });

    return user.save().then(() => {
      return token;
    });
  },
  removeToken: function(token) {
    const user = this;

    return user.update({
      $pull: {
        tokens: {
          token
        }
      }
    });
  },
  toJSON: function() {
    const user = this;
    const userObject = user.toObject();

    return pick(userObject, [
      "_id",
      "email",
      "username",
      "conversations",
      "requests",
      "friends"
    ]);
  }
};

UserSchema.statics = {
  findByToken: function(token) {
    const User = this;

    let decoded;

    try {
      decoded = jwt.verify(token, "secret");
    } catch (err) {
      return new Promise((resolve, reject) => reject());
    }

    return User.findOne({
      _id: decoded._id,
      "tokens.token": token,
      "tokens.access": "auth"
    });
  },
  findByCredencials: function(email, password) {
    const User = this;

    return User.findOne({ email }).then(user => {
      if (isNil(user)) {
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject(err);
          }
        });
      });
    });
  }
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
