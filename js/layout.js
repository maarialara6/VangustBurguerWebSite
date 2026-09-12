const VangustLayout = (() => {
    const ITENS_MENU = [
        { pagina: 'dashboard.html', icone: 'fa-chart-line', label: 'Dashboard' },
        { pagina: 'pedidos.html', icone: 'fa-receipt', label: 'Pedidos' },
        { pagina: 'cardapio.html', icone: 'fa-burger', label: 'Cardápio' },
        { pagina: 'clientes.html', icone: 'fa-users', label: 'Clientes' },
        { pagina: 'entregadores.html', icone: 'fa-motorcycle', label: 'Entregadores' },
    ];

    function renderSidebar(paginaAtual) {
        const itensHtml = ITENS_MENU.map(item => `
            <li class="${item.pagina === paginaAtual ? 'active' : ''}">
                <a href="${item.pagina}"><span class="icon"><i class="fa-solid ${item.icone}"></i></span> ${item.label}</a>
            </li>
        `).join('');

        return `
            <aside class="sidebar">
                <div class="sidebar-logo">
                    <img src="img/logo.png" alt="Vangust Burguer" onerror="this.style.display='none'">
                </div>
                <ul class="sidebar-nav">${itensHtml}</ul>
                <div class="sidebar-footer">
                    <a href="#" id="btnSair"><i class="fa-solid fa-right-from-bracket"></i> Sair</a>
                </div>
            </aside>
        `;
    }

    function renderHeader() {
        const usuario = VangustDB.getUsuarioAdmin();
        const inicial = usuario.nome.charAt(0).toUpperCase();
        const avatarHtml = usuario.foto
            ? `<img src="${usuario.foto}" alt="${usuario.nome}" class="topbar-avatar" style="object-fit:cover;">`
            : `<div class="topbar-avatar">${inicial}</div>`;
        return `
            <header class="topbar">
                <div class="topbar-search">
                    <i class="fa-solid fa-magnifying-glass" style="color:var(--vg-text-light)"></i>
                    <input type="text" id="topbarSearchInput" autocomplete="off" placeholder="Buscar pedidos, clientes, produtos...">
                    <div class="topbar-search-results" id="topbarSearchResults"></div>
                </div>
                <div class="topbar-right">
                    <i class="fa-regular fa-bell" style="font-size:18px;color:var(--vg-brown)"></i>
                    <a href="perfil.html" class="topbar-user" style="cursor:pointer;">
                        ${avatarHtml}
                        <div class="topbar-user-info">
                            <strong>${usuario.nome}</strong>
                            <span>Administrador</span>
                        </div>
                    </a>
                </div>
            </header>
        `;
    }

    function renderFooter() {
        const ano = new Date().getFullYear();
        return `
            <footer class="app-footer">
                <strong>Vangust Burguer</strong> — Painel Administrativo &copy; ${ano}
            </footer>
        `;
    }

    function montarResultadosHtml(resultados, termo) {
        const total = resultados.produtos.length + resultados.clientes.length + resultados.pedidos.length;

        if (!total) {
            return `<div class="topbar-search-empty">Nenhum resultado para "${termo}"</div>`;
        }

        let html = '';

        if (resultados.produtos.length) {
            html += `<div class="topbar-search-group-title">Produtos</div>`;
            html += resultados.produtos.map(p => `
                <div class="topbar-search-item" onclick="window.location.href='cardapio.html'">
                    <i class="fa-solid fa-burger"></i>
                    <span>${p.nome}</span>
                </div>
            `).join('');
        }

        if (resultados.clientes.length) {
            html += `<div class="topbar-search-group-title">Clientes</div>`;
            html += resultados.clientes.map(c => `
                <div class="topbar-search-item" onclick="window.location.href='clientes.html'">
                    <i class="fa-solid fa-user"></i>
                    <span>${c.nome}</span>
                </div>
            `).join('');
        }

        if (resultados.pedidos.length) {
            html += `<div class="topbar-search-group-title">Pedidos</div>`;
            html += resultados.pedidos.map(p => `
                <div class="topbar-search-item" onclick="window.location.href='pedidos.html'">
                    <i class="fa-solid fa-receipt"></i>
                    <span>#${p.id_pedido} — ${p.cliente_nome}</span>
                </div>
            `).join('');
        }

        return html;
    }

    function ativarBuscaGlobal() {
        const input = document.getElementById('topbarSearchInput');
        const resultsBox = document.getElementById('topbarSearchResults');
        if (!input || !resultsBox) return;

        input.addEventListener('input', () => {
            const termo = input.value.trim();
            if (termo.length < 2) {
                resultsBox.classList.remove('show');
                resultsBox.innerHTML = '';
                return;
            }
            const resultados = VangustDB.buscarGlobal(termo);
            resultsBox.innerHTML = montarResultadosHtml(resultados, termo);
            resultsBox.classList.add('show');
        });

        input.addEventListener('focus', () => {
            if (input.value.trim().length >= 2) resultsBox.classList.add('show');
        });

        document.addEventListener('click', (e) => {
            if (e.target !== input && !resultsBox.contains(e.target)) {
                resultsBox.classList.remove('show');
            }
        });
    }

    function montar(paginaAtual) {
        const spSidebar = document.getElementById('sidebar-placeholder');
        const spHeader = document.getElementById('header-placeholder');
        const spFooter = document.getElementById('footer-placeholder');

        if (spSidebar) spSidebar.outerHTML = renderSidebar(paginaAtual);
        if (spHeader) spHeader.outerHTML = renderHeader();
        if (spFooter) spFooter.outerHTML = renderFooter();

        const btnSair = document.getElementById('btnSair');
        if (btnSair) {
            btnSair.addEventListener('click', (e) => {
                e.preventDefault();
                VangustAuth.logout();
            });
        }

        ativarBuscaGlobal();
    }

    return { montar };
})();