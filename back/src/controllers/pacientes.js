const pool = require('../db');
const bcrypt = require('bcryptjs');
const { registrarAcao, registrarEdicao } = require('../helpers/auditoria');

const SALT_ROUNDS = 10;

// Campos rastreáveis do paciente (excluindo criado_em, atualizado_em, id, medico_id)
const CAMPOS_RASTREAVEIS = ['nome', 'cpf', 'data_nascimento', 'sexo', 'nome_mae', 'email', 'telefone', 'cep', 'numero', 'ativo', 'senha_hash'];

async function listar(req, res) {
  try {
    const { nome, cpf } = req.query;
    const hoje = new Date();
    const limiteAno = hoje.getFullYear() - 20;
    const limiteData = new Date(limiteAno, hoje.getMonth(), hoje.getDate());

    let params = [limiteData];
    let paramIndex = 2;

    let query = `SELECT id, nome, cpf, data_nascimento, sexo, nome_mae, email, telefone, cep, numero, medico_id, ativo, criado_em, atualizado_em,
                        (
                          NOT EXISTS (SELECT 1 FROM atendimentos WHERE paciente_id = pacientes.id AND criado_em > $1)
                          AND NOT EXISTS (SELECT 1 FROM anamneses WHERE paciente_id = pacientes.id AND criado_em > $1)
                        ) AS pode_excluir
                 FROM pacientes WHERE 1=1`;

    if (req.user.role !== 'admin') {
      query += ` AND medico_id = $${paramIndex++}`;
      params.push(req.user.id);
    }

    if (nome) {
      query += ` AND nome ILIKE $${paramIndex++}`;
      params.push(`%${nome}%`);
    }

    if (cpf) {
      query += ` AND cpf = $${paramIndex++}`;
      params.push(cpf);
    }

    query += ` ORDER BY nome`;

    const { rows } = await pool.query(query, params);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function buscarPorId(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(`SELECT id, nome, cpf, data_nascimento, sexo, nome_mae, email, telefone, cep, numero, medico_id, ativo, criado_em, atualizado_em FROM pacientes WHERE id = $1`, [id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Nao encontrado.' });
    const paciente = rows[0];
    if (req.user.role === 'medico' && paciente.medico_id !== req.user.id) return res.status(403).json({ erro: 'Acesso negado.' });
    
    // Registra a visualização no log de auditoria (Conformidade CFM / SBIS)
    await registrarAcao({
      paciente_id: paciente.id,
      entidade: 'paciente',
      entidade_id: paciente.id,
      acao: 'visualizacao',
      usuario: req.user,
      req
    });

    return res.json(paciente);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function criar(req, res) {
  const { nome, nomeCompleto, cpf, data_nascimento, dataNascimento, sexo, nomeMae, email, telefone, cep, numero, senha } = req.body;
  const nomeFinal = nomeCompleto || nome;
  const dataNascFinal = dataNascimento || data_nascimento;

  if (!nomeFinal || !cpf || !email || !senha) return res.status(400).json({ erro: 'Campos obrigatorios.' });

  try {
    const senha_hash = await bcrypt.hash(senha, SALT_ROUNDS);
    const medicoId = req.user && req.user.role === 'medico' ? req.user.id : null;
    const { rows } = await pool.query(
      `INSERT INTO pacientes (nome, cpf, data_nascimento, sexo, nome_mae, email, telefone, cep, numero, senha_hash, medico_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, nome, cpf, data_nascimento, sexo, nome_mae, email, telefone, cep, numero, medico_id, ativo, criado_em`,
      [nomeFinal, cpf, dataNascFinal || null, sexo || null, nomeMae || null, email, telefone || null, cep || null, numero || null, senha_hash, medicoId]
    );

    // Registra a criação no log de auditoria
    await registrarAcao({
      paciente_id: rows[0].id,
      entidade: 'paciente',
      entidade_id: rows[0].id,
      acao: 'criacao',
      usuario: req.user,
      req
    });

    return res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ erro: 'Ja cadastrado.' });
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { nome, nomeCompleto, cpf, data_nascimento, dataNascimento, sexo, nomeMae, email, telefone, cep, numero, senha, ativo } = req.body;
  const nomeFinal = nomeCompleto || nome;
  const dataNascFinal = dataNascimento || data_nascimento;

  try {
    // Busca o snapshot completo ANTES da edição para comparação
    const existe = await pool.query('SELECT id, medico_id, nome, cpf, data_nascimento, sexo, nome_mae, email, telefone, cep, numero, ativo, senha_hash FROM pacientes WHERE id = $1', [id]);
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Nao encontrado.' });
    const antes = existe.rows[0];
    if (req.user.role === 'medico' && antes.medico_id !== req.user.id) return res.status(403).json({ erro: 'Acesso negado.' });

    const campos = [];
    const valores = [];
    let idx = 1;

    if (nomeFinal !== undefined) { campos.push(`nome = $${idx++}`); valores.push(nomeFinal); }
    if (cpf !== undefined) { campos.push(`cpf = $${idx++}`); valores.push(cpf); }
    if (dataNascFinal !== undefined) { campos.push(`data_nascimento = $${idx++}`); valores.push(dataNascFinal); }
    if (sexo !== undefined) { campos.push(`sexo = $${idx++}`); valores.push(sexo); }
    if (nomeMae !== undefined) { campos.push(`nome_mae = $${idx++}`); valores.push(nomeMae); }
    if (email !== undefined) { campos.push(`email = $${idx++}`); valores.push(email); }
    if (telefone !== undefined) { campos.push(`telefone = $${idx++}`); valores.push(telefone); }
    if (cep !== undefined) { campos.push(`cep = $${idx++}`); valores.push(cep); }
    if (numero !== undefined) { campos.push(`numero = $${idx++}`); valores.push(numero); }
    if (ativo !== undefined) { campos.push(`ativo = $${idx++}`); valores.push(ativo); }
    if (senha) {
      const senha_hash = await bcrypt.hash(senha, SALT_ROUNDS);
      campos.push(`senha_hash = $${idx++}`);
      valores.push(senha_hash);
    }

    if (campos.length === 0) return res.status(400).json({ erro: 'Sem campos.' });

    valores.push(id);
    const { rows } = await pool.query(
      `UPDATE pacientes SET ${campos.join(', ')} WHERE id = $${idx} RETURNING id, nome, cpf, data_nascimento, sexo, nome_mae, email, telefone, cep, numero, medico_id, ativo, atualizado_em, senha_hash`,
      valores
    );
    const depois = rows[0];

    // Registra cada campo alterado no log de auditoria
    await registrarEdicao({
      paciente_id: parseInt(id),
      entidade: 'paciente',
      entidade_id: parseInt(id),
      antes,
      depois,
      campos: CAMPOS_RASTREAVEIS,
      usuario: req.user,
      req
    });

    // Remove senha_hash do retorno
    delete depois.senha_hash;
    return res.json(depois);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ erro: 'Ja em uso.' });
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function excluir(req, res) {
  const { id } = req.params;
  try {
    const existe = await pool.query('SELECT id, medico_id FROM pacientes WHERE id = $1', [id]);
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Nao encontrado.' });
    const paciente = existe.rows[0];
    if (req.user.role === 'medico' && paciente.medico_id !== req.user.id) return res.status(403).json({ erro: 'Acesso negado.' });

    const { rows } = await pool.query(`UPDATE pacientes SET ativo = false WHERE id = $1 RETURNING id, nome, ativo`, [id]);

    // Registra a desativação no log
    await registrarAcao({
      paciente_id: parseInt(id),
      entidade: 'paciente',
      entidade_id: parseInt(id),
      acao: 'desativacao',
      usuario: req.user,
      req
    });

    return res.json({ mensagem: 'Desativado.', paciente: rows[0] });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function minhasConta(req, res) {
  try {
    const { rows } = await pool.query(`SELECT id, nome, cpf, data_nascimento, sexo, nome_mae, email, telefone, cep, numero, medico_id, ativo, criado_em, atualizado_em FROM pacientes WHERE id = $1`, [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Nao encontrado.' });
    
    // Registra a visualização do paciente ao próprio prontuário
    await registrarAcao({
      paciente_id: req.user.id,
      entidade: 'paciente',
      entidade_id: req.user.id,
      acao: 'visualizacao',
      usuario: req.user,
      req
    });

    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function solicitarExclusao(req, res) {
  try {
    const { rows } = await pool.query(`UPDATE pacientes SET ativo = false WHERE id = $1 RETURNING id, nome`, [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Nao encontrado.' });
    return res.json({ mensagem: 'Desativado.', paciente: rows[0] });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function exportarDados(req, res) {
  try {
    const { rows } = await pool.query(`SELECT id, nome, cpf, data_nascimento, sexo, nome_mae, email, telefone, cep, numero, criado_em, atualizado_em FROM pacientes WHERE id = $1`, [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Nao encontrado.' });

    res.setHeader('Content-Disposition', `attachment; filename="meus_dados_${req.user.id}.json"`);
    res.setHeader('Content-Type', 'application/json');
    return res.json({ exportado_em: new Date().toISOString(), dados: rows[0] });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function exportarTodos(req, res) {
  try {
    let query = `SELECT id, nome, cpf, data_nascimento, sexo, nome_mae, email, telefone, cep, numero, medico_id, ativo, criado_em, atualizado_em FROM pacientes WHERE 1=1`;
    let params = [];
    let paramIndex = 1;

    // Se não for admin, exporta apenas os pacientes vinculados ao médico
    if (req.user.role !== 'admin') {
      query += ` AND medico_id = $${paramIndex++}`;
      params.push(req.user.id);
    }

    const { rows } = await pool.query(query, params);

    res.setHeader('Content-Disposition', `attachment; filename="exportacao_pacientes_${new Date().getTime()}.json"`);
    res.setHeader('Content-Type', 'application/json');
    return res.json({ exportado_em: new Date().toISOString(), total: rows.length, dados: rows });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function excluirPermanente(req, res) {
  const { id } = req.params;
  try {
    const existe = await pool.query('SELECT id, medico_id FROM pacientes WHERE id = $1', [id]);
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Paciente não encontrado.' });
    
    // Se for médico, garante que só exclui pacientes vinculados a ele
    if (req.user.role === 'medico' && existe.rows[0].medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    // Limite de 20 anos
    const hoje = new Date();
    const limiteAno = hoje.getFullYear() - 20;
    const limiteData = new Date(limiteAno, hoje.getMonth(), hoje.getDate());

    // Check atendimentos of the patient
    const atendimentosRecentes = await pool.query(
      `SELECT id FROM atendimentos WHERE paciente_id = $1 AND criado_em > $2 LIMIT 1`,
      [id, limiteData]
    );

    // Check anamneses of the patient
    const anamnesesRecentes = await pool.query(
      `SELECT id FROM anamneses WHERE paciente_id = $1 AND criado_em > $2 LIMIT 1`,
      [id, limiteData]
    );

    if (atendimentosRecentes.rows.length > 0 || anamnesesRecentes.rows.length > 0) {
      return res.status(403).json({ erro: 'Não é possível excluir permanentemente o paciente. Existem documentos clínicos com menos de 20 anos.' });
    }

    // Deleta o paciente permanentemente (ON DELETE CASCADE cuidará dos atendimentos, anamneses e logs em cascata)
    await pool.query('DELETE FROM pacientes WHERE id = $1', [id]);

    return res.json({ mensagem: 'Paciente e seus registros associados foram excluídos permanentemente.' });
  } catch (err) {
    console.error('Erro ao excluir paciente permanentemente:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, minhasConta, solicitarExclusao, exportarDados, exportarTodos, excluirPermanente };