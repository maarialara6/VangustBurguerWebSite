VangustAuth.exigirLogin();
    VangustLayout.montar('funcionarios.html');

    const usuarioLogado = VangustAuth.getUsuarioLogado();
    const eAdmin = usuarioLogado && usuarioLogado.cargo === 'Administrador';

    const API_BASE = window.location.hostname === 'localhost' 
        ? 'http://localhost/api_hamburgueria/' 
        : window.location.origin + '/api_hamburgueria/';

    async function carregarFuncionarios() {
        const tbody = document.getElementById('tbodyFuncionarios');
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">A carregar funcionários...</td></tr>';

        try {
            const resposta = await fetch(API_BASE + 'listar_funcionarios.php');
            const resultado = await resposta.json();
            const funcionarios = resultado.funcionarios || [];

            const btnNovo = document.querySelector('.card-header-row button');
            if (btnNovo && !eAdmin) {
                btnNovo.style.display = 'none';
            }

            tbody.innerHTML = funcionarios.length ? funcionarios.map(f => `
                <tr>
                    <td><strong>${f.nome}</strong></td>
                    <td>${f.email}</td>
                    <td>
                        ${eAdmin ? `
                            <select class="form-control" style="padding:4px; font-size:12px;" onchange="alterarCargo(${f.id_usuario}, this.value)">
                                <option value="Administrador" ${f.cargo === 'Administrador' ? 'selected' : ''}>Administrador</option>
                                <option value="Atendente" ${f.cargo === 'Atendente' ? 'selected' : ''}>Atendente</option>
                                <option value="Gerente" ${f.cargo === 'Gerente' ? 'selected' : ''}>Gerente</option>
                            </select>
                        ` : `<span class="badge badge-entregue">${f.cargo}</span>`}
                    </td>
                    <td><span class="badge ${f.status_ativo == 1 ? 'badge-entregue' : 'badge-cancelado'}">${f.status_ativo == 1 ? 'Ativo' : 'Inativo'}</span></td>
                </tr>
            `).join('') : `<tr><td colspan="4" class="empty-state">Nenhum funcionário cadastrado.</td></tr>`;
        } catch (erro) {
            console.error("Erro ao carregar funcionários:", erro);
            tbody.innerHTML = `<tr><td colspan="4" class="empty-state">Erro ao ligar à base de dados.</td></tr>`;
        }
    }

    async function alterarCargo(idFuncionario, novoCargo) {
        const formData = new FormData();
        formData.append('id_alvo', idFuncionario);
        formData.append('novo_cargo', novoCargo);
        formData.append('id_admin_logado', usuarioLogado.id_usuario);

        try {
            const resposta = await fetch(API_BASE + 'atualizar_cargo.php', {
                method: 'POST',
                body: formData
            });
            const resultado = await resposta.json();
            if (resposta.ok && resultado.sucesso) {
                if (typeof mostrarToast === 'function') mostrarToast("Cargo atualizado com sucesso!");
                carregarFuncionarios();
            } else {
                alert('Erro: ' + (resultado.erro || 'Não foi possível alterar o cargo.'));
                carregarFuncionarios();
            }
        } catch (erro) {
            alert('Erro de conexão ao alterar cargo.');
        }
    }

    function abrirModalNovo() {
        if (!eAdmin) {
            alert('Acesso restrito a administradores.');
            return;
        }
        document.getElementById('modalFuncionario').classList.add('active');
    }

    function fecharModal() {
        document.getElementById('modalFuncionario').classList.remove('active');
    }

    document.getElementById('formFuncionario').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', document.getElementById('f_email').value.trim());
        formData.append('nome', document.getElementById('f_nome').value.trim());
        formData.append('cargo', document.getElementById('f_cargo').value);
        formData.append('senha', document.getElementById('f_senha').value || '123456');
        formData.append('id_admin_logado', usuarioLogado.id_usuario);

        try {
            const resposta = await fetch(API_BASE + 'salvar_funcionario.php', {
                method: 'POST',
                body: formData
            });
            const resultado = await resposta.json();

            if (resposta.ok && resultado.sucesso) {
                fecharModal();
                if (typeof mostrarToast === 'function') mostrarToast(resultado.mensagem);
                carregarFuncionarios();
            } else {
                alert('Erro ao salvar: ' + (resultado.erro || 'Erro desconhecido'));
            }
        } catch (erro) {
            alert('Erro de conexão com a API.');
        }
    });

    carregarFuncionarios();