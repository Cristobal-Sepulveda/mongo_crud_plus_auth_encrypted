const mongooose = require("mongoose");

const Users = mongooose.model("USER", {
  email: {
    type: String,
    required: true,
    minLength: 5,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
});

module.exports = Users;
