VangustAuth.exigirLogin();
    VangustLayout.montar('cupons.html');

    const API_BASE = window.location.hostname === 'localhost' 
        ? 'http://localhost/api_hamburgueria/' 
        : window.location.origin + '/api_hamburgueria/';

    async function renderizarCupons() {
        const tbody = document.getElementById('tbodyCupons');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">A carregar cupons...</td></tr>';

        try {
            const resposta = await fetch(API_BASE + 'listar_cupons_admin.php');
            const resultado = await resposta.json();
            const cupons = resultado.cupons || [];

            tbody.innerHTML = cupons.length ? cupons.map(c => `
                <tr>
                    <td><strong>${c.codigo_cupom}</strong></td>
                    <td>${c.descricao_cupom || ''}</td>
                    <td>${c.valor_desconto < 1 ? (c.valor_desconto * 100) + '%' : 'R$ ' + parseFloat(c.valor_desconto).toFixed(2).replace('.', ',')}</td>
                    <td>${c.data_validade}</td>
                    <td>
                        <span class="badge ${c.status_cupom == 1 ? 'badge-entregue' : 'badge-cancelado'}">
                            ${c.status_cupom == 1 ? 'Ativo' : 'Inativo'}
                        </span>
                    </td>
                    <td style="white-space:nowrap;">
                        <button class="btn btn-outline btn-sm" onclick='abrirModalEditar(${JSON.stringify(c)})'><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="excluirCupom(${c.id_cupom})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('') : `<tr><td colspan="6" class="empty-state">Nenhum cupom cadastrado ainda.</td></tr>`;
        } catch (erro) {
            console.error("Erro ao carregar cupons:", erro);
            tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Erro ao ligar à base de dados.</td></tr>`;
        }
    }

    function abrirModalNovo() {
        document.getElementById('modalTitulo').textContent = 'Novo cupom';
        document.getElementById('f_id_cupom').value = '';
        document.getElementById('f_codigo').value = '';
        document.getElementById('f_descricao').value = '';
        document.getElementById('f_valor').value = '';
        document.getElementById('f_validade').value = '';
        document.getElementById('f_status').value = '1';
        document.getElementById('modalCupom').classList.add('active');
    }

    function abrirModalEditar(c) {
        document.getElementById('modalTitulo').textContent = 'Editar cupom';
        document.getElementById('f_id_cupom').value = c.id_cupom;
        document.getElementById('f_codigo').value = c.codigo_cupom;
        document.getElementById('f_descricao').value = c.descricao_cupom;
        document.getElementById('f_valor').value = c.valor_desconto;
        document.getElementById('f_validade').value = c.data_validade;
        document.getElementById('f_status').value = c.status_cupom;
        document.getElementById('modalCupom').classList.add('active');
    }

    function fecharModal() {
        document.getElementById('modalCupom').classList.remove('active');
    }

    document.getElementById('formCupom').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData();
        const id = document.getElementById('f_id_cupom').value;
        if (id) formData.append('id_cupom', id);

        formData.append('codigo_cupom', document.getElementById('f_codigo').value.trim().toUpperCase());
        formData.append('descricao_cupom', document.getElementById('f_descricao').value.trim());
        formData.append('valor_desconto', document.getElementById('f_valor').value);
        formData.append('data_validade', document.getElementById('f_validade').value);
        formData.append('status_cupom', document.getElementById('f_status').value);

        try {
            const resposta = await fetch(API_BASE + 'salvar_cupom.php', {
                method: 'POST',
                body: formData
            });
            const resultado = await resposta.json();

            if (resposta.ok && resultado.sucesso) {
                fecharModal();
                if (typeof mostrarToast === 'function') mostrarToast(resultado.mensagem);
                renderizarCupons();
            } else {
                alert('Erro ao salvar: ' + (resultado.erro || 'Erro desconhecido'));
            }
        } catch (erro) {
            alert('Erro de conexão com a API.');
            console.error(erro);
        }
    });

    async function excluirCupom(id) {
        if (!confirm('Tem certeza de que deseja excluir este cupom?')) return;

        const formData = new FormData();
        formData.append('id_cupom', id);

        try {
            const resposta = await fetch(API_BASE + 'excluir_cupom.php', {
                method: 'POST',
                body: formData
            });
            const resultado = await resposta.json();

            if (resposta.ok && resultado.sucesso) {
                if (typeof mostrarToast === 'function') mostrarToast(resultado.mensagem);
                renderizarCupons();
            } else {
                alert('Erro ao excluir: ' + (resultado.erro || 'Erro desconhecido'));
            }
        } catch (erro) {
            alert('Erro ao conectar com a API.');
            console.error(erro);
        }
    }

    renderizarCupons();