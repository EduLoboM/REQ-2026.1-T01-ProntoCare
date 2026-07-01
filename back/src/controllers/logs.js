const pool = require('../db');
const { buscarLogsPaciente } = require('../helpers/auditoria');

/**
 * Retorna o log de alterações de um paciente específico.
 * Inclui alterações cadastrais E de prontuários vinculados.
 */
async function listarPorPaciente(req, res) {
  const { pacienteId } = req.params;

  try {
    // Verifica permissão: médico só acessa logs de seus próprios pacientes, paciente só acessa o seu próprio
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

    const logs = await buscarLogsPaciente(pacienteId);
    return res.json(logs);
  } catch (err) {
    console.error('Erro ao buscar logs:', err.message);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { listarPorPaciente };
