const express = require('express')
const router = express.Router()

const { criar, listar, atualizar,
    atualizarCompleto, apagar } = require('../controllers/compra.controller')

// Middlewares
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// POST /compras - Criar compra
router.post(
    '/',
    authMiddleware,
    isAdminMiddleware,
    criar
)

// GET /compras - Listar compras
router.get(
    '/',
    authMiddleware,
    isAdminMiddleware,
    listar
)

// PATCH /compras/:id/receber - atualizar parcial compra
router.patch(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    atualizar
)

// PUT /compras/:id/receber - atualizar compra
router.put(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    atualizarCompleto
)

// DELETE /compras/:id/receber - apagar compra
router.delete(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    apagar
)

module.exports = router