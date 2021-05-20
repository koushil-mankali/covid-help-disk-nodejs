const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Admin = new Schema(
  {
    hospitalName: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    stateName: {
      type: String,
      required: true,
    },
    districtName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", Admin);
