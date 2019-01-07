const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { pick, isNil } = require("lodash");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const friend = require("../friend/friend.model");
const request = require("../requests/requests.model");

const UserSchema = new Schema({
  online: {
    type: Boolean,
    required: true,
    default: false
  },
  lastOnline: {
    type: Date,
    required: false,
    default: null
  },
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
  avatar: {
    type: String,
    required: false
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User"
    }
  ],
  requests: [request],
  conversations: [
    {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Conversation"
    }
  ],
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

  if (user.isNew) {
    user.friends = [];
    user.conversations = [];
    user.requests = [];
  }

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

UserSchema.index({ "$**": "text" });

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
  deleteRequest: function(request) {
    const user = this;

    console.log(request);

    return user.update({
      $pull: {
        requests: request
      }
    });
  },
  addToFriends: function(id) {
    const user = this;

    user.friends.push(id);
    return user.save().then(user => {
      return user.friends;
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
      "friends",
      "avatar"
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
