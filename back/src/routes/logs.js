const express = require('express');
const { autenticar, autorizar } = require('../middleware/auth');
const ctrl = require('../controllers/logs');

const router = express.Router();

// Log de alterações de um paciente (cadastro + prontuários)
router.get('/paciente/:pacienteId', autenticar, autorizar('medico', 'admin', 'paciente'), ctrl.listarPorPaciente);

module.exports = router;
