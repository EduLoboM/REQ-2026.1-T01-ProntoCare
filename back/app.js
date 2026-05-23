const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const medicosRoutes = require('./src/routes/medicos');
const pacientesRoutes = require('./src/routes/pacientes');
const atendimentosRoutes = require('./src/routes/atendimentos');
const anamnesesRoutes = require('./src/routes/anamneses');
const logsRoutes = require('./src/routes/logs');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/medicos', medicosRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/atendimentos', atendimentosRoutes);
app.use('/api/anamneses', anamnesesRoutes);
app.use('/api/logs', logsRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Nao encontrada.' });
});

module.exports = app;