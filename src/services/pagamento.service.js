const Pagamento = require('../models/Pagamento')
const Pedido = require('../models/Pedido')

async function criarPagamento({ idPedido, valor, metodo }) {
    if (!idPedido) throw new Error('idPedido é obrigatório')
    if (!valor || valor <= 0) throw new Error('Valor inválido')
    if (!metodo) throw new Error('Método de pagamento é obrigatório')

    const pagamento = await Pagamento.create({ idPedido, valor, metodo, status: 'PENDENTE' })
    return pagamento
}

async function listarPagamentos(idUsuario) {
    return await Pagamento.findAll({
        include: [{
            model: Pedido,
            as: 'pedidoPagamento',
            where: { idUsuario },
            attributes: [] // não incluir campos do pedido
        }],
        order: [['createdAt', 'DESC']]
    })
}

async function atualizarPagamento(id, dados) {
    const pg = await Pagamento.findByPk(id)
    if (!pg) throw new Error('Pagamento não encontrado')

    const camposPermitidos = ['valor', 'metodo', 'status']
    const dadosAtualizados = {}
    for (const campo of camposPermitidos) {
        if (dados[campo] !== undefined) {
            dadosAtualizados[campo] = dados[campo]
        }
    }

    await pg.update(dadosAtualizados)
    return pg
}

async function atualizarPagamentoCompleto(id, dados) {
    const pg = await Pagamento.findByPk(id)
    if (!pg) throw new Error('Pagamento não encontrado')

    await pg.update(dados)
    return pg
}

async function apagarPagamento(id) {
    const pg = await Pagamento.findByPk(id)
    if (!pg) throw new Error('Pagamento não encontrado')

    await pg.destroy()
}

async function atualizarStatusPagamento(id, status) {
    const pg = await Pagamento.findByPk(id)
    if (!pg) throw new Error('Pagamento não encontrado')
    await pg.update({ status })
    return pg
}

async function listarPagamentosPedido(idPedido) {
    return await Pagamento.findAll({ where: { idPedido }, order: [['createdAt', 'ASC']] })
}

module.exports = {
    criarPagamento,
    listarPagamentos,
    atualizarPagamento,
    atualizarPagamentoCompleto,
    apagarPagamento,
    atualizarStatusPagamento,
    listarPagamentosPedido
}
