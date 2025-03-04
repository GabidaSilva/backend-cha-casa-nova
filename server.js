require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());

// 🔹 Configuração correta do CORS
app.use(cors({
    origin: "https://site-cha-casa-nova.vercel.app",
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
}));

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado!"))
    .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

mongoose.connection.on('connected', () => console.log('Mongoose conectado!'));
mongoose.connection.on('error', (err) => console.error('Erro no MongoDB:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose desconectado.'));

// Modelo de contribuição
const Contribution = mongoose.model("Contribution", new mongoose.Schema({
    giftId: String,
    amount: Number,
    date: { type: Date, default: Date.now }
}));

// 🔹 Rota para registrar uma contribuição
app.post("/api/contribute", async (req, res) => {
    console.log("Recebendo contribuição:", req.body);

    const { giftId, amount } = req.body;
    if (!giftId || !amount || amount < 100) {
        return res.status(400).json({ message: "Valor inválido. Contribuição mínima: R$100,00." });
    }

    try {
        const newContribution = new Contribution({ giftId, amount });
        await newContribution.save();
        res.json({ message: "Contribuição registrada com sucesso!", contribution: newContribution });
    } catch (err) {
        res.status(500).json({ message: "Erro ao registrar a contribuição", error: err.message });
    }
});

// 🔹 Rota para obter total de contribuições
app.get("/api/contributions/:giftId", async (req, res) => {
    try {
        const contributions = await Contribution.find({ giftId: req.params.giftId });
        const total = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
        res.json({ total, contributions });
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar contribuições", error: err.message });
    }
});

// 🔹 Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4000;
app.get("/", (req, res) => {
    res.send("API de Contribuições para Presentes está rodando!");
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
