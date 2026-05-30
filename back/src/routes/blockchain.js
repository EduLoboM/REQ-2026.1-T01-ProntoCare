const express = require('express');
const { autenticar, autorizar } = require('../middleware/auth');
const ctrl = require('../controllers/blockchain');

const router = express.Router();

// Registrar novo bloco na blockchain (médico ou admin)
router.post('/', autenticar, autorizar('medico', 'admin'), ctrl.registrarBloco);

// Listar toda a cadeia de um paciente
router.get('/paciente/:pacienteId', autenticar, autorizar('medico', 'admin', 'paciente'), ctrl.listarCadeia);

// Obter o último bloco da cadeia de um paciente
router.get('/paciente/:pacienteId/ultimo', autenticar, autorizar('medico', 'admin', 'paciente'), ctrl.ultimoBloco);

// Verificar integridade da cadeia
router.get('/paciente/:pacienteId/verificar', autenticar, autorizar('medico', 'admin', 'paciente'), ctrl.verificarIntegridade);

module.exports = router;
