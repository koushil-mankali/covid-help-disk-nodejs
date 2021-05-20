const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let States = new Schema({
  states: {
    type: [{}],
    required: true,
  },
});

module.exports = mongoose.model("states", States);
