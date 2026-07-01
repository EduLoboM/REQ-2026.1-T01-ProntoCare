const pool = require('../db');
const { registrarAcao } = require('../helpers/auditoria');

/**
 * Cria um novo anexo (upload de arquivo via Base64).
 * Apenas médicos podem anexar arquivos.
 */
async function criar(req, res) {
  const { paciente_id, atendimento_id, nome_arquivo, mime_type, tamanho_bytes, dados_base64 } = req.body;

  if (!paciente_id) return res.status(400).json({ erro: 'paciente_id é obrigatório.' });
  if (!nome_arquivo || !nome_arquivo.trim()) return res.status(400).json({ erro: 'nome_arquivo é obrigatório.' });
  if (!mime_type || !mime_type.trim()) return res.status(400).json({ erro: 'mime_type é obrigatório.' });
  if (!dados_base64 || !dados_base64.trim()) return res.status(400).json({ erro: 'dados_base64 é obrigatório.' });

  try {
    // Verifica se o paciente existe e se pertence ao médico logado
    const paciente = await pool.query('SELECT id, medico_id FROM pacientes WHERE id = $1', [paciente_id]);
    if (paciente.rows.length === 0) return res.status(404).json({ erro: 'Paciente não encontrado.' });
    
    if (req.user.role === 'medico' && paciente.rows[0].medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    const { rows } = await pool.query(
      `INSERT INTO anexos (paciente_id, atendimento_id, medico_id, nome_arquivo, mime_type, tamanho_bytes, dados_base64)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, paciente_id, atendimento_id, medico_id, nome_arquivo, mime_type, tamanho_bytes, criado_em`,
      [
        paciente_id,
        atendimento_id || null,
        req.user.id,
        nome_arquivo,
        mime_type,
        tamanho_bytes || Math.round(dados_base64.length * 0.75),
        dados_base64
      ]
    );

    // Registra a criação no log de auditoria
    await registrarAcao({
      paciente_id: parseInt(paciente_id),
      entidade: 'anexo',
      entidade_id: rows[0].id,
      acao: 'criacao',
      usuario: req.user,
      req
    });

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erro ao criar anexo:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Lista todos os anexos de um paciente (sem retornar o dados_base64 pesado).
 */
async function listarPorPaciente(req, res) {
  const { pacienteId } = req.params;

  try {
    // Permissões
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
      `SELECT a.id, a.paciente_id, a.atendimento_id, a.medico_id, a.nome_arquivo, a.mime_type, a.tamanho_bytes, a.criado_em,
              m.nome AS medico_nome,
              at.criado_em AS atendimento_data
       FROM anexos a
       JOIN medicos m ON a.medico_id = m.id
       LEFT JOIN atendimentos at ON a.atendimento_id = at.id
       WHERE a.paciente_id = $1
       ORDER BY a.criado_em DESC`,
      [pacienteId]
    );

    return res.json(rows);
  } catch (err) {
    console.error('Erro ao listar anexos do paciente:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Recupera um anexo específico (incluindo o dados_base64 para download/visualização).
 */
async function buscarPorId(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.paciente_id, a.atendimento_id, a.medico_id, a.nome_arquivo, a.mime_type, a.tamanho_bytes, a.dados_base64, a.criado_em,
              m.nome AS medico_nome,
              p.medico_id AS paciente_medico_id
       FROM anexos a
       JOIN medicos m ON a.medico_id = m.id
       JOIN pacientes p ON a.paciente_id = p.id
       WHERE a.id = $1`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ erro: 'Anexo não encontrado.' });
    const anexo = rows[0];

    // Permissões
    if (req.user.role === 'medico' && anexo.paciente_medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    } else if (req.user.role === 'paciente' && anexo.paciente_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    // Remove campo auxiliar da query
    delete anexo.paciente_medico_id;

    return res.json(anexo);
  } catch (err) {
    console.error('Erro ao buscar anexo:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Exclui um anexo. Segue a regra de retenção de 20 anos.
 */
async function excluir(req, res) {
  const { id } = req.params;

  try {
    const existe = await pool.query(
      `SELECT a.id, a.paciente_id, a.medico_id, a.criado_em,
              p.medico_id AS paciente_medico_id
       FROM anexos a
       JOIN pacientes p ON a.paciente_id = p.id
       WHERE a.id = $1`,
      [id]
    );
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Anexo não encontrado.' });

    const anexo = existe.rows[0];

    if (req.user.role === 'medico' && anexo.paciente_medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    // Regra legal de 20 anos
    const criadoEm = new Date(anexo.criado_em);
    const hoje = new Date();
    const limite = new Date(criadoEm.getFullYear() + 20, criadoEm.getMonth(), criadoEm.getDate());
    if (hoje < limite) {
      return res.status(403).json({
        erro: 'Pela legislação (Lei nº 13.787/2018), documentos anexados ao prontuário devem ser mantidos por no mínimo 20 anos e não podem ser excluídos antes deste prazo.'
      });
    }

    // Registra a exclusão no log de auditoria
    await registrarAcao({
      paciente_id: anexo.paciente_id,
      entidade: 'anexo',
      entidade_id: parseInt(id),
      acao: 'exclusao',
      usuario: req.user,
      req
    });

    await pool.query('DELETE FROM anexos WHERE id = $1', [id]);
    return res.json({ mensagem: 'Anexo excluído com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir anexo:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { criar, listarPorPaciente, buscarPorId, excluir };
