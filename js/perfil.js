VangustAuth.exigirLogin();
    VangustLayout.montar('perfil.html');

    const API_BASE = window.location.hostname === 'localhost' 
        ? 'http://localhost/api_hamburgueria/' 
        : window.location.origin + '/api_hamburgueria/';

    function preencherAvatar(elementoId, usuario) {
        const el = document.getElementById(elementoId);
        if (!el) return;
        if (usuario.foto) {
            el.style.backgroundImage = `url('${usuario.foto}')`;
            el.textContent = '';
        } else {
            el.style.backgroundImage = '';
            el.textContent = usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'A';
        }
    }

    function carregarDados() {
        const usuario = VangustAuth.getUsuarioLogado();
        if (!usuario) return;

        // Modo visualização
        document.getElementById('viewNome').textContent = usuario.nome;
        document.getElementById('viewEmail').textContent = usuario.email;
        document.getElementById('viewEmailRow').textContent = usuario.email;
        
        const cargoAtual = usuario.cargo ? usuario.cargo : 'Funcionário';
        document.getElementById('textoCargo').textContent = cargoAtual;

        preencherAvatar('viewAvatar', usuario);

        // Modo edição
        document.getElementById('f_nome').value = usuario.nome;
        document.getElementById('f_email').value = usuario.email;
        document.getElementById('f_senha').value = '';
        preencherAvatar('editAvatar', usuario);
    }

    function ativarEdicao() {
        document.getElementById('viewMode').style.display = 'none';
        document.getElementById('editMode').style.display = 'block';
    }

    function cancelarEdicao() {
        carregarDados();
        document.getElementById('editMode').style.display = 'none';
        document.getElementById('viewMode').style.display = 'block';
    }

    document.getElementById('formPerfil').addEventListener('submit', async function (e) {
        e.preventDefault();

        const usuarioAtual = VangustAuth.getUsuarioLogado();
        if (!usuarioAtual) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'index.html';
            return;
        }

        const idUsuario = usuarioAtual.id_usuario || usuarioAtual.id;
        const nome = document.getElementById('f_nome').value.trim();
        const email = document.getElementById('f_email').value.trim();
        const senha = document.getElementById('f_senha').value;

        if (!idUsuario || !nome || !email) {
            alert('Erro: ID, nome e e-mail são obrigatórios.');
            return;
        }

        const formData = new FormData();
        formData.append('id_usuario', idUsuario);
        formData.append('nome', nome);
        formData.append('email', email);
        if (senha) {
            formData.append('senha', senha);
        }

        try {
            const resposta = await fetch(API_BASE + 'atualizar_perfil.php', {
                method: 'POST',
                body: formData
            });

            const resultado = await resposta.json();

            if (resposta.ok && resultado.sucesso) {
                const cargoAtual = resultado.usuario && resultado.usuario.cargo ? resultado.usuario.cargo : (usuarioAtual.cargo || 'Atendente');
                const dadosAtualizados = { ...usuarioAtual, id_usuario: idUsuario, nome, email, cargo: cargoAtual };
                
                sessionStorage.setItem('vangust_admin_dados', JSON.stringify(dadosAtualizados));

                carregarDados();
                document.getElementById('editMode').style.display = 'none';
                document.getElementById('viewMode').style.display = 'block';

                const msg = document.getElementById('mensagemSucesso');
                msg.style.display = 'block';
                setTimeout(() => msg.style.display = 'none', 3000);

                if (typeof mostrarToast === 'function') {
                    mostrarToast('Perfil atualizado com sucesso.');
                }
                VangustLayout.montar('perfil.html');
            } else {
                alert('Erro ao atualizar: ' + (resultado.erro || resultado.mensagem || 'Erro desconhecido'));
            }
        } catch (erro) {
            alert('Erro de conexão com a API.');
            console.error(erro);
        }
    });

    carregarDados();