const Produto = require('../models/Produto')
const Estoque = require('../models/Estoque')

async function criarProduto(dados) {

    const { nome, idCategoria, descricao, modelo, preco, imagem_url, ativo } = dados

    // Validações simples antes de salvar
    if (!nome || !modelo || !preco) {
        throw new Error('Nome, modelo e preço são obrigatórios')
    }

    console.log('DEBUG: Criando produto com dados:', { nome, idCategoria, modelo, preco })

    const novoProduto = await Produto.create({
        nome,
        idCategoria,
        descricao,
        modelo,
        preco,
        imagem_url,
        ativo
    })

    console.log('DEBUG: Produto criado com ID:', novoProduto.id)

    // Criar entrada no estoque automaticamente
    console.log('DEBUG: Criando entrada no estoque para produto ID:', novoProduto.id)

    try {
        await Estoque.create({
            idProduto: novoProduto.id,
            quantidade: 0, // Inicia com quantidade 0
            movimentacao: 0
        })
        console.log('DEBUG: Entrada no estoque criada com sucesso')
    } catch (estoqueError) {
        console.error('DEBUG: Erro ao criar entrada no estoque:', estoqueError.message)
        // Não lançar erro para não impedir criação do produto, mas logar
    }

    return novoProduto
}

async function listarProdutos() {
    const produtos = await Produto.findAll()
    console.log('DEBUG: Produtos encontrados no DB:', produtos.length)
    return produtos
}

async function atualizarProduto(id, dados) {

    // Buscar o produto no banco
    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    // Atualizar apenas os campos enviados
    await produto.update(dados)

    return produto

}

async function atualizarProdutoCompleto(id, dados) {

    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    const { nome, idCategoria, descricao, modelo, preco, imagem_url, ativo } = dados

    // Validações básicas
    if (!nome || !modelo || !preco) {
        throw new Error('Nome, modelo e preço são obrigatórios')
    }

    await produto.update({
        nome,
        idCategoria,
        descricao,
        modelo,
        preco,
        imagem_url,
        ativo
    })

    return produto
}

async function apagarProduto(id) {

    const produto = await Produto.findByPk(id)

    if (!produto) {
        throw new Error('Produto não encontrado')
    }

    await produto.destroy()

    return true
}


module.exports = { criarProduto, listarProdutos, 
    atualizarProduto, atualizarProdutoCompleto, apagarProduto }