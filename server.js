require('dotenv').config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'https://site-cha-casa-nova.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Conexão com o MongoDB (removendo opções descontinuadas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado!"))
  .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

// Adiciona logs detalhados para depuração
mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado com sucesso!');
});

mongoose.connection.on('error', (err) => {
  console.error('Erro de conexão com o MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado.');
});


// Modelo de contribuição
const Contribution = mongoose.model("Contribution", new mongoose.Schema({
  giftId: String,
  amount: Number,
  date: { type: Date, default: Date.now }
}));

// Rota para registrar uma contribuição
app.post("/api/contribute", async (req, res) => {
  const { giftId, amount } = req.body;
  if (!giftId || !amount || amount < 100) {
    return res.status(400).json({ message: "Dados inválidos. A contribuição mínima é de R$100,00." });
  }

  try {
    const newContribution = new Contribution({ giftId, amount });
    await newContribution.save();
    res.json({ message: "Contribuição registrada com sucesso!", contribution: newContribution });
  } catch (err) {
    res.status(500).json({ message: "Erro ao registrar a contribuição", error: err.message });
  }
});

// Rota para obter o total de contribuições de um presente
app.get("/api/contributions/:giftId", async (req, res) => {
  try {
    const contributions = await Contribution.find({ giftId: req.params.giftId });
    const total = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
    res.json({ total, contributions });
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar contribuições", error: err.message });
  }
});

// Servir arquivos estáticos (para imagens, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
