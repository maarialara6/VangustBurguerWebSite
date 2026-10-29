 VangustAuth.exigirLogin();
    VangustLayout.montar('cardapio.html');

    const API_BASE = window.location.hostname === 'localhost' 
        ? 'http://localhost/api_hamburgueria/' 
        : window.location.origin + '/api_hamburgueria/';

    async function renderizarProdutos() {
        const tbody = document.getElementById('tbodyProdutos');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">A carregar produtos...</td></tr>';

        try {
            const resposta = await fetch(API_BASE + 'produtos.php');
            const produtos = await resposta.json();

            tbody.innerHTML = produtos.length ? produtos.map(p => `
                <tr>
                    <td>
                        <div style="display:flex; align-items:center; gap:10px;">
                            ${p.imagem ? `<img src="${p.imagem}" style="width:40px; height:40px; border-radius:8px; object-fit:cover;">` : `<div style="width:40px; height:40px; background:#eee; border-radius:8px;"></div>`}
                            <div>
                                <strong>${p.nome_produto}</strong><br>
                                <span style="color:var(--vg-text-light);font-size:12px;">${p.descricao || ''}</span>
                            </div>
                        </div>
                    </td>
                    <td>${p.categoria}</td>
                    <td>R$ ${parseFloat(p.preco).toFixed(2).replace('.', ',')}</td>
                    <td>Estoque web</td>
                    <td>
                        <a href="#" class="badge badge-entregue">Ativo</a>
                    </td>
                    <td style="white-space:nowrap;">
                        <button class="btn btn-outline btn-sm" onclick='abrirModalEditar(${JSON.stringify(p)})'><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="excluirProduto(${p.id_produto})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('') : `<tr><td colspan="6" class="empty-state">Nenhum produto cadastrado ainda.</td></tr>`;
        } catch (erro) {
            console.error("Erro ao carregar produtos:", erro);
            tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Erro ao ligar à base de dados. Verifique a ligação.</td></tr>`;
        }
    }

    function abrirModalNovo() {
        document.getElementById('modalTitulo').textContent = 'Novo produto';
        document.getElementById('f_id_produto').value = '';
        if(document.getElementById('f_imagem')) document.getElementById('f_imagem').value = '';
        document.getElementById('f_nome').value = '';
        document.getElementById('f_descricao').value = '';
        document.getElementById('f_categoria').value = '';
        document.getElementById('f_preco').value = '';
        document.getElementById('f_estoque').value = 0;
        document.getElementById('modalProduto').classList.add('active');
    }

    function abrirModalEditar(p) {
        document.getElementById('modalTitulo').textContent = 'Editar produto';
        document.getElementById('f_id_produto').value = p.id_produto;
        document.getElementById('f_nome').value = p.nome_produto;
        document.getElementById('f_descricao').value = p.descricao;
        document.getElementById('f_categoria').value = p.categoria;
        document.getElementById('f_preco').value = String(p.preco).replace('.', ',');
        document.getElementById('modalProduto').classList.add('active');
    }

    function fecharModal() {
        document.getElementById('modalProduto').classList.remove('active');
    }

    async function excluirProduto(id) {
        if (!confirm('Tem certeza de que deseja remover este produto do cardápio?')) return;

        const formData = new FormData();
        formData.append('id', id);

        try {
            const resposta = await fetch(API_BASE + 'excluir_produto.php', {
                method: 'POST',
                body: formData
            });

            if (resposta.ok) {
                mostrarToast('Produto removido com sucesso.');
                renderizarProdutos();
            } else {
                const resultado = await resposta.json().catch(() => ({}));
                alert('Erro ao excluir: ' + (resultado.erro || 'Erro desconhecido no servidor'));
            }
        } catch (erro) {
            alert('Erro ao conectar com a API para exclusão.');
            console.error(erro);
        }
    }

    // 2. Envio do formulário para salvar o produto e a imagem na API
    document.getElementById('formProduto').addEventListener('submit', async function (e) {
        e.preventDefault();
        const idProduto = document.getElementById('f_id_produto').value;
        const preco = parseFloat(document.getElementById('f_preco').value.replace(',', '.'));

        const formData = new FormData();
        if (idProduto) {
            formData.append('id_produto', idProduto);
        }
        formData.append('nome_produto', document.getElementById('f_nome').value.trim());
        formData.append('descricao', document.getElementById('f_descricao').value.trim());
        formData.append('categoria', document.getElementById('f_categoria').value.trim());
        formData.append('preco', preco);
        
        const inputImagem = document.getElementById('f_imagem');
        if (inputImagem && inputImagem.files.length > 0) {
            formData.append('foto', inputImagem.files[0]);
        }

        try {
            const resposta = await fetch(API_BASE + 'salvar_produto.php', {
                method: 'POST',
                body: formData
            });
            
            if (resposta.ok) {
                fecharModal();
                alert('Produto salvo com sucesso!');
                renderizarProdutos();
            } else {
                const erroData = await resposta.json();
                alert('Erro ao salvar: ' + (erroData.erro || 'Erro desconhecido'));
            }
        } catch (erro) {
            alert('Erro ao conectar com a API.');
            console.error(erro);
        }
    });

    renderizarProdutos();