const pool = require('../db');
const { registrarAcao } = require('../helpers/auditoria');

/**
 * Registra um novo bloco na blockchain de um paciente.
 * Chamado pelo frontend após gerar o hash SHA-256 no lado do cliente.
 */
async function registrarBloco(req, res) {
  const {
    paciente_id,
    indice,
    timestamp,
    tipo,
    entidade,
    entidade_id,
    versao,
    dados_hash,
    pdf_hash,
    hash_anterior,
    hash,
    bloco_original_id,
  } = req.body;

  if (!paciente_id || indice === undefined || !tipo || !dados_hash || !hash_anterior || !hash) {
    return res.status(400).json({ erro: 'Campos obrigatórios: paciente_id, indice, tipo, dados_hash, hash_anterior, hash.' });
  }

  try {
    // Verifica se o paciente existe e se o médico tem acesso
    const paciente = await pool.query('SELECT id, medico_id FROM pacientes WHERE id = $1', [paciente_id]);
    if (paciente.rows.length === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado.' });
    }
    if (req.user.role === 'medico' && paciente.rows[0].medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    // Valida a cadeia: o hash_anterior deve corresponder ao último bloco do paciente
    const ultimoBloco = await pool.query(
      'SELECT hash, indice FROM prontuario_blockchain WHERE paciente_id = $1 ORDER BY indice DESC LIMIT 1',
      [paciente_id]
    );

    if (ultimoBloco.rows.length > 0) {
      if (ultimoBloco.rows[0].hash !== hash_anterior) {
        return res.status(409).json({
          erro: 'Hash anterior não corresponde ao último bloco da cadeia. Possível conflito de concorrência.',
          esperado: ultimoBloco.rows[0].hash,
          recebido: hash_anterior,
        });
      }
      if (indice !== ultimoBloco.rows[0].indice + 1) {
        return res.status(409).json({
          erro: `Índice esperado: ${ultimoBloco.rows[0].indice + 1}, recebido: ${indice}.`,
        });
      }
    } else if (tipo !== 'genesis' && indice !== 0) {
      return res.status(400).json({ erro: 'Primeiro bloco deve ser o gênesis (indice=0, tipo=genesis).' });
    }

    const { rows } = await pool.query(
      `INSERT INTO prontuario_blockchain 
        (paciente_id, indice, timestamp, tipo, entidade, entidade_id, versao, dados_hash, pdf_hash, hash_anterior, hash, bloco_original_id, usuario_id, usuario_nome, usuario_role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        paciente_id,
        indice,
        timestamp || new Date().toISOString(),
        tipo,
        entidade || null,
        entidade_id || null,
        versao || 1,
        dados_hash,
        pdf_hash || null,
        hash_anterior,
        hash,
        bloco_original_id || null,
        req.user.id,
        req.user.nome || req.user.user,
        req.user.role,
      ]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erro ao registrar bloco na blockchain:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Retorna a cadeia completa de blocos de um paciente (ordenada por índice).
 */
async function listarCadeia(req, res) {
  const { pacienteId } = req.params;

  try {
    // Verifica permissão
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
      `SELECT id, paciente_id, indice, timestamp, tipo, entidade, entidade_id, versao,
              dados_hash, pdf_hash, hash_anterior, hash, bloco_original_id,
              usuario_id, usuario_nome, usuario_role, criado_em
       FROM prontuario_blockchain
       WHERE paciente_id = $1
       ORDER BY indice ASC`,
      [pacienteId]
    );

    return res.json(rows);
  } catch (err) {
    console.error('Erro ao listar cadeia blockchain:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Retorna o último bloco da cadeia de um paciente.
 * Usado pelo frontend para saber o hash_anterior ao criar um novo bloco.
 */
async function ultimoBloco(req, res) {
  const { pacienteId } = req.params;

  try {
    // Verifica permissão
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
      `SELECT id, paciente_id, indice, timestamp, tipo, entidade, entidade_id, versao,
              dados_hash, pdf_hash, hash_anterior, hash, bloco_original_id,
              usuario_id, usuario_nome, usuario_role, criado_em
       FROM prontuario_blockchain
       WHERE paciente_id = $1
       ORDER BY indice DESC LIMIT 1`,
      [pacienteId]
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar último bloco:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Verifica a integridade da cadeia no backend (server-side validation).
 * Compara os hash_anterior de cada bloco com o hash do bloco precedente.
 */
async function verificarIntegridade(req, res) {
  const { pacienteId } = req.params;

  try {
    // Verifica permissão
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
      `SELECT indice, hash, hash_anterior
       FROM prontuario_blockchain
       WHERE paciente_id = $1
       ORDER BY indice ASC`,
      [pacienteId]
    );

    // Registra a ação de verificação no log de auditoria
    await registrarAcao({
      paciente_id: pacienteId,
      entidade: 'blockchain',
      entidade_id: pacienteId,
      acao: 'verificacao',
      usuario: req.user,
      req,
    });

    if (rows.length === 0) {
      return res.json({ valida: true, blocos: 0, mensagem: 'Nenhum bloco na cadeia.' });
    }

    // Verificação sequencial: cada hash_anterior deve corresponder ao hash do bloco anterior
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].hash_anterior !== rows[i - 1].hash) {
        return res.json({
          valida: false,
          blocos: rows.length,
          blocoInvalido: rows[i].indice,
          mensagem: `Bloco #${rows[i].indice}: hash_anterior não corresponde ao hash do bloco #${rows[i - 1].indice}. Possível adulteração.`,
        });
      }
    }

    return res.json({
      valida: true,
      blocos: rows.length,
      mensagem: 'Cadeia íntegra. Todos os blocos verificados com sucesso.',
    });
  } catch (err) {
    console.error('Erro ao verificar integridade:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { registrarBloco, listarCadeia, ultimoBloco, verificarIntegridade };
