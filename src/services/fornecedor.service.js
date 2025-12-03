const Fornecedor = require('../models/Fornecedor')

async function criarFornecedor(dados) {
    const { nomeEmpresa, cnpj } = dados

    if (!nomeEmpresa || !cnpj) {
        throw new Error('Os campos nome da empresa e CNPJ são obrigatórios')
    }

    // Validação básica de CNPJ
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
    if (!cnpjRegex.test(cnpj)) {
        throw new Error('CNPJ inválido! Formato: XX.XXX.XXX/XXXX-XX')
    }

    const fornecedor = await Fornecedor.create(dados)
    return fornecedor
}

async function listarFornecedores() {
    return await Fornecedor.findAll({ order: [['nomeEmpresa', 'ASC']] })
}

async function atualizarFornecedor(id, dados) {
    const f = await Fornecedor.findByPk(id)
    if (!f) throw new Error('Fornecedor não encontrado')
    await f.update(dados)
    return f
}

async function atualizarFornecedorCompleto(id, dados) {
    const f = await Fornecedor.findByPk(id)
    if (!f) throw new Error('Fornecedor não encontrado')
    await f.update(dados)
    return f
}

async function apagarFornecedor(id) {
    const f = await Fornecedor.findByPk(id)
    if (!f) throw new Error('Fornecedor não encontrado')
    await f.destroy()
    return true
}

module.exports = { criarFornecedor, listarFornecedores, atualizarFornecedor, atualizarFornecedorCompleto, apagarFornecedor }
