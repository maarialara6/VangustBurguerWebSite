const VangustDB = (() => {
    const CHAVE_STORAGE = 'vangust_admin_db_v1';

    function dadosIniciais() {
        return {
            usuarioAdmin: {
                id_usuario: 1,
                nome: 'Gustavo Freire',
                email: 'admin@vangustburguer.com',
                senha: 'admin123', // apenas para o protótipo em memória; no backend real, NUNCA em texto puro
                foto: null, // string base64 da imagem, quando definida pelo usuário
                data_cadastro: '2022-04-16T00:00:00.000Z',
            },
            clientes: [
                { id_cliente: 1, nome: 'João Pedro Alves', email: 'joao@email.com', telefone: '(11) 99999-0001' },
                { id_cliente: 2, nome: 'Ana Beatriz Souza', email: 'ana@email.com', telefone: '(11) 99999-0002' },
            ],
            enderecos: [
                { id_endereco: 1, id_cliente: 1, rua: 'Rua das Palmeiras', numero: '120', bairro: 'Vila Nova', cep: '04567-000', complemento: 'Apto 21' },
                { id_endereco: 2, id_cliente: 2, rua: 'Av. Brasil', numero: '900', bairro: 'Centro', cep: '01234-000', complemento: '' },
            ],
            produtos: [
                { id_produto: 1, nome: 'Brutão na Chapa', descricao: 'Hambúrguer 180g, cheddar derretido, bacon crocante', preco: 34.90, categoria: 'Combos', estoque: 40, ativo: 1 },
                { id_produto: 2, nome: 'Frango Brabo', descricao: 'Peito de frango grelhado, molho especial, alface e tomate', preco: 27.90, categoria: 'Ofertas', estoque: 35, ativo: 1 },
                { id_produto: 3, nome: 'Gelar na Chama', descricao: 'Blend artesanal, queijo prato, molho barbecue defumado', preco: 31.90, categoria: 'Ofertas', estoque: 30, ativo: 1 },
                { id_produto: 4, nome: 'Chapa do Cheddar', descricao: 'Duplo cheddar, cebola caramelizada, molho da casa', preco: 32.90, categoria: 'Opções de carne', estoque: 25, ativo: 1 },
                { id_produto: 5, nome: 'Combo Bacon Cheese', descricao: 'Hambúrguer bacon cheese + batata + refrigerante', preco: 29.90, categoria: 'Combos', estoque: 50, ativo: 1 },
                { id_produto: 6, nome: 'Veggie da Horta', descricao: 'Hambúrguer de grão de bico, alface, tomate e molho vegano', preco: 28.90, categoria: 'Opções veganas', estoque: 20, ativo: 1 },
            ],
            entregadores: [
                { id_entregador: 1, nome: 'Marcos Lima', telefone: '(11) 98888-1111', veiculo: 'Moto', ativo: 1 },
                { id_entregador: 2, nome: 'Bruna Castro', telefone: '(11) 98888-2222', veiculo: 'Bicicleta', ativo: 1 },
            ],
            pedidos: [
                { id_pedido: 1, id_cliente: 1, id_entregador: 1, data_pedido: diasAtras(0), valor_total: 62.80, status: 'saiu_entrega', observacao: 'Sem cebola no lanche' },
                { id_pedido: 2, id_cliente: 2, id_entregador: null, data_pedido: diasAtras(0), valor_total: 34.90, status: 'recebido', observacao: '' },
                { id_pedido: 3, id_cliente: 1, id_entregador: 2, data_pedido: diasAtras(1), valor_total: 29.90, status: 'entregue', observacao: '' },
                { id_pedido: 4, id_cliente: 2, id_entregador: 1, data_pedido: diasAtras(2), valor_total: 66.80, status: 'entregue', observacao: '' },
                { id_pedido: 5, id_cliente: 1, id_entregador: null, data_pedido: diasAtras(3), valor_total: 32.90, status: 'cancelado', observacao: 'Cliente desistiu' },
            ],
            itensPedido: [
                { id_item: 1, id_pedido: 1, id_produto: 1, quantidade: 1, preco_unitario: 34.90, subtotal: 34.90 },
                { id_item: 2, id_pedido: 1, id_produto: 2, quantidade: 1, preco_unitario: 27.90, subtotal: 27.90 },
                { id_item: 3, id_pedido: 2, id_produto: 1, quantidade: 1, preco_unitario: 34.90, subtotal: 34.90 },
                { id_item: 4, id_pedido: 3, id_produto: 5, quantidade: 1, preco_unitario: 29.90, subtotal: 29.90 },
                { id_item: 5, id_pedido: 4, id_produto: 1, quantidade: 1, preco_unitario: 34.90, subtotal: 34.90 },
                { id_item: 6, id_pedido: 4, id_produto: 2, quantidade: 1, preco_unitario: 27.90, subtotal: 27.90 },
                { id_item: 7, id_pedido: 5, id_produto: 4, quantidade: 1, preco_unitario: 32.90, subtotal: 32.90 },
            ],
            pagamentos: [
                { id_pagamento: 1, id_pedido: 1, id_cliente: 1, tipo_pagamento: 'pix', valor: 62.80, status_pagamento: 'aprovado' },
                { id_pagamento: 2, id_pedido: 2, id_cliente: 2, tipo_pagamento: 'cartao_credito', valor: 34.90, status_pagamento: 'pendente' },
                { id_pagamento: 3, id_pedido: 3, id_cliente: 1, tipo_pagamento: 'dinheiro', valor: 29.90, status_pagamento: 'aprovado' },
            ],
        };
    }

    function diasAtras(n) {
        const d = new Date();
        d.setDate(d.getDate() - n);
        return d.toISOString();
    }

    function migrar(db) {
        let alterado = false;
        if (db.usuarioAdmin.foto === undefined) {
            db.usuarioAdmin.foto = null;
            alterado = true;
        }
        if (!db.usuarioAdmin.data_cadastro) {
            db.usuarioAdmin.data_cadastro = '2022-04-16T00:00:00.000Z';
            alterado = true;
        }
        if (alterado) salvar(db);
        return db;
    }

    function carregar() {
        const bruto = localStorage.getItem(CHAVE_STORAGE);
        if (!bruto) {
            const inicial = dadosIniciais();
            salvar(inicial);
            return inicial;
        }
        try {
            return migrar(JSON.parse(bruto));
        } catch (e) {
            const inicial = dadosIniciais();
            salvar(inicial);
            return inicial;
        }
    }

    function salvar(dados) {
        localStorage.setItem(CHAVE_STORAGE, JSON.stringify(dados));
    }

    function proximoId(lista, campoId) {
        return lista.reduce((max, item) => Math.max(max, item[campoId] || 0), 0) + 1;
    }

    return {
        // ---------- Autenticação ----------
        autenticar(email, senha) {
            const db = carregar();
            return db.usuarioAdmin.email === email && db.usuarioAdmin.senha === senha ? db.usuarioAdmin : null;
        },
        getUsuarioAdmin() {
            return carregar().usuarioAdmin;
        },
        atualizarUsuarioAdmin(dados) {
            const db = carregar();
            db.usuarioAdmin = { ...db.usuarioAdmin, ...dados };
            salvar(db);
            return db.usuarioAdmin;
        },

        // ---------- Produtos ----------
        listarProdutos() {
            return carregar().produtos.slice().sort((a, b) => a.categoria.localeCompare(b.categoria) || a.nome.localeCompare(b.nome));
        },
        salvarProduto(produto) {
            const db = carregar();
            if (produto.id_produto) {
                const idx = db.produtos.findIndex(p => p.id_produto == produto.id_produto);
                db.produtos[idx] = { ...db.produtos[idx], ...produto };
            } else {
                produto.id_produto = proximoId(db.produtos, 'id_produto');
                produto.ativo = 1;
                db.produtos.push(produto);
            }
            salvar(db);
        },
        excluirProduto(id) {
            const db = carregar();
            db.produtos = db.produtos.filter(p => p.id_produto != id);
            salvar(db);
        },
        toggleProdutoAtivo(id) {
            const db = carregar();
            const p = db.produtos.find(p => p.id_produto == id);
            if (p) p.ativo = p.ativo ? 0 : 1;
            salvar(db);
        },

        // ---------- Entregadores ----------
        listarEntregadores() {
            const db = carregar();
            return db.entregadores.map(e => ({
                ...e,
                entregas_ativas: db.pedidos.filter(p => p.id_entregador == e.id_entregador && p.status === 'saiu_entrega').length,
            }));
        },
        salvarEntregador(entregador) {
            const db = carregar();
            if (entregador.id_entregador) {
                const idx = db.entregadores.findIndex(e => e.id_entregador == entregador.id_entregador);
                db.entregadores[idx] = { ...db.entregadores[idx], ...entregador };
            } else {
                entregador.id_entregador = proximoId(db.entregadores, 'id_entregador');
                entregador.ativo = 1;
                db.entregadores.push(entregador);
            }
            salvar(db);
        },
        toggleEntregadorAtivo(id) {
            const db = carregar();
            const e = db.entregadores.find(e => e.id_entregador == id);
            if (e) e.ativo = e.ativo ? 0 : 1;
            salvar(db);
        },

        // ---------- Clientes ----------
        listarClientesComResumo() {
            const db = carregar();
            return db.clientes.map(c => {
                const pedidosCliente = db.pedidos.filter(p => p.id_cliente == c.id_cliente);
                const totalGasto = pedidosCliente
                    .filter(p => p.status !== 'cancelado')
                    .reduce((soma, p) => soma + p.valor_total, 0);
                return { ...c, total_pedidos: pedidosCliente.length, total_gasto: totalGasto };
            }).sort((a, b) => a.nome.localeCompare(b.nome));
        },

        // ---------- Pedidos ----------
        listarPedidosDetalhados(filtroStatus = '') {
            const db = carregar();
            return db.pedidos
                .filter(p => !filtroStatus || p.status === filtroStatus)
                .sort((a, b) => new Date(b.data_pedido) - new Date(a.data_pedido))
                .map(p => {
                    const cliente = db.clientes.find(c => c.id_cliente == p.id_cliente);
                    const entregador = db.entregadores.find(e => e.id_entregador == p.id_entregador);
                    const itens = db.itensPedido
                        .filter(i => i.id_pedido == p.id_pedido)
                        .map(i => ({ ...i, nome_produto: db.produtos.find(pr => pr.id_produto == i.id_produto)?.nome || '—' }));
                    return {
                        ...p,
                        cliente_nome: cliente?.nome || '—',
                        cliente_telefone: cliente?.telefone || '—',
                        entregador_nome: entregador?.nome || null,
                        itens,
                    };
                });
        },
        atualizarStatusPedido(idPedido, novoStatus) {
            const db = carregar();
            const pedido = db.pedidos.find(p => p.id_pedido == idPedido);
            if (pedido) pedido.status = novoStatus;
            salvar(db);
        },

        // ---------- Dashboard ----------
        getEstatisticasDashboard() {
            const db = carregar();
            const hoje = new Date().toDateString();
            const totalProdutosAtivos = db.produtos.filter(p => p.ativo).length;
            const totalClientes = db.clientes.length;
            const pedidosHoje = db.pedidos.filter(p => new Date(p.data_pedido).toDateString() === hoje).length;
            const receitaTotal = db.pedidos
                .filter(p => p.status !== 'cancelado')
                .reduce((soma, p) => soma + p.valor_total, 0);

            const statusCount = {};
            ['recebido', 'em_preparo', 'saiu_entrega', 'entregue', 'cancelado'].forEach(s => statusCount[s] = 0);
            db.pedidos.forEach(p => statusCount[p.status] = (statusCount[p.status] || 0) + 1);

            // Receita dos últimos 7 dias
            const labels = [];
            const valores = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const diaStr = d.toDateString();
                labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
                const totalDia = db.pedidos
                    .filter(p => p.status !== 'cancelado' && new Date(p.data_pedido).toDateString() === diaStr)
                    .reduce((soma, p) => soma + p.valor_total, 0);
                valores.push(totalDia);
            }

            const pedidosRecentes = db.pedidos
                .slice()
                .sort((a, b) => new Date(b.data_pedido) - new Date(a.data_pedido))
                .slice(0, 6)
                .map(p => ({ ...p, cliente_nome: db.clientes.find(c => c.id_cliente == p.id_cliente)?.nome || '—' }));

            return { totalProdutosAtivos, totalClientes, pedidosHoje, receitaTotal, statusCount, labels, valores, pedidosRecentes };
        },

        // ---------- Utilitário (botão "resetar dados de exemplo") ----------
        resetar() {
            salvar(dadosIniciais());
        },
    };
})();