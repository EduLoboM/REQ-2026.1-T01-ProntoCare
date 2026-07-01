const pool = require('../db');
const { registrarAcao, registrarEdicao } = require('../helpers/auditoria');

const CAMPOS_RASTREAVEIS = ['status', 'data_hora'];

async function listar(req, res) {
  try {
    const { data_inicio, data_fim } = req.query;

    let query = `
      SELECT c.id, c.paciente_id, c.medico_id, c.data_hora, c.status, c.criado_em, c.atualizado_em,
             p.nome AS paciente_nome, p.cpf AS paciente_cpf,
             m.nome AS medico_nome
      FROM consultas c
      JOIN pacientes p ON c.paciente_id = p.id
      JOIN medicos m ON c.medico_id = m.id
      WHERE p.ativo = true
    `;

    let params = [];
    let paramIndex = 1;

    if (req.user.role === 'medico') {
      query += ` AND c.medico_id = $${paramIndex++}`;
      params.push(req.user.id);
    } else if (req.user.role === 'paciente') {
      query += ` AND c.paciente_id = $${paramIndex++}`;
      params.push(req.user.id);
    }

    if (data_inicio) {
      query += ` AND c.data_hora >= $${paramIndex++}`;
      params.push(data_inicio);
    }

    if (data_fim) {
      query += ` AND c.data_hora <= $${paramIndex++}`;
      params.push(data_fim);
    }

    query += ` ORDER BY c.data_hora ASC`;

    const { rows } = await pool.query(query, params);
    return res.json(rows);
  } catch (err) {
    console.error('Erro ao listar consultas:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function criar(req, res) {
  const { paciente_id, data_hora } = req.body;

  if (!paciente_id || !data_hora) {
    return res.status(400).json({ erro: 'Campos obrigatorios: paciente_id e data_hora.' });
  }

  try {
    // Verifica se o paciente existe e está ativo
    const pacRes = await pool.query('SELECT id, medico_id, ativo FROM pacientes WHERE id = $1', [paciente_id]);
    if (pacRes.rows.length === 0) {
      return res.status(404).json({ erro: 'Paciente nao encontrado.' });
    }
    const paciente = pacRes.rows[0];
    if (!paciente.ativo) {
      return res.status(400).json({ erro: 'Não é possível agendar consulta para paciente inativo.' });
    }

    // Se for médico, garante que o paciente está associado a ele
    if (req.user.role === 'medico' && paciente.medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado. Este paciente pertence a outro medico.' });
    }

    const medicoId = req.user.role === 'medico' ? req.user.id : paciente.medico_id;

    if (!medicoId) {
      return res.status(400).json({ erro: 'Paciente deve estar vinculado a um médico.' });
    }

    const { rows } = await pool.query(
      `INSERT INTO consultas (paciente_id, medico_id, data_hora, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, paciente_id, medico_id, data_hora, status, criado_em, atualizado_em`,
      [paciente_id, medicoId, data_hora, 'Agendado']
    );

    // Registra a ação no log
    await registrarAcao({
      paciente_id: parseInt(paciente_id),
      entidade: 'consulta',
      entidade_id: rows[0].id,
      acao: 'criacao',
      usuario: req.user,
      req
    });

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erro ao criar consulta:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { status, data_hora } = req.body;

  try {
    const consultaRes = await pool.query('SELECT * FROM consultas WHERE id = $1', [id]);
    if (consultaRes.rows.length === 0) {
      return res.status(404).json({ erro: 'Consulta nao encontrada.' });
    }
    const antes = consultaRes.rows[0];

    // Se for médico, garante que a consulta está vinculada a ele
    if (req.user.role === 'medico' && antes.medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    // RF13: Se estiver alterando status, valida se a consulta é de hoje
    if (status && status !== antes.status) {
      const dataConsulta = new Date(antes.data_hora).toISOString().split('T')[0];
      const dataHoje = new Date().toISOString().split('T')[0];

      if (dataConsulta !== dataHoje) {
        return res.status(400).json({ erro: 'Apenas consultas do dia atual podem ter o status alterado.' });
      }

      if (!['Agendado', 'Em atendimento', 'Finalizado'].includes(status)) {
        return res.status(400).json({ erro: 'Status inválido. Escolha entre: Agendado, Em atendimento, Finalizado.' });
      }
    }

    const campos = [];
    const valores = [];
    let idx = 1;

    if (status !== undefined) {
      campos.push(`status = $${idx++}`);
      valores.push(status);
    }
    if (data_hora !== undefined) {
      campos.push(`data_hora = $${idx++}`);
      valores.push(data_hora);
    }

    if (campos.length === 0) {
      return res.status(400).json({ erro: 'Sem campos para atualizar.' });
    }

    valores.push(id);
    const { rows } = await pool.query(
      `UPDATE consultas SET ${campos.join(', ')} WHERE id = $${idx} RETURNING id, paciente_id, medico_id, data_hora, status, atualizado_em`,
      valores
    );
    const depois = rows[0];

    // Registra edições no log de auditoria
    await registrarEdicao({
      paciente_id: antes.paciente_id,
      entidade: 'consulta',
      entidade_id: antes.id,
      antes,
      depois,
      campos: CAMPOS_RASTREAVEIS,
      usuario: req.user,
      req
    });

    return res.json(depois);
  } catch (err) {
    console.error('Erro ao atualizar consulta:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { listar, criar, atualizar };
