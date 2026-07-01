const express = require('express');
const { autenticar, autorizar } = require('../middleware/auth');
const ctrl = require('../controllers/atendimentos');

const router = express.Router();

// Histórico de atendimentos de um paciente específico (sidebar do frontend)
router.get('/paciente/:pacienteId', autenticar, autorizar('medico', 'admin', 'paciente'), ctrl.historicoPaciente);

// CRUD de atendimentos
router.get('/', autenticar, autorizar('medico', 'admin'), ctrl.listar);
router.get('/:id', autenticar, autorizar('medico', 'admin'), ctrl.buscarPorId);
router.post('/', autenticar, autorizar('medico'), ctrl.criar);
router.put('/:id', autenticar, autorizar('medico'), ctrl.atualizar);
router.delete('/:id', autenticar, autorizar('medico'), ctrl.excluir);

module.exports = router;
