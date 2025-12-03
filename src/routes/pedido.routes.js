const express = require('express')
const router = express.Router()

const pedidoController = require('../controllers/pedido.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// POST /pedidos - Criar novo pedido
router.post(
    '/',
    authMiddleware,
    pedidoController.criarPedido
)

// GET /pedidos - Listar pedidos do usuário
router.get(
    '/',
    authMiddleware,
    pedidoController.listarPedidosUsuario
)

// PATCH /pedidos/:id/status - Atualizar status do pedido
router.patch(
    '/:id/status',
    authMiddleware,
    pedidoController.atualizarStatus
)

// DELETE /pedidos/:id - Deletar pedido
router.delete(
    '/:id',
    authMiddleware,
    pedidoController.deletarPedido
)

module.exports = router