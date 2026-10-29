    VangustAuth.exigirLogin();
    VangustLayout.montar('entregadores.html');

    // Definição dinâmica do URL da API para suportar localhost e Locaweb
    const API_BASE = window.location.hostname === 'localhost' 
        ? 'http://localhost/api_hamburgueria/' 
        : window.location.origin + '/api_hamburgueria/';

    async function renderizarEntregadores() {
        const tbody = document.getElementById('tbodyEntregadores');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">A carregar entregadores...</td></tr>';

        try {
            const resposta = await fetch(API_BASE + 'listar_entregadores.php');
            const entregadores = await resposta.json();

            tbody.innerHTML = entregadores.length ? entregadores.map(e => `
                <tr>
                    <td>
                        <strong>${e.nome}</strong>
                    </td>
                    <td>${e.telefone || 'Não informado'}</td>
                    <td>${e.veiculo || 'Não informado'}</td>
                    <td>
                        <span class="badge ${e.ativo == 1 ? 'badge-entregue' : 'badge-cancelado'}">
                            ${e.ativo == 1 ? 'Ativo' : 'Inativo'}
                        </span>
                    </td>
                    <td style="white-space:nowrap;">
                        <button class="btn btn-outline btn-sm" onclick='abrirModalEditar(${JSON.stringify(e)})'><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="excluirEntregador(${e.id_entregador})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('') : `<tr><td colspan="5" class="empty-state">Nenhum entregador cadastrado ainda.</td></tr>`;
        } catch (erro) {
            console.error("Erro ao carregar entregadores:", erro);
            tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Erro ao ligar à base de dados.</td></tr>`;
        }
    }

    function abrirModalNovo() {
        document.getElementById('modalTitulo').textContent = 'Novo entregador';
        document.getElementById('f_id').value = '';
        document.getElementById('f_nome').value = '';
        document.getElementById('f_telefone').value = '';
        document.getElementById('f_veiculo').value = '';
        document.getElementById('modalEntregador').classList.add('active');
    }

    function abrirModalEditar(e) {
        document.getElementById('modalTitulo').textContent = 'Editar entregador';
        document.getElementById('f_id').value = e.id_entregador;
        document.getElementById('f_nome').value = e.nome;
        document.getElementById('f_telefone').value = e.telefone || '';
        document.getElementById('f_veiculo').value = e.veiculo || '';
        document.getElementById('modalEntregador').classList.add('active');
    }

    function fecharModal() {
        document.getElementById('modalEntregador').classList.remove('active');
    }

    document.getElementById('formEntregador').addEventListener('submit', async function (event) {
        event.preventDefault();

        const id = document.getElementById('f_id').value;
        const nome = document.getElementById('f_nome').value.trim();
        const telefone = document.getElementById('f_telefone').value.trim();
        const veiculo = document.getElementById('f_veiculo').value.trim();

        const formData = new FormData();
        if (id) formData.append('id_entregador', id);
        formData.append('nome', nome);
        formData.append('telefone', telefone);
        formData.append('veiculo', veiculo);
        formData.append('ativo', 1);

        try {
            const resposta = await fetch(API_BASE + 'salvar_entregador.php', {
                method: 'POST',
                body: formData
            });

            const resultado = await resposta.json();

            if (resposta.ok && resultado.sucesso) {
                fecharModal();
                mostrarToast(resultado.mensagem);
                renderizarEntregadores();
            } else {
                alert('Erro ao salvar: ' + (resultado.erro || 'Erro desconhecido'));
            }
        } catch (erro) {
            alert('Erro de conexão com a API.');
            console.error(erro);
        }
    });

    async function excluirEntregador(id) {
        if (!confirm('Tem certeza de que deseja remover este entregador?')) return;

        const formData = new FormData();
        formData.append('id', id);

        try {
            const resposta = await fetch(API_BASE + 'excluir_entregador.php', {
                method: 'POST',
                body: formData
            });

            const resultado = await resposta.json();

            if (resposta.ok && resultado.sucesso) {
                mostrarToast(resultado.mensagem);
                renderizarEntregadores();
            } else {
                alert('Erro ao excluir: ' + (resultado.erro || 'Erro desconhecido'));
            }
        } catch (erro) {
            alert('Erro ao conectar com a API para exclusão.');
            console.error(erro);
        }
    }

    renderizarEntregadores();