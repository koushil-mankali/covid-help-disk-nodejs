const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Auth = new Schema(
  {
    hospitalName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
    userPhone: {
      type: Number,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("auth", Auth);
