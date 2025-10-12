const mongoose = require("mongoose");

const MusicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  albumCover: {
    type: String, // URL da capa do álbum
    required: true,
  },
  previewUrl: {
    type: String, // URL do trecho da música
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Music", MusicSchema);

