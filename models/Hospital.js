const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Hospital = new Schema({
  hospitalName: {
    type: String,
  },
  address: {
    state: {
      type: String,
    },
    district: {
      type: String,
    },
    street: {
      type: String,
    },
  },
  contacts: {
    type: Number,
  },
  totalBeds: {
    type: Number,
  },
  avaliableBeds: {
    type: Number,
  },
  occupiedBeds: {
    type: Number,
  },
  oxy: {
    type: Number,
  },
  oxygen: {
    type: String,
  },
  type: {
    type: String,
  },
  medicineDetails: {
    type: {},
  },
});

module.exports = mongoose.model("hospitals", Hospital);
