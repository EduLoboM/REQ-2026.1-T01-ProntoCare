const pool = require('../db');
const { registrarAcao, registrarEdicao } = require('../helpers/auditoria');

const CAMPOS_RASTREAVEIS = ['conteudo'];

/**
 * Cria uma nova anamnese.
 * Apenas médicos autenticados podem criar anamneses.
 */
async function criar(req, res) {
  const { paciente_id, conteudo } = req.body;

  if (!paciente_id) return res.status(400).json({ erro: 'paciente_id obrigatório.' });
  if (!conteudo || !conteudo.trim()) {
    return res.status(400).json({ erro: 'Preencha o conteúdo da anamnese.' });
  }

  try {
    // Verifica se o paciente existe e pertence ao médico logado
    const paciente = await pool.query('SELECT id, medico_id FROM pacientes WHERE id = $1', [paciente_id]);
    if (paciente.rows.length === 0) return res.status(404).json({ erro: 'Paciente não encontrado.' });
    if (req.user.role === 'medico' && paciente.rows[0].medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    const { rows } = await pool.query(
      `INSERT INTO anamneses (paciente_id, medico_id, conteudo)
       VALUES ($1, $2, $3)
       RETURNING id, paciente_id, medico_id, conteudo, criado_em`,
      [paciente_id, req.user.id, conteudo]
    );

    // Registra a criação no log de auditoria
    await registrarAcao({
      paciente_id: parseInt(paciente_id),
      entidade: 'anamnese',
      entidade_id: rows[0].id,
      acao: 'criacao',
      usuario: req.user
    });

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erro ao criar anamnese:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Lista todas as anamneses do médico logado.
 */
async function listar(req, res) {
  try {
    const { paciente_id } = req.query;

    let query = `
      SELECT a.id, a.paciente_id, a.medico_id, a.conteudo, a.criado_em, a.atualizado_em,
             p.nome AS paciente_nome,
             m.nome AS medico_nome
      FROM anamneses a
      JOIN pacientes p ON a.paciente_id = p.id
      JOIN medicos m ON a.medico_id = m.id
      WHERE 1=1
    `;
    let params = [];
    let paramIndex = 1;

    if (req.user.role === 'medico') {
      query += ` AND a.medico_id = $${paramIndex++}`;
      params.push(req.user.id);
    }

    if (paciente_id) {
      query += ` AND a.paciente_id = $${paramIndex++}`;
      params.push(paciente_id);
    }

    query += ` ORDER BY a.criado_em DESC`;

    const { rows } = await pool.query(query, params);
    return res.json(rows);
  } catch (err) {
    console.error('Erro ao listar anamneses:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Busca uma anamnese específica por ID.
 */
async function buscarPorId(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.paciente_id, a.medico_id, a.conteudo, a.criado_em, a.atualizado_em,
              p.nome AS paciente_nome, p.cpf AS paciente_cpf,
              p.data_nascimento AS paciente_nascimento, p.sexo AS paciente_sexo,
              m.nome AS medico_nome
       FROM anamneses a
       JOIN pacientes p ON a.paciente_id = p.id
       JOIN medicos m ON a.medico_id = m.id
       WHERE a.id = $1`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ erro: 'Anamnese não encontrada.' });

    const anamnese = rows[0];
    if (req.user.role === 'medico' && anamnese.medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    return res.json(anamnese);
  } catch (err) {
    console.error('Erro ao buscar anamnese:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Retorna o histórico de anamneses de um paciente específico.
 */
async function historicoPaciente(req, res) {
  const { pacienteId } = req.params;
  try {
    if (req.user.role === 'medico') {
      const paciente = await pool.query('SELECT id, medico_id FROM pacientes WHERE id = $1', [pacienteId]);
      if (paciente.rows.length === 0) return res.status(404).json({ erro: 'Paciente não encontrado.' });
      if (paciente.rows[0].medico_id !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado.' });
      }
    } else if (req.user.role === 'paciente') {
      if (parseInt(pacienteId) !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado.' });
      }
    }

    const { rows } = await pool.query(
      `SELECT a.id, a.conteudo, a.criado_em, a.atualizado_em,
              m.nome AS medico_nome
       FROM anamneses a
       JOIN medicos m ON a.medico_id = m.id
       WHERE a.paciente_id = $1
       ORDER BY a.criado_em DESC`,
      [pacienteId]
    );

    return res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar histórico de anamneses:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Atualiza uma anamnese existente.
 */
async function atualizar(req, res) {
  const { id } = req.params;
  const { conteudo } = req.body;

  try {
    const existe = await pool.query(
      'SELECT id, paciente_id, medico_id, conteudo FROM anamneses WHERE id = $1',
      [id]
    );
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Anamnese não encontrada.' });
    const antes = existe.rows[0];
    if (req.user.role === 'medico' && antes.medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    if (conteudo === undefined) return res.status(400).json({ erro: 'Sem campos para atualizar.' });
    if (conteudo !== undefined && (!conteudo || !conteudo.trim())) {
      return res.status(400).json({ erro: 'O conteúdo da anamnese não pode ser vazio.' });
    }

    const { rows } = await pool.query(
      `UPDATE anamneses SET conteudo = $1 WHERE id = $2
       RETURNING id, paciente_id, medico_id, conteudo, atualizado_em`,
      [conteudo, id]
    );
    const depois = rows[0];

    // Registra a alteração no log de auditoria
    await registrarEdicao({
      paciente_id: antes.paciente_id,
      entidade: 'anamnese',
      entidade_id: parseInt(id),
      antes,
      depois,
      campos: CAMPOS_RASTREAVEIS,
      usuario: req.user
    });

    return res.json(depois);
  } catch (err) {
    console.error('Erro ao atualizar anamnese:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Exclui uma anamnese.
 */
async function excluir(req, res) {
  const { id } = req.params;
  try {
    const existe = await pool.query('SELECT id, paciente_id, medico_id, criado_em FROM anamneses WHERE id = $1', [id]);
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Anamnese não encontrada.' });
    if (req.user.role === 'medico' && existe.rows[0].medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    // Validação legal: prontuários/anamneses devem ser guardados por no mínimo 20 anos (Lei 13.787/2018)
    const criadoEm = new Date(existe.rows[0].criado_em);
    const hoje = new Date();
    const limite = new Date(criadoEm.getFullYear() + 20, criadoEm.getMonth(), criadoEm.getDate());
    if (hoje < limite) {
      return res.status(403).json({ erro: 'Pela legislação (Lei nº 13.787/2018), anamneses devem ser mantidas por no mínimo 20 anos e não podem ser excluídas antes deste prazo.' });
    }

    // Registra a exclusão no log de auditoria
    await registrarAcao({
      paciente_id: existe.rows[0].paciente_id,
      entidade: 'anamnese',
      entidade_id: parseInt(id),
      acao: 'exclusao',
      usuario: req.user
    });

    await pool.query('DELETE FROM anamneses WHERE id = $1', [id]);
    return res.json({ mensagem: 'Anamnese excluída com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir anamnese:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { criar, listar, buscarPorId, historicoPaciente, atualizar, excluir };
