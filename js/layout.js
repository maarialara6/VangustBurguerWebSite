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
        return `
            <header class="topbar">
                <div class="topbar-search">
                    <i class="fa-solid fa-magnifying-glass" style="color:var(--vg-text-light)"></i>
                    <input type="text" placeholder="Buscar pedidos, clientes, produtos...">
                </div>
                <div class="topbar-right">
                    <i class="fa-regular fa-bell" style="font-size:18px;color:var(--vg-brown)"></i>
                    <a href="perfil.html" class="topbar-user" style="cursor:pointer;">
                        <div class="topbar-avatar">${inicial}</div>
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
    }

    return { montar };
})();