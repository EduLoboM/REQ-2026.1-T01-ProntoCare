const pool = require('../db');
const { registrarAcao, registrarEdicao } = require('../helpers/auditoria');

// Campos rastreáveis do atendimento (SOAP + sinais vitais)
const CAMPOS_RASTREAVEIS = ['peso', 'altura', 'imc', 'subjetivo', 'objetivo', 'avaliacao', 'plano', 'finalizado'];

/**
 * Cria um novo atendimento (prontuário SOAP).
 * Calcula o IMC automaticamente quando peso e altura são informados.
 * Apenas médicos autenticados podem criar atendimentos.
 */
async function criar(req, res) {
  const { paciente_id, peso, altura, subjetivo, objetivo, avaliacao, plano } = req.body;

  if (!paciente_id) return res.status(400).json({ erro: 'paciente_id obrigatório.' });

  // Impede o envio de prontuários inteiramente em branco
  if (!subjetivo && !objetivo && !avaliacao && !plano) {
    return res.status(400).json({ erro: 'Preencha pelo menos um campo clínico.' });
  }

  try {
    // Verifica se o paciente existe e pertence ao médico logado
    const paciente = await pool.query('SELECT id, medico_id FROM pacientes WHERE id = $1', [paciente_id]);
    if (paciente.rows.length === 0) return res.status(404).json({ erro: 'Paciente não encontrado.' });
    if (req.user.role === 'medico' && paciente.rows[0].medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    // Cálculo automático do IMC
    let imc = null;
    if (peso && altura && parseFloat(altura) > 0) {
      imc = parseFloat((parseFloat(peso) / (parseFloat(altura) ** 2)).toFixed(2));
    }

    const { rows } = await pool.query(
      `INSERT INTO atendimentos (paciente_id, medico_id, peso, altura, imc, subjetivo, objetivo, avaliacao, plano)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, paciente_id, medico_id, peso, altura, imc, subjetivo, objetivo, avaliacao, plano, finalizado, criado_em`,
      [paciente_id, req.user.id, peso || null, altura || null, imc, subjetivo || null, objetivo || null, avaliacao || null, plano || null]
    );

    // Registra a criação do prontuário no log
    await registrarAcao({
      paciente_id: parseInt(paciente_id),
      entidade: 'atendimento',
      entidade_id: rows[0].id,
      acao: 'criacao',
      usuario: req.user,
      req
    });

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erro ao criar atendimento:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Lista todos os atendimentos do médico logado.
 * Suporta filtro por paciente_id via query string.
 */
async function listar(req, res) {
  try {
    const { paciente_id } = req.query;

    let query = `
      SELECT a.id, a.paciente_id, a.medico_id, a.peso, a.altura, a.imc,
             a.subjetivo, a.objetivo, a.avaliacao, a.plano, a.finalizado,
             a.criado_em, a.atualizado_em,
             p.nome AS paciente_nome,
             m.nome AS medico_nome
      FROM atendimentos a
      JOIN pacientes p ON a.paciente_id = p.id
      JOIN medicos m ON a.medico_id = m.id
      WHERE 1=1
    `;
    let params = [];
    let paramIndex = 1;

    // Médicos só veem seus próprios atendimentos
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
    console.error('Erro ao listar atendimentos:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Busca um atendimento específico por ID.
 * O médico só pode acessar os seus próprios atendimentos.
 */
async function buscarPorId(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.paciente_id, a.medico_id, a.peso, a.altura, a.imc,
              a.subjetivo, a.objetivo, a.avaliacao, a.plano, a.finalizado,
              a.criado_em, a.atualizado_em,
              p.nome AS paciente_nome, p.cpf AS paciente_cpf,
              p.data_nascimento AS paciente_nascimento, p.sexo AS paciente_sexo,
              m.nome AS medico_nome
       FROM atendimentos a
       JOIN pacientes p ON a.paciente_id = p.id
       JOIN medicos m ON a.medico_id = m.id
       WHERE a.id = $1`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ erro: 'Atendimento não encontrado.' });

    const atendimento = rows[0];
    if (req.user.role === 'medico' && atendimento.medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    return res.json(atendimento);
  } catch (err) {
    console.error('Erro ao buscar atendimento:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Retorna o histórico de atendimentos de um paciente específico.
 * Usado pela sidebar do frontend para exibir consultas anteriores.
 */
async function historicoPaciente(req, res) {
  const { pacienteId } = req.params;
  try {
    // Verifica se o paciente pertence ao médico logado ou se é o próprio paciente
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
      `SELECT a.id, a.peso, a.altura, a.imc,
              a.subjetivo, a.objetivo, a.avaliacao, a.plano,
              a.finalizado, a.criado_em, a.atualizado_em,
              m.nome AS medico_nome
       FROM atendimentos a
       JOIN medicos m ON a.medico_id = m.id
       WHERE a.paciente_id = $1
       ORDER BY a.criado_em DESC`,
      [pacienteId]
    );

    return res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Atualiza um atendimento existente.
 * Apenas o médico que criou o atendimento pode alterá-lo.
 * Registra cada campo alterado no log de auditoria.
 */
async function atualizar(req, res) {
  const { id } = req.params;
  const { peso, altura, subjetivo, objetivo, avaliacao, plano, finalizado } = req.body;

  try {
    // Busca snapshot completo ANTES da edição
    const existe = await pool.query(
      'SELECT id, paciente_id, medico_id, peso, altura, imc, subjetivo, objetivo, avaliacao, plano, finalizado FROM atendimentos WHERE id = $1',
      [id]
    );
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Atendimento não encontrado.' });
    const antes = existe.rows[0];
    if (req.user.role === 'medico' && antes.medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    const campos = [];
    const valores = [];
    let idx = 1;

    if (peso !== undefined) { campos.push(`peso = $${idx++}`); valores.push(peso); }
    if (altura !== undefined) { campos.push(`altura = $${idx++}`); valores.push(altura); }
    if (subjetivo !== undefined) { campos.push(`subjetivo = $${idx++}`); valores.push(subjetivo); }
    if (objetivo !== undefined) { campos.push(`objetivo = $${idx++}`); valores.push(objetivo); }
    if (avaliacao !== undefined) { campos.push(`avaliacao = $${idx++}`); valores.push(avaliacao); }
    if (plano !== undefined) { campos.push(`plano = $${idx++}`); valores.push(plano); }
    if (finalizado !== undefined) { campos.push(`finalizado = $${idx++}`); valores.push(finalizado); }

    // Recalcula IMC se peso ou altura foram alterados
    const pesoFinal = peso !== undefined ? peso : antes.peso;
    const alturaFinal = altura !== undefined ? altura : antes.altura;
    if (pesoFinal && alturaFinal && parseFloat(alturaFinal) > 0) {
      const imc = parseFloat((parseFloat(pesoFinal) / (parseFloat(alturaFinal) ** 2)).toFixed(2));
      campos.push(`imc = $${idx++}`);
      valores.push(imc);
    }

    if (campos.length === 0) return res.status(400).json({ erro: 'Sem campos para atualizar.' });

    valores.push(id);
    const { rows } = await pool.query(
      `UPDATE atendimentos SET ${campos.join(', ')} WHERE id = $${idx}
       RETURNING id, paciente_id, medico_id, peso, altura, imc, subjetivo, objetivo, avaliacao, plano, finalizado, atualizado_em`,
      valores
    );
    const depois = rows[0];

    // Registra cada campo alterado no log de auditoria
    await registrarEdicao({
      paciente_id: antes.paciente_id,
      entidade: 'atendimento',
      entidade_id: parseInt(id),
      antes,
      depois,
      campos: CAMPOS_RASTREAVEIS,
      usuario: req.user,
      req
    });

    return res.json(depois);
  } catch (err) {
    console.error('Erro ao atualizar atendimento:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Exclui permanentemente um atendimento.
 * Apenas o médico que criou o atendimento pode excluí-lo.
 */
async function excluir(req, res) {
  const { id } = req.params;
  try {
    const existe = await pool.query('SELECT id, paciente_id, medico_id, criado_em FROM atendimentos WHERE id = $1', [id]);
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Atendimento não encontrado.' });
    if (req.user.role === 'medico' && existe.rows[0].medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    // Validação legal: prontuários eletrônicos devem ser guardados por no mínimo 20 anos (Lei 13.787/2018)
    const criadoEm = new Date(existe.rows[0].criado_em);
    const hoje = new Date();
    const limite = new Date(criadoEm.getFullYear() + 20, criadoEm.getMonth(), criadoEm.getDate());
    if (hoje < limite) {
      return res.status(403).json({ erro: 'Pela legislação (Lei nº 13.787/2018), prontuários devem ser mantidos por no mínimo 20 anos e não podem ser excluídos antes deste prazo.' });
    }

    // Registra a exclusão no log ANTES de deletar
    await registrarAcao({
      paciente_id: existe.rows[0].paciente_id,
      entidade: 'atendimento',
      entidade_id: parseInt(id),
      acao: 'exclusao',
      usuario: req.user,
      req
    });

    await pool.query('DELETE FROM atendimentos WHERE id = $1', [id]);
    return res.json({ mensagem: 'Atendimento excluído com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir atendimento:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { criar, listar, buscarPorId, historicoPaciente, atualizar, excluir };
