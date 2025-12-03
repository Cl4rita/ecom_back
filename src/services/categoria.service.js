const CategoriaProduto = require('../models/CategoriaProduto')
const Produto = require('../models/Produto')

async function criarCategoriaProduto(dados) {
    const { nome, descricao, is_ativo } = dados

    if (!nome) throw new Error('O campo nome é obrigatório')

    // Validação do nome - apenas letras, espaços e alguns caracteres especiais
    const nomeRegex = /^[A-Za-zÀ-ÿ0-9\s&.,-]{2,80}$/
    if (!nomeRegex.test(nome)) throw new Error('Nome inválido! Use apenas letras, números e espaços (2-80 caracteres).')

    const existente = await CategoriaProduto.findOne({ where: { nome } })
    if (existente) throw new Error('Já existe uma categoria com este nome')

    const categoria = await CategoriaProduto.create({ nome, descricao, is_ativo: is_ativo !== undefined ? is_ativo : true })
    return categoria
}

async function listarCategoriasProduto() {
    return await CategoriaProduto.findAll({ order: [['nome', 'ASC']] })
}

async function atualizarCategoriaProduto(id, dados) {
    const cat = await CategoriaProduto.findByPk(id)
    if (!cat) throw new Error('Categoria não encontrada')
    await cat.update(dados)
    return cat
}

async function atualizarCategoriaProdutoCompleto(id, dados) {
    const cat = await CategoriaProduto.findByPk(id)
    if (!cat) throw new Error('Categoria não encontrada')
    await cat.update(dados)
    return cat
}

async function apagarCategoriaProduto(id) {
    const cat = await CategoriaProduto.findByPk(id)
    if (!cat) throw new Error('Categoria não encontrada')

    // Verificar se existem produtos vinculados a esta categoria
    const produtosVinculados = await Produto.count({
        where: { idCategoria: id }
    })
    if (produtosVinculados > 0) {
        throw new Error('Não é possível apagar categoria com produtos vinculados')
    }

    await cat.destroy()
    return true
}

module.exports = { criarCategoriaProduto, listarCategoriasProduto, atualizarCategoriaProduto, atualizarCategoriaProdutoCompleto, apagarCategoriaProduto }