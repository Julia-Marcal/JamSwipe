const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  music: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Music",
    required: true,
  },
  liked: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("History", HistorySchema);

