require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por janela
});
app.use(limiter);

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado!"))
  .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

// Modelo de contribuição
const Contribution = mongoose.model("Contribution", new mongoose.Schema({
  giftId: { type: String, required: true },
  amount: { type: Number, required: true, min: 100 },
  date: { type: Date, default: Date.now }
}));

// Rotas
app.post("/api/contribute", async (req, res, next) => {
  try {
    const { giftId, amount } = req.body;
    if (!giftId || !amount || amount < 100) {
      return res.status(400).json({ message: "Dados inválidos. A contribuição mínima é de R$100,00." });
    }

    const newContribution = new Contribution({ giftId, amount });
    await newContribution.save();
    res.json({ message: "Contribuição registrada com sucesso!", contribution: newContribution });
  } catch (err) {
    next(err);
  }
});

app.get("/api/contributions/:giftId", async (req, res, next) => {
  try {
    const contributions = await Contribution.find({ giftId: req.params.giftId });
    const total = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
    res.json({ total, contributions });
  } catch (err) {
    next(err);
  }
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.send("API de Contribuições para Presentes está rodando!");
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erro interno do servidor", error: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
