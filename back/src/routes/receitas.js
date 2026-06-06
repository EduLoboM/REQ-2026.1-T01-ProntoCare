const express = require('express');
const { autenticar, autorizar } = require('../middleware/auth');
const ctrl = require('../controllers/receitas');

const router = express.Router();

// Histórico de receitas de um paciente específico
router.get('/paciente/:pacienteId', autenticar, autorizar('medico', 'admin', 'paciente'), ctrl.listarPorPaciente);

// Buscar receita individual por ID
router.get('/:id', autenticar, autorizar('medico', 'admin', 'paciente'), ctrl.buscarPorId);

// Criar receita (apenas médicos)
router.post('/', autenticar, autorizar('medico'), ctrl.criar);

// Excluir receita (apenas médicos, com validação de 20 anos)
router.delete('/:id', autenticar, autorizar('medico'), ctrl.excluir);

// Editar receita (apenas médicos)
router.put('/:id', autenticar, autorizar('medico'), ctrl.atualizar);

module.exports = router;
