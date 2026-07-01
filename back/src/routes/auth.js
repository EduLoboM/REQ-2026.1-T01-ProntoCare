const express = require('express');
const bcrypt = require('bcryptjs');
const { gerarToken } = require('../middleware/auth');
const pool = require('../db');

const router = express.Router();

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin';

router.post('/login', async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ erro: 'Login e senha sao obrigatorios.' });
  }

  if (login === ADMIN_USER && senha === ADMIN_PASS) {
    const token = gerarToken({ id: 0, role: 'admin', usuario: ADMIN_USER });
    return res.json({ token, role: 'admin' });
  }

  try {
    const medicosRes = await pool.query('SELECT id, nome, senha_hash, ativo FROM medicos WHERE email = $1', [login]);
    if (medicosRes.rows.length > 0) {
      const medico = medicosRes.rows[0];
      if (!medico.ativo) return res.status(403).json({ erro: 'Conta desativada.' });
      
      const senhaValida = await bcrypt.compare(senha, medico.senha_hash);
      if (senhaValida) {
        const token = gerarToken({ id: medico.id, role: 'medico', nome: medico.nome });
        return res.json({ token, role: 'medico', nome: medico.nome });
      }
      return res.status(401).json({ erro: 'Credenciais invalidas.' });
    }

    const pacientesRes = await pool.query('SELECT id, nome, senha_hash, ativo FROM pacientes WHERE email = $1', [login]);
    if (pacientesRes.rows.length > 0) {
      const paciente = pacientesRes.rows[0];
      if (!paciente.ativo) return res.status(403).json({ erro: 'Conta desativada.' });
      
      const senhaValida = await bcrypt.compare(senha, paciente.senha_hash);
      if (senhaValida) {
        const token = gerarToken({ id: paciente.id, role: 'paciente', nome: paciente.nome });
        return res.json({ token, role: 'paciente', nome: paciente.nome });
      }
      return res.status(401).json({ erro: 'Credenciais invalidas.' });
    }

    return res.status(401).json({ erro: 'Credenciais invalidas.' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
});

module.exports = router;