const pool = require('../db');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

async function listar(req, res) {
  try {
    const hoje = new Date();
    const limiteAno = hoje.getFullYear() - 20;
    const limiteData = new Date(limiteAno, hoje.getMonth(), hoje.getDate());

    const { rows } = await pool.query(
      `SELECT id, nome, crm, especialidade, email, ativo, criado_em, atualizado_em,
              (
                NOT EXISTS (
                  SELECT 1 FROM atendimentos 
                  WHERE (medico_id = medicos.id OR paciente_id IN (SELECT id FROM pacientes WHERE medico_id = medicos.id)) 
                    AND criado_em > $1
                ) AND NOT EXISTS (
                  SELECT 1 FROM anamneses 
                  WHERE (medico_id = medicos.id OR paciente_id IN (SELECT id FROM pacientes WHERE medico_id = medicos.id)) 
                    AND criado_em > $1
                )
              ) AS pode_excluir
       FROM medicos 
       ORDER BY nome`,
      [limiteData]
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar.' });
  }
}

async function buscarPorId(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT id, nome, crm, especialidade, email, ativo, criado_em, atualizado_em FROM medicos WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ erro: 'Nao encontrado.' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function criar(req, res) {
  const { nome, crm, especialidade, email, senha } = req.body;
  if (!nome || !crm || !email || !senha) return res.status(400).json({ erro: 'Campos obrigatorios.' });

  try {
    const senha_hash = await bcrypt.hash(senha, SALT_ROUNDS);
    const { rows } = await pool.query(
      `INSERT INTO medicos (nome, crm, especialidade, email, senha_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, crm, especialidade, email, ativo, criado_em`,
      [nome, crm, especialidade || null, email, senha_hash]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ erro: 'Ja cadastrado.' });
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { nome, crm, especialidade, email, senha, ativo } = req.body;

  try {
    const existe = await pool.query('SELECT id FROM medicos WHERE id = $1', [id]);
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Nao encontrado.' });

    const campos = [];
    const valores = [];
    let idx = 1;

    if (nome !== undefined) { campos.push(`nome = $${idx++}`); valores.push(nome); }
    if (crm !== undefined) { campos.push(`crm = $${idx++}`); valores.push(crm); }
    if (especialidade !== undefined) { campos.push(`especialidade = $${idx++}`); valores.push(especialidade); }
    if (email !== undefined) { campos.push(`email = $${idx++}`); valores.push(email); }
    if (ativo !== undefined) { campos.push(`ativo = $${idx++}`); valores.push(ativo); }
    if (senha) {
      const senha_hash = await bcrypt.hash(senha, SALT_ROUNDS);
      campos.push(`senha_hash = $${idx++}`);
      valores.push(senha_hash);
    }

    if (campos.length === 0) return res.status(400).json({ erro: 'Sem campos.' });

    valores.push(id);
    const { rows } = await pool.query(
      `UPDATE medicos SET ${campos.join(', ')} WHERE id = $${idx} RETURNING id, nome, crm, especialidade, email, ativo, atualizado_em`,
      valores
    );
    return res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ erro: 'Ja em uso.' });
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function excluir(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(`UPDATE medicos SET ativo = false WHERE id = $1 RETURNING id, nome, ativo`, [id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Nao encontrado.' });
    return res.json({ mensagem: 'Desativado.', medico: rows[0] });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function excluirPermanente(req, res) {
  const { id } = req.params;
  try {
    const existe = await pool.query('SELECT id FROM medicos WHERE id = $1', [id]);
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Médico não encontrado.' });

    // Limite de 20 anos
    const hoje = new Date();
    const limiteAno = hoje.getFullYear() - 20;
    const limiteData = new Date(limiteAno, hoje.getMonth(), hoje.getDate());

    // Check atendimentos of the doctor or their patients
    const atendimentosRecentes = await pool.query(
      `SELECT id FROM atendimentos 
       WHERE (medico_id = $1 OR paciente_id IN (SELECT id FROM pacientes WHERE medico_id = $1))
         AND criado_em > $2 LIMIT 1`,
      [id, limiteData]
    );

    // Check anamneses of the doctor or their patients
    const anamnesesRecentes = await pool.query(
      `SELECT id FROM anamneses 
       WHERE (medico_id = $1 OR paciente_id IN (SELECT id FROM pacientes WHERE medico_id = $1))
         AND criado_em > $2 LIMIT 1`,
      [id, limiteData]
    );

    if (atendimentosRecentes.rows.length > 0 || anamnesesRecentes.rows.length > 0) {
      return res.status(403).json({ erro: 'Não é possível excluir permanentemente o médico. Existem documentos clínicos de seus pacientes com menos de 20 anos.' });
    }

    // Primeiro deletamos os pacientes vinculados ao médico (o que deletará em cascata seus atendimentos, anamneses e logs)
    await pool.query('DELETE FROM pacientes WHERE medico_id = $1', [id]);

    // Deletamos o médico permanentemente
    await pool.query('DELETE FROM medicos WHERE id = $1', [id]);

    return res.json({ mensagem: 'Médico e seus registros associados foram excluídos permanentemente.' });
  } catch (err) {
    console.error('Erro ao excluir médico permanentemente:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function buscarDetalhes(req, res) {
  const { id } = req.params;
  try {
    const doctorQuery = await pool.query(
      `SELECT id, nome, crm, especialidade, email, ativo, criado_em FROM medicos WHERE id = $1`,
      [id]
    );
    if (doctorQuery.rows.length === 0) return res.status(404).json({ erro: 'Médico não encontrado.' });
    const doctor = doctorQuery.rows[0];

    const patientsQuery = await pool.query(
      `SELECT id, nome, cpf, ativo FROM pacientes WHERE medico_id = $1 ORDER BY nome`,
      [id]
    );

    const statsQuery = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM pacientes WHERE medico_id = $1) as total_pacientes,
        (SELECT COUNT(*) FROM atendimentos WHERE medico_id = $1) as total_atendimentos,
        (SELECT COUNT(*) FROM anamneses WHERE medico_id = $1) as total_anamneses`,
      [id]
    );

    return res.json({
      medico: doctor,
      pacientes: patientsQuery.rows,
      stats: statsQuery.rows[0]
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, excluirPermanente, buscarDetalhes };