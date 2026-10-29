VangustAuth.exigirLogin();
    VangustLayout.montar('dashboard.html');

    const usuarioLogado = VangustAuth.getUsuarioLogado();
    if (usuarioLogado && document.getElementById('saudacao')) {
        document.getElementById('saudacao').textContent = `Olá, ${usuarioLogado.nome} !`;
    }

    // Definição dinâmica do URL da API para suportar localhost e Locaweb
    const API_BASE = window.location.hostname === 'localhost' 
        ? 'http://localhost/api_hamburgueria/' 
        : window.location.origin + '/api_hamburgueria/';

    let meuGrafico = null;

    async function carregarDashboard() {
        try {
            const resposta = await fetch(API_BASE + 'estatisticas.php');
            const dados = await resposta.json();

            if (resposta.ok && dados.sucesso) {
                document.getElementById('statProdutos').textContent = dados.total_produtos;
                document.getElementById('statReceita').textContent = 'R$ ' + dados.faturamento.toFixed(2).replace('.', ',');
                document.getElementById('statPedidosHoje').textContent = dados.total_pedidos;
                document.getElementById('statClientes').textContent = dados.total_clientes;

                const tbody = document.getElementById('tbodyPedidosRecentes');
                if (dados.pedidos_recentes && dados.pedidos_recentes.length > 0) {
                    tbody.innerHTML = dados.pedidos_recentes.map(p => `
                        <tr>
                            <td>#${p.id_pedido}</td>
                            <td>${p.nome_cliente}</td>
                            <td>R$ ${parseFloat(p.valor_total_pedido).toFixed(2).replace('.', ',')}</td>
                            <td><span class="badge badge-entregue">${p.status_pedido}</span></td>
                            <td>${p.criado_em}</td>
                        </tr>
                    `).join('');
                } else {
                    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum pedido recente encontrado.</td></tr>';
                }

                const divStatus = document.getElementById('listaStatus');
                if (dados.pedidos_por_status && dados.pedidos_por_status.length > 0) {
                    divStatus.innerHTML = dados.pedidos_por_status.map(s => `
                        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span><strong>${s.status_pedido}</strong></span>
                            <span class="badge badge-entregue">${s.total} pedido(s)</span>
                        </div>
                    `).join('');
                } else {
                    divStatus.innerHTML = '<p style="color: #777; text-align: center; padding: 15px;">Nenhum status registado.</p>';
                }

                const ctx = document.getElementById('graficoReceita').getContext('2d');
                const labels = dados.grafico_receita.map(item => item.data);
                const valores = dados.grafico_receita.map(item => item.total);

                if (meuGrafico) meuGrafico.destroy();

                meuGrafico = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels.length ? labels : ['Sem dados'],
                        datasets: [{
                            label: 'Receita (R$)',
                            data: valores.length ? valores : [0],
                            borderColor: '#e67e22',
                            backgroundColor: 'rgba(230, 126, 34, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.3
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { display: false } }
                    }
                });

            } else {
                console.error("Erro ao carregar dados do dashboard");
            }
        } catch (erro) {
            console.error("Erro de conexão com a API de estatísticas:", erro);
        }
    }

    carregarDashboard();