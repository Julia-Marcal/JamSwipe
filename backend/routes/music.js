const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Music = require("../models/Music");

// Rota para adicionar uma nova música (apenas para testes/admin)
router.post("/", auth, async (req, res) => {
  const { title, artist, albumCover, previewUrl } = req.body;

  try {
    const newMusic = new Music({
      title,
      artist,
      albumCover,
      previewUrl,
    });

    const music = await newMusic.save();
    res.json(music);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no Servidor");
  }
});

// Rota para obter uma música aleatória para swipe
router.get("/random", auth, async (req, res) => {
  try {
    const count = await Music.countDocuments();
    const random = Math.floor(Math.random() * count);
    const music = await Music.findOne().skip(random);
    res.json(music);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no Servidor");
  }
});

module.exports = router;




// Rota temporária para popular o banco de dados com músicas de exemplo
router.post("/seed", async (req, res) => {
  try {
    const sampleMusics = [
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        albumCover: "https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        title: "Shape of You",
        artist: "Ed Sheeran",
        albumCover: "https://upload.wikimedia.org/wikipedia/en/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        title: "Dance Monkey",
        artist: "Tones and I",
        albumCover: "https://upload.wikimedia.org/wikipedia/en/f/f5/Tones_and_I_-_Dance_Monkey.png",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        title: "Bad Guy",
        artist: "Billie Eilish",
        albumCover: "https://upload.wikimedia.org/wikipedia/en/4/47/Billie_Eilish_-_Bad_Guy.png",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        title: "Uptown Funk",
        artist: "Mark Ronson ft. Bruno Mars",
        albumCover: "https://upload.wikimedia.org/wikipedia/en/0/0f/Mark_Ronson_feat._Bruno_Mars_-_Uptown_Funk_%28Official_Single_Cover%29.png",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
    ];

    await Music.deleteMany({}); // Limpa músicas existentes para evitar duplicatas
    await Music.insertMany(sampleMusics);
    res.status(200).json({ msg: "Músicas de exemplo adicionadas com sucesso!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao adicionar músicas de exemplo");
  }
});

