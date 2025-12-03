const CategoriaProduto = require('../models/CategoriaProduto')

async function cadastrar(dados) {
    const { nome, descricao, is_ativo } = dados

    if (!nome) throw new Error('Nome é obrigatório')

    const existente = await CategoriaProduto.findOne({ where: { nome } })
    if (existente) throw new Error('Categoria já existe')

    const categoria = await CategoriaProduto.create({ nome, descricao, is_ativo: is_ativo !== undefined ? is_ativo : true })
    return categoria
}

async function listar() {
    return await CategoriaProduto.findAll({ order: [['nome', 'ASC']] })
}

async function atualizar(id, dados) {
    const cat = await CategoriaProduto.findByPk(id)
    if (!cat) throw new Error('Categoria não encontrada')
    await cat.update(dados)
    return cat
}

async function apagar(id) {
    const cat = await CategoriaProduto.findByPk(id)
    if (!cat) throw new Error('Categoria não encontrada')
    await cat.destroy()
    return true
}

module.exports = { cadastrar, listar, atualizar, apagar }