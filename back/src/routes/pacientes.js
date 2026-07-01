const express = require('express');
const { autenticar, autorizar } = require('../middleware/auth');
const ctrl = require('../controllers/pacientes');

const router = express.Router();

router.get('/me', autenticar, autorizar('paciente'), ctrl.minhasConta);
router.delete('/me', autenticar, autorizar('paciente'), ctrl.solicitarExclusao);
router.get('/me/exportar', autenticar, autorizar('paciente'), ctrl.exportarDados);

router.get('/', autenticar, autorizar('medico', 'admin'), ctrl.listar);
router.get('/exportar', autenticar, autorizar('medico', 'admin'), ctrl.exportarTodos);
router.get('/:id', autenticar, autorizar('medico', 'admin'), ctrl.buscarPorId);
router.post('/', autenticar, autorizar('medico'), ctrl.criar);
router.put('/:id', autenticar, autorizar('medico'), ctrl.atualizar);
router.delete('/:id', autenticar, autorizar('medico'), ctrl.excluir);
router.delete('/:id/permanente', autenticar, autorizar('medico'), ctrl.excluirPermanente);

module.exports = router;