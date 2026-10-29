    VangustAuth.exigirLogin();
    VangustLayout.montar('clientes.html');

    const API_BASE = window.location.hostname === 'localhost' 
        ? 'http://localhost/api_hamburgueria/' 
        : window.location.origin + '/api_hamburgueria/';

    async function renderizarClientes() {
        const tbody = document.getElementById('tbodyClientes') || document.querySelector('table tbody');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">A carregar clientes...</td></tr>';

        try {
            const resposta = await fetch(API_BASE + 'listar_clientes.php');
            const clientes = await resposta.json();

            tbody.innerHTML = clientes.length ? clientes.map(c => `
                <tr>
                    <td><strong>#${c.id_cliente}</strong></td>
                    <td>${c.nome_cliente}</td>
                    <td>${c.telefone || 'Não informado'}</td>
                    <td><strong>R$ ${parseFloat(c.total_gasto).toFixed(2).replace('.', ',')}</strong></td>
                </tr>
            `).join('') : `<tr><td colspan="4" style="text-align:center; padding:20px;">Nenhum cliente cadastrado ainda.</td></tr>`;
        } catch (erro) {
            console.error("Erro ao carregar clientes:", erro);
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">Erro ao ligar à base de dados.</td></tr>`;
        }
    }

    function abrirModalNovo() {
        const modal = document.getElementById('modalCliente');
        if (!modal) return;
        
        const titulo = document.getElementById('modalTitulo');
        if (titulo) titulo.textContent = 'Novo cliente';

        if (document.getElementById('f_id_cliente')) document.getElementById('f_id_cliente').value = '';
        if (document.getElementById('f_nome')) document.getElementById('f_nome').value = '';
        if (document.getElementById('f_telefone')) document.getElementById('f_telefone').value = '';

        modal.classList.add('active');
    }

    function fecharModal() {
        const modal = document.getElementById('modalCliente');
        if (modal) modal.classList.remove('active');
    }

    const formCliente = document.getElementById('formCliente');
    if (formCliente) {
        formCliente.addEventListener('submit', async function (event) {
            event.preventDefault();

            const nome = document.getElementById('f_nome') ? document.getElementById('f_nome').value.trim() : '';
            const telefone = document.getElementById('f_telefone') ? document.getElementById('f_telefone').value.trim() : '';

            const formData = new FormData();
            formData.append('nome_cliente', nome);
            formData.append('telefone', telefone);

            try {
                const resposta = await fetch(API_BASE + 'salvar_cliente.php', {
                    method: 'POST',
                    body: formData
                });

                const resultado = await resposta.json();

                if (resposta.ok && resultado.sucesso) {
                    fecharModal();
                    if (typeof mostrarToast === 'function') mostrarToast(resultado.mensagem);
                    renderizarClientes();
                } else {
                    alert('Erro ao salvar: ' + (resultado.erro || 'Erro desconhecido'));
                }
            } catch (erro) {
                alert('Erro de conexão com a API.');
                console.error(erro);
            }
        });
    }

    renderizarClientes();