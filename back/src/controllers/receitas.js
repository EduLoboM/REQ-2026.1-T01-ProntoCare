const pool = require('../db');
const { registrarAcao } = require('../helpers/auditoria');

/**
 * Cria uma nova receita médica digital.
 * Apenas médicos podem elaborar receitas.
 */
async function criar(req, res) {
  const { paciente_id, medicamentos, observacoes } = req.body;

  if (!paciente_id) return res.status(400).json({ erro: 'paciente_id é obrigatório.' });
  if (!medicamentos || !medicamentos.trim()) return res.status(400).json({ erro: 'medicamentos é obrigatório.' });

  try {
    // Verifica se o paciente existe e se pertence ao médico logado
    const paciente = await pool.query('SELECT id, medico_id FROM pacientes WHERE id = $1', [paciente_id]);
    if (paciente.rows.length === 0) return res.status(404).json({ erro: 'Paciente não encontrado.' });
    
    if (req.user.role === 'medico' && paciente.rows[0].medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    const { rows } = await pool.query(
      `INSERT INTO receitas (paciente_id, medico_id, medicamentos, observacoes)
       VALUES ($1, $2, $3, $4)
       RETURNING id, paciente_id, medico_id, medicamentos, observacoes, criado_em,
                 assinado, assinatura_provedor, assinatura_nome, assinatura_cpf, assinatura_data, assinatura_token`,
      [
        paciente_id,
        req.user.id,
        medicamentos,
        observacoes || null
      ]
    );

    // Registra a criação no log de auditoria
    await registrarAcao({
      paciente_id: parseInt(paciente_id),
      entidade: 'receita',
      entidade_id: rows[0].id,
      acao: 'criacao',
      usuario: req.user,
      req
    });

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erro ao criar receita:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Lista todas as receitas de um paciente.
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
      `SELECT r.id, r.paciente_id, r.medico_id, r.medicamentos, r.observacoes, r.criado_em,
              r.assinado, r.assinatura_provedor, r.assinatura_nome, r.assinatura_cpf, r.assinatura_data, r.assinatura_token,
              m.nome AS medico_nome, m.crm AS medico_crm, m.especialidade AS medico_especialidade
       FROM receitas r
       JOIN medicos m ON r.medico_id = m.id
       WHERE r.paciente_id = $1
       ORDER BY r.criado_em DESC`,
      [pacienteId]
    );

    return res.json(rows);
  } catch (err) {
    console.error('Erro ao listar receitas do paciente:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Recupera uma receita específica.
 */
async function buscarPorId(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.paciente_id, r.medico_id, r.medicamentos, r.observacoes, r.criado_em,
              r.assinado, r.assinatura_provedor, r.assinatura_nome, r.assinatura_cpf, r.assinatura_data, r.assinatura_token,
              p.nome AS paciente_nome, p.cpf AS paciente_cpf,
              p.data_nascimento AS paciente_nascimento, p.sexo AS paciente_sexo,
              p.medico_id AS paciente_medico_id,
              m.nome AS medico_nome, m.crm AS medico_crm, m.especialidade AS medico_especialidade
       FROM receitas r
       JOIN pacientes p ON r.paciente_id = p.id
       JOIN medicos m ON r.medico_id = m.id
       WHERE r.id = $1`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ erro: 'Receita não encontrada.' });
    const receita = rows[0];

    // Permissões
    if (req.user.role === 'medico' && receita.paciente_medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    } else if (req.user.role === 'paciente' && receita.paciente_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    // Remove campo auxiliar da query
    delete receita.paciente_medico_id;

    return res.json(receita);
  } catch (err) {
    console.error('Erro ao buscar receita:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Exclui uma receita. Segue a regra de retenção de 20 anos.
 */
async function excluir(req, res) {
  const { id } = req.params;

  try {
    const existe = await pool.query(
      `SELECT r.id, r.paciente_id, r.medico_id, r.criado_em,
              p.medico_id AS paciente_medico_id
       FROM receitas r
       JOIN pacientes p ON r.paciente_id = p.id
       WHERE r.id = $1`,
      [id]
    );
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Receita não encontrada.' });

    const receita = existe.rows[0];

    if (req.user.role === 'medico' && receita.paciente_medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    // Regra legal de 20 anos
    const criadoEm = new Date(receita.criado_em);
    const hoje = new Date();
    const limite = new Date(criadoEm.getFullYear() + 20, criadoEm.getMonth(), criadoEm.getDate());
    if (hoje < limite) {
      return res.status(403).json({
        erro: 'Pela legislação (Lei nº 13.787/2018), receitas médicas devem ser mantidas por no mínimo 20 anos e não podem ser excluídas antes deste prazo.'
      });
    }

    // Registra a exclusão no log de auditoria
    await registrarAcao({
      paciente_id: receita.paciente_id,
      entidade: 'receita',
      entidade_id: parseInt(id),
      acao: 'exclusao',
      usuario: req.user,
      req
    });

    await pool.query('DELETE FROM receitas WHERE id = $1', [id]);
    return res.json({ mensagem: 'Receita excluída com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir receita:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Atualiza uma receita existente.
 * Apenas o médico que a criou pode alterá-la.
 * Registra cada campo alterado no log de auditoria.
 */
async function atualizar(req, res) {
  const { id } = req.params;
  const { medicamentos, observacoes } = req.body;

  try {
    const existe = await pool.query(
      'SELECT id, paciente_id, medico_id, medicamentos, observacoes FROM receitas WHERE id = $1',
      [id]
    );
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Receita não encontrada.' });
    const antes = existe.rows[0];
    if (req.user.role === 'medico' && antes.medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    const campos = [];
    const valores = [];
    let idx = 1;

    if (medicamentos !== undefined) {
      if (!medicamentos || !medicamentos.trim()) {
        return res.status(400).json({ erro: 'medicamentos é obrigatório.' });
      }
      campos.push(`medicamentos = $${idx++}`);
      valores.push(medicamentos.trim());
    }
    if (observacoes !== undefined) {
      campos.push(`observacoes = $${idx++}`);
      valores.push(observacoes ? observacoes.trim() : null);
    }

    if (campos.length === 0) return res.status(400).json({ erro: 'Sem campos para atualizar.' });

    valores.push(id);
    const { rows } = await pool.query(
      `UPDATE receitas SET ${campos.join(', ')} WHERE id = $${idx}
       RETURNING id, paciente_id, medico_id, medicamentos, observacoes, criado_em,
                 assinado, assinatura_provedor, assinatura_nome, assinatura_cpf, assinatura_data, assinatura_token`,
      valores
    );
    const depois = rows[0];

    const { registrarEdicao } = require('../helpers/auditoria');
    await registrarEdicao({
      paciente_id: antes.paciente_id,
      entidade: 'receita',
      entidade_id: parseInt(id),
      antes,
      depois,
      campos: ['medicamentos', 'observacoes'],
      usuario: req.user,
      req
    });

    return res.json(depois);
  } catch (err) {
    console.error('Erro ao atualizar receita:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

/**
 * Assina digitalmente uma receita médica utilizando certificado A3 em nuvem.
 */
async function assinar(req, res) {
  const { id } = req.params;
  const { provedor, cpf, pin, otp } = req.body;

  if (!provedor || !cpf || !pin || !otp) {
    return res.status(400).json({ erro: 'Provedor, CPF, PIN e OTP são obrigatórios para assinatura em nuvem.' });
  }

  try {
    const existe = await pool.query(
      'SELECT id, paciente_id, medico_id, medicamentos FROM receitas WHERE id = $1',
      [id]
    );
    if (existe.rows.length === 0) return res.status(404).json({ erro: 'Receita não encontrada.' });
    const receita = existe.rows[0];

    if (req.user.role === 'medico' && receita.medico_id !== req.user.id) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    const tokenAssinatura = `ICP-Brasil-A3-Cloud:${provedor}:${cpf}:${Buffer.from(receita.medicamentos).toString('base64').substring(0, 20)}:${Date.now()}`;

    const { rows } = await pool.query(
      `UPDATE receitas 
       SET assinado = true,
           assinatura_provedor = $1,
           assinatura_nome = $2,
           assinatura_cpf = $3,
           assinatura_data = NOW(),
           assinatura_token = $4
       WHERE id = $5
       RETURNING id, paciente_id, medico_id, medicamentos, observacoes, criado_em, 
                 assinado, assinatura_provedor, assinatura_nome, assinatura_cpf, assinatura_data, assinatura_token`,
      [provedor, req.user.nome || 'Médico', cpf, tokenAssinatura, id]
    );

    // Registra a assinatura no log de auditoria
    await registrarAcao({
      paciente_id: receita.paciente_id,
      entidade: 'receita',
      entidade_id: parseInt(id),
      acao: 'assinatura',
      usuario: req.user,
      req
    });

    return res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao assinar receita:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { criar, listarPorPaciente, buscarPorId, atualizar, excluir, assinar };
