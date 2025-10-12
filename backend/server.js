require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const cors = require("cors");

app.use(cors());
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Conexão com o Banco de Dados
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch(err => console.error('Erro de conexão com MongoDB:', err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/music", require("./routes/music"));
app.use("/api/history", require("./routes/history"));



// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

