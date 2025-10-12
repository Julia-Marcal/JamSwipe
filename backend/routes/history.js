const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const History = require("../models/History");

// Rota para registrar uma interação (curtir/não curtir)
router.post("/", auth, async (req, res) => {
  const { musicId, liked } = req.body;

  try {
    const newHistory = new History({
      user: req.user.id,
      music: musicId,
      liked,
    });

    const history = await newHistory.save();
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no Servidor");
  }
});

// Rota para obter o histórico de interações do usuário
router.get("/", auth, async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id }).populate("music");
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no Servidor");
  }
});

module.exports = router;

