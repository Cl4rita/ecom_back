const express = require('express')
const router = express.Router()

const categoriaController = require('../controllers/categoriaProd.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isAdminMiddleware = require('../middlewares/isAdmin.middleware')

// POST /categorias - Criar categoria (apenas admin)
router.post(
    '/',
    authMiddleware,
    isAdminMiddleware,
    categoriaController.cadastrar
)

// GET /categorias - Listar todas categorias
router.get(
    '/',
    authMiddleware,
    categoriaController.listar
)

// PUT /categorias/:id - Atualizar categoria
router.put(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    categoriaController.atualizar
)

// DELETE /categorias/:id - Deletar categoria
router.delete(
    '/:id',
    authMiddleware,
    isAdminMiddleware,
    categoriaController.apagar
)

module.exports = router