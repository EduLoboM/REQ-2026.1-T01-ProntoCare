const express = require('express');
const { autenticar, autorizar } = require('../middleware/auth');
const ctrl = require('../controllers/medicos');

const router = express.Router();

router.use(autenticar, autorizar('admin'));

router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscarPorId);
router.get('/:id/detalhes', ctrl.buscarDetalhes);
router.post('/', ctrl.criar);
router.put('/:id', ctrl.atualizar);
router.delete('/:id', ctrl.excluir);
router.delete('/:id/permanente', ctrl.excluirPermanente);

module.exports = router;