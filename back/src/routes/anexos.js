const express = require('express');
const { autenticar, autorizar } = require('../middleware/auth');
const ctrl = require('../controllers/anexos');

const router = express.Router();

// Listar anexos de um paciente (médico, admin, ou o próprio paciente)
router.get('/paciente/:pacienteId', autenticar, autorizar('medico', 'admin', 'paciente'), ctrl.listarPorPaciente);

// Obter detalhes de um anexo incluindo o base64 (médico, admin, ou o próprio paciente)
router.get('/:id', autenticar, autorizar('medico', 'admin', 'paciente'), ctrl.buscarPorId);

// Criar novo anexo (somente médico)
router.post('/', autenticar, autorizar('medico'), ctrl.criar);

// Excluir anexo seguindo retenção de 20 anos (somente médico)
router.delete('/:id', autenticar, autorizar('medico'), ctrl.excluir);

module.exports = router;
