const ProdutoFornecedor = require('../models/ProdutoFornecedor')
const Produto = require('../models/Produto')
const Fornecedor = require('../models/Fornecedor')

async function criarProdutoFornecedor(dados) {

    const { idProduto, idFornecedor, custoUnitarioAtual, codigoReferencia } = dados

    // Validações simples antes de salvar
    if (!idProduto || !idFornecedor) {
        throw new Error('ID do produto e ID do fornecedor são obrigatórios')
    }

    try {
        const produto = await Produto.findByPk(idProduto)
        if (!produto) {
            throw new Error('Produto não encontrada')
        }
        const fornecedor = await Fornecedor.findByPk(idFornecedor)
        if (!fornecedor) {
            throw new Error('Fornecedor não encontrada')
        }

        const novoProdutoFornecedor = await ProdutoFornecedor.create({
            idProduto,
            idFornecedor,
            custoUnitarioAtual,
            codigoReferencia
        })
    
        return novoProdutoFornecedor
    } catch (err) {
        console.error('Erro ao verificar produtoFornecedor:', err)
    }
}

async function listarProdutosFornecedor() {
    const produtosFornecedor = await ProdutoFornecedor.findAll()
    return produtosFornecedor
}

async function atualizarProdutoFornecedor(id, dados) {

    // Buscar o produtoFornecedor no banco
    const produtoFornecedor = await ProdutoFornecedor.findByPk(id)

    if (!produtoFornecedor) {
        throw new Error('Relação produto-fornecedor não encontrada')
    }

    // Atualizar apenas os campos enviados
    await produtoFornecedor.update(dados)

    return produtoFornecedor

}

async function atualizarProdutoFornecedorCompleto(id, dados) {

    const produtoFornecedor = await ProdutoFornecedor.findByPk(id)

    if (!produtoFornecedor) {
        throw new Error('Relação produto-fornecedor não encontrada')
    }

    const { idProduto, idFornecedor, custoUnitarioAtual, codigoReferencia } = dados

    // Validações básicas
    if (!idProduto || !idFornecedor) {
        throw new Error('ID do produto e ID do fornecedor são obrigatórios')
    }

    await produtoFornecedor.update({
        idProduto,
        idFornecedor,
        custoUnitarioAtual,
        codigoReferencia
    })

    return produtoFornecedor
}

async function apagarProdutoFornecedor(id) {

    const produtoFornecedor = await ProdutoFornecedor.findByPk(id)

    if (!produtoFornecedor) {
        throw new Error('Relação produto-fornecedor não encontrada')
    }

    await produtoFornecedor.destroy()

    return true
}


module.exports = { criarProdutoFornecedor, listarProdutosFornecedor, 
    atualizarProdutoFornecedor, atualizarProdutoFornecedorCompleto, apagarProdutoFornecedor }