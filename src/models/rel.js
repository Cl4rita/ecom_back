const Usuario = require('./Usuario')
const Pedido = require('./Pedido')
const Produto = require('./Produto')
const ItemPedido = require('./ItemPedido')
const Endereco = require('./Endereco')
const Estoque = require('./Estoque')
const Pagamento = require('./Pagamento')
const CategoriaProduto = require('./CategoriaProduto')
const Fornecedor = require('./Fornecedor')
const ProdutoFornecedor = require('./ProdutoFornecedor')


// -------------------------------------------------------------------------
// 1. RELACIONAMENTOS USUÁRIO & ENDEREÇO
// -------------------------------------------------------------------------

// USUÁRIO <-> PEDIDO (1:N)
Usuario.hasMany(Pedido, { 
    foreignKey: 'idUsuario', 
    as: 'pedidosUsuario', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
})

Pedido.belongsTo(Usuario, { 
    foreignKey: 'idUsuario', 
    as: 'usuarioPedido' 
})

// USUÁRIO <-> ENDEREÇO (1:N)
Usuario.hasMany(Endereco, { 
    foreignKey: 'idUsuario', 
    as: 'enderecosUsuario', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
})

Endereco.belongsTo(Usuario, { 
    foreignKey: 'idUsuario', 
    as: 'usuarioEndereco' 
})


// -------------------------------------------------------------------------
// 2. RELACIONAMENTOS PEDIDO & ENTREGA & ENDEREÇO & PAGAMENTO
// -------------------------------------------------------------------------

// PEDIDO <-> ENDEREÇO (N:1) 
Endereco.hasMany(Pedido, { 
    foreignKey: 'idEndereco', 
    as: 'pedidosNoEndereco', 
    onDelete: 'SET NULL', 
    onUpdate: 'CASCADE' 
})

Pedido.belongsTo(Endereco, { 
    foreignKey: 'idEndereco', 
    as: 'enderecoEntrega', 
    onDelete: 'SET NULL', 
    onUpdate: 'CASCADE' 
})

// PEDIDO <-> ITEM_PEDIDO (1:N)
Pedido.hasMany(ItemPedido, { 
    foreignKey: 'idPedido', 
    as: 'itensPedido', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
})

ItemPedido.belongsTo(Pedido, { 
    foreignKey: 'idPedido', 
    as: 'pedidoItem' 
})

// PEDIDO <-> PAGAMENTO (1:N) - Recebimento do cliente
Pedido.hasMany(Pagamento, {
    foreignKey: 'idPedido',
    as: 'pagamentosDoPedido',
    onDelete: 'SET NULL', 
    onUpdate: 'CASCADE'
})

Pagamento.belongsTo(Pedido, { 
    foreignKey: 'idPedido', 
    as: 'pedidoPagamento' 
})


// -------------------------------------------------------------------------
// 3. RELACIONAMENTOS PRODUTO & CATEGORIA & ESTOQUE
// -------------------------------------------------------------------------

// PRODUTO <-> CATEGORIA (N:1)
CategoriaProduto.hasMany(Produto, {
    foreignKey: 'idCategoria',
    as: 'produtosDaCategoria',
    onDelete: 'CASCADE', // Se a Categoria for deletada, o produto fica sem
    onUpdate: 'CASCADE'
})

// ATENÇÃO: É necessário adicionar idCategoria no modelo Produto.js
// Produto.js deve ter: idCategoria
Produto.belongsTo(CategoriaProduto, {
    foreignKey: 'idCategoria',
    as: 'categoriaProduto',
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE'
})

// PRODUTO <-> ITEM_PEDIDO (1:N - Vendas)
Produto.hasMany(ItemPedido, { 
    foreignKey: 'idProduto', 
    as: 'itensProduto', 
    onDelete: 'RESTRICT', 
    onUpdate: 'CASCADE' 
})

ItemPedido.belongsTo(Produto, { 
    foreignKey: 'idProduto', 
    as: 'produtoItem' 
})

// PRODUTO <-> ESTOQUE (1:1)
Produto.hasOne(Estoque, { 
    foreignKey: 'idProduto', 
    as: 'estoqueProduto', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' 
})

Estoque.belongsTo(Produto, { 
    foreignKey: 'idProduto', 
    as: 'produtoEstoque' 
})


// -------------------------------------------------------------------------
// 4. RELACIONAMENTOS PRODUTO <-> FORNECEDOR (N:N)
// -------------------------------------------------------------------------

// PRODUTO <-> PRODUTOFORNECEDOR (1:N)
Produto.hasMany(ProdutoFornecedor, {
    foreignKey: 'idProduto',
    as: 'fornecedoresDoProduto',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

ProdutoFornecedor.belongsTo(Produto, {
    foreignKey: 'idProduto',
    as: 'produtoNoFornecedor'
})

// FORNECEDOR <-> PRODUTOFORNECEDOR (1:N)
Fornecedor.hasMany(ProdutoFornecedor, {
    foreignKey: 'idFornecedor',
    as: 'produtosDoFornecedor',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

ProdutoFornecedor.belongsTo(Fornecedor, {
    foreignKey: 'idFornecedor',
    as: 'fornecedorDoProduto'
})

module.exports = { 
    Usuario, 
    Pedido, 
    Produto, 
    ItemPedido,
    Endereco, 
    Estoque,
    Pagamento,
    CategoriaProduto,
    Fornecedor,
    ProdutoFornecedor
}

/* Explicações de:

onDelete: 'SET NULL' => “Se o registro pai for deletado, o campo FK no filho vira NULL (não apaga o filho).”

Se o endereço for apagado (usuário mudou de casa, por exemplo), o pedido não é apagado — apenas o campo 
idEndereco dentro de Pedido fica NULL. Isso faz sentido porque o pedido é histórico (já aconteceu), e 
você não quer perder o registro da venda só porque o endereço foi removido.

onDelete: 'RESTRICT' => “Bloqueie a exclusão do registro pai se ele tiver filhos.”

Se um produto já foi vendido (tem registros em ItemPedido), você não pode 
simplesmente apagá-lo, porque quebraria o histórico de vendas. Ideal para 
auditoria e consistência comercial — você pode desativar o produto (campo ativo: false), 
mas não deletar fisicamente.

*/