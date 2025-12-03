const express = require('express')
const router = express.Router()

const fornecedorController = require('../controllers/fornecedor.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// POST /fornecedores - Cadastrar fornecedor
router.post(
    '/',
    authMiddleware,
    isAdminMiddleware,
    fornecedorController.criar
)

// GET /fornecedores - Listar fornecedores
router.get(
    '/',
    authMiddleware,
    isAdminMiddleware,
    fornecedorController.listar
)

// PUT /fornecedores/:id - Atualizar fornecedor
router.put(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    fornecedorController.atualizarCompleto
)

// Patch /fornecedores/:id - Atualizar fornecedor parcial
router.patch(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    fornecedorController.atualizar
)

// DELETE /fornecedores/:id - Apagar fornecedor
router.delete(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    fornecedorController.apagar
)

module.exports = router