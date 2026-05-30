const pool = require('../db');

/**
 * Mapeamento de nomes de campos internos (snake_case do DB) para nomes legíveis em português.
 * Usado para exibir o log de alterações de forma compreensível no frontend.
 */
const NOMES_CAMPOS = {
  // Paciente
  nome: 'Nome',
  cpf: 'CPF',
  data_nascimento: 'Data de Nascimento',
  sexo: 'Sexo',
  nome_mae: 'Nome da Mãe',
  email: 'E-mail',
  telefone: 'Telefone',
  cep: 'CEP',
  numero: 'Número/Complemento',
  ativo: 'Status (Ativo)',
  senha_hash: 'Senha',
  // Atendimento
  peso: 'Peso (kg)',
  altura: 'Altura (m)',
  imc: 'IMC',
  subjetivo: 'Subjetivo (S)',
  objetivo: 'Objetivo (O)',
  avaliacao: 'Avaliação (A)',
  plano: 'Plano (P)',
  finalizado: 'Finalizado',
  conteudo: 'Conteúdo da Anamnese',
};

/**
 * Registra uma entrada de ação genérica no log (criação, exclusão, etc.)
 */
async function registrarAcao({ paciente_id, entidade, entidade_id, acao, usuario, req, ip, user_agent }) {
  const ipAddress = ip || (req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip) : null);
  const userAgentString = user_agent || (req ? req.headers['user-agent'] : null);

  try {
    if (acao === 'visualizacao') {
      const recente = await pool.query(
        `SELECT id FROM log_alteracoes 
         WHERE paciente_id = $1 AND acao = 'visualizacao' AND usuario_id = $2 AND entidade = $3 AND entidade_id = $4 AND criado_em > NOW() - INTERVAL '5 seconds'
         LIMIT 1`,
        [paciente_id, usuario.id, entidade, entidade_id]
      );
      if (recente.rows.length > 0) {
        return;
      }
    }

    await pool.query(
      `INSERT INTO log_alteracoes (paciente_id, entidade, entidade_id, acao, usuario_id, usuario_nome, usuario_role, ip, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [paciente_id, entidade, entidade_id, acao, usuario.id, usuario.nome || usuario.user, usuario.role, ipAddress, userAgentString]
    );
  } catch (err) {
    console.error('Erro ao registrar ação no log:', err.message);
  }
}

/**
 * Compara dois objetos (antes/depois) e registra no log uma entrada para cada campo que mudou.
 * Oculta valores sensíveis (ex.: senha_hash aparece como '***').
 *
 * @param {Object} params
 * @param {number} params.paciente_id    - ID do paciente (para indexação)
 * @param {string} params.entidade       - 'paciente' ou 'atendimento'
 * @param {number} params.entidade_id    - ID do registro alterado
 * @param {Object} params.antes          - Snapshot do registro antes da edição
 * @param {Object} params.depois         - Snapshot do registro depois da edição
 * @param {string[]} params.campos       - Lista de campos a verificar
 * @param {Object} params.usuario        - { id, nome/user, role } do usuário autenticado
 * @param {Object} [params.req]          - Objeto de requisição Express
 * @param {string} [params.ip]           - IP explícito
 * @param {string} [params.user_agent]   - User agent explícito
 */
async function registrarEdicao({ paciente_id, entidade, entidade_id, antes, depois, campos, usuario, req, ip, user_agent }) {
  const camposSensiveis = ['senha_hash'];
  const inserts = [];

  const ipAddress = ip || (req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip) : null);
  const userAgentString = user_agent || (req ? req.headers['user-agent'] : null);

  for (const campo of campos) {
    const valorAntigo = antes[campo];
    const valorNovo = depois[campo];

    // Normaliza para string para comparar (null/undefined tratados como string vazia)
    const strAntigo = valorAntigo == null ? '' : String(valorAntigo);
    const strNovo = valorNovo == null ? '' : String(valorNovo);

    if (strAntigo !== strNovo) {
      const isSensivel = camposSensiveis.includes(campo);
      inserts.push(
        pool.query(
          `INSERT INTO log_alteracoes (paciente_id, entidade, entidade_id, acao, campo, valor_anterior, valor_novo, usuario_id, usuario_nome, usuario_role, ip, user_agent)
           VALUES ($1, $2, $3, 'edicao', $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            paciente_id,
            entidade,
            entidade_id,
            NOMES_CAMPOS[campo] || campo,
            isSensivel ? '***' : strAntigo || null,
            isSensivel ? '***' : strNovo || null,
            usuario.id,
            usuario.nome || usuario.user,
            usuario.role,
            ipAddress,
            userAgentString
          ]
        )
      );
    }
  }

  try {
    await Promise.all(inserts);
  } catch (err) {
    console.error('Erro ao registrar edições no log:', err.message);
  }
}

/**
 * Busca todos os logs de um paciente (ordenados por data decrescente).
 */
async function buscarLogsPaciente(pacienteId) {
  const { rows } = await pool.query(
    `SELECT id, paciente_id, entidade, entidade_id, acao, campo, valor_anterior, valor_novo,
            usuario_id, usuario_nome, usuario_role, ip, user_agent, criado_em
     FROM log_alteracoes
     WHERE paciente_id = $1
     ORDER BY criado_em DESC`,
    [pacienteId]
  );
  return rows;
}

module.exports = { registrarAcao, registrarEdicao, buscarLogsPaciente, NOMES_CAMPOS };
