const express = require('express');
const { autenticar, autorizar } = require('../middleware/auth');
const ctrl = require('../controllers/consultas');

const router = express.Router();

router.get('/', autenticar, ctrl.listar);
router.post('/', autenticar, autorizar('medico', 'admin'), ctrl.criar);
router.put('/:id', autenticar, autorizar('medico', 'admin'), ctrl.atualizar);

module.exports = router;
