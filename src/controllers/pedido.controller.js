const Pedido = require('../models/Pedido')
const ItemPedido = require('../models/ItemPedido')
const Produto = require('../models/Produto')
const Usuario = require('../models/Usuario')
const Endereco = require('../models/Endereco')
const { criarPagamento } = require('../services/pagamento.service')

const criarPedido = async (req, res) => {
    const { idEndereco, itens, metodoPagamento } = req.body
    const idUsuario = req.user.id // From auth middleware

    console.log('DEBUG: Criando pedido para usuario:', idUsuario, 'endereco:', idEndereco, 'itens:', itens)

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({message: "Dados do pedido incompletos"})
    }

    // Verificar se o endereço pertence ao usuário
    if (idEndereco) {
        const endereco = await Endereco.findOne({ where: { id: idEndereco, idUsuario } })
        if (!endereco) {
            return res.status(400).json({message: "Endereço não encontrado ou não pertence ao usuário"})
        }
    }

    try {
        // Calcular totais
        let valorSubtotal = 0
        const itensComPreco = []
        
        for (const item of itens) {
            const produto = await Produto.findByPk(item.produtoId || item.idProduto)
            if (!produto) {
                return res.status(404).json({message: `Produto ${item.produtoId || item.idProduto} não encontrado`})
            }
            
            if (!produto.ativo) {
                return res.status(400).json({message: `Produto ${produto.nome} não está disponível`})
            }
            
            const precoUnitario = produto.preco
            const valorTotalItem = precoUnitario * item.quantidade
            
            itensComPreco.push({
                ...item,
                idProduto: item.produtoId || item.idProduto,
                precoUnitario,
                valorTotalItem
            })
            
            valorSubtotal += valorTotalItem
        }

        // Calcular frete (exemplo fixo)
        const valorFrete = valorSubtotal > 100 ? 0 : 15.00
        const valorTotal = valorSubtotal + valorFrete

        // Criar pedido
        const pedido = await Pedido.create({
            idUsuario,
            idEndereco,
            valorSubtotal,
            valorFrete,
            valorTotal,
            metodoPagamento,
            status: 'PENDENTE_PAGAMENTO'
        })

        // Criar itens do pedido
        for (const item of itensComPreco) {
            await ItemPedido.create({
                idPedido: pedido.id,
                idProduto: item.idProduto,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
                valorTotalItem: item.valorTotalItem
            })
        }

        // Criar registro de pagamento
        await criarPagamento({
            idPedido: pedido.id,
            valor: valorTotal,
            metodo: metodoPagamento
        })

        // Buscar pedido completo para retornar
        const pedidoCompleto = await Pedido.findByPk(pedido.id, {
            include: [
                { model: Usuario, as: 'usuarioPedido' },
                { model: Endereco, as: 'enderecoEntrega' },
                {
                    model: ItemPedido,
                    as: 'itensPedido',
                    include: [{ model: Produto, as: 'produtoItem' }]
                }
            ]
        })

        res.status(201).json(pedidoCompleto)
    } catch (err) {
        console.error('Erro ao criar pedido', err)
        res.status(500).json({error: 'Erro ao criar pedido', err})
    }
}

const listarPedidosUsuario = async (req, res) => {
    const idUsuario = req.user.id // Do middleware de auth

    try {
        const pedidos = await Pedido.findAll({
            where: { idUsuario },
            include: [
                { model: Endereco, as: 'enderecoEntrega' },
                { 
                    model: ItemPedido, 
                    as: 'itensPedido',
                    include: [{ model: Produto, as: 'produtoItem' }]
                }
            ],
            order: [['dataPedido', 'DESC']]
        })
        
        res.status(200).json(pedidos)
    } catch (err) {
        console.error('Erro ao listar pedidos', err)
        res.status(500).json({error: 'Erro ao listar pedidos', err})
    }
}

const atualizarStatus = async (req, res) => {
    const id = req.params.id
    const { status } = req.body

    const statusValidos = [
        'PENDENTE_PAGAMENTO', 'PROCESSANDO_PAGAMENTO', 'PAGO',
        'SEPARACAO_ESTOQUE', 'ENVIADO', 'ENTREGUE', 'CANCELADO'
    ]

    if (!statusValidos.includes(status)) {
        return res.status(400).json({message: "Status inválido"})
    }

    try {
        const pedido = await Pedido.findByPk(id)
        if (pedido) {
            await Pedido.update({ status }, { where: { id: id } })
            res.status(200).json({message: 'Status atualizado com sucesso'})
        } else {
            res.status(404).json({message: 'Pedido não encontrado'})
        }
    } catch (err) {
        console.error('Erro ao atualizar status', err)
        res.status(500).json({error: 'Erro ao atualizar status', err})
    }
}

const deletarPedido = async (req, res) => {
    const id = req.params.id
    const idUsuario = req.user.id

    try {
        const pedido = await Pedido.findOne({ where: { id: id, idUsuario } })
        if (!pedido) {
            return res.status(404).json({message: 'Pedido não encontrado'})
        }

        // Só permitir deletar se estiver cancelado ou pendente
        if (!['CANCELADO', 'PENDENTE_PAGAMENTO'].includes(pedido.status)) {
            return res.status(400).json({message: 'Não é possível deletar pedidos processados'})
        }

        await pedido.destroy()
        res.status(200).json({message: 'Pedido deletado com sucesso'})
    } catch (err) {
        console.error('Erro ao deletar pedido', err)
        res.status(500).json({error: 'Erro ao deletar pedido', err})
    }
}

module.exports = {
    criarPedido,
    listarPedidosUsuario,
    atualizarStatus,
    deletarPedido
}