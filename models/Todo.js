const mongoose = require("mongoose");
const User = require("./User");
const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = new mongoose.model("Todo", TodoSchema);
