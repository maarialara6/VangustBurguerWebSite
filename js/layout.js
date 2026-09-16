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
                    <img src="img/logo-2.png" alt="Vangust Burguer" onerror="this.style.display='none'">
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
                    <div class="topbar-notif-wrap" id="topbarNotifWrap">
                        <button type="button" class="topbar-notif-btn" id="topbarNotifBtn" title="Notificações">
                            <i class="fa-regular fa-bell"></i>
                        </button>
                        <div class="topbar-notif-dropdown" id="topbarNotifDropdown"></div>
                    </div>
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
            if (termo.length < 1) {
                resultsBox.classList.remove('show');
                resultsBox.innerHTML = '';
                return;
            }
            const resultados = VangustDB.buscarGlobal(termo);
            resultsBox.innerHTML = montarResultadosHtml(resultados, termo);
            resultsBox.classList.add('show');
        });

        input.addEventListener('focus', () => {
            if (input.value.trim().length >= 1) resultsBox.classList.add('show');
        });

        document.addEventListener('click', (e) => {
            if (e.target !== input && !resultsBox.contains(e.target)) {
                resultsBox.classList.remove('show');
            }
        });
    }

    const ICONES_NOTIF = {
        pedido: 'fa-receipt',
        estoque: 'fa-box-open',
        sistema: 'fa-circle-info',
    };

    function renderNotifItem(n) {
        const icone = ICONES_NOTIF[n.tipo] || 'fa-bell';
        return `
            <div class="topbar-notif-item ${n.lida ? '' : 'nao-lida'}" data-id="${n.id}">
                <div class="topbar-notif-icon"><i class="fa-solid ${icone}"></i></div>
                <div class="topbar-notif-texto">
                    <p>${n.mensagem}</p>
                    <span>${formatarData(n.data)}</span>
                </div>
                ${n.lida ? '' : '<span class="topbar-notif-dot"></span>'}
            </div>
        `;
    }

    function renderNotifDropdown() {
        const notificacoes = VangustDB.listarNotificacoes();
        const corpo = notificacoes.length
            ? notificacoes.map(renderNotifItem).join('')
            : `<div class="topbar-search-empty">Nenhuma notificação por aqui.</div>`;

        return `
            <div class="topbar-notif-header">
                <strong>Notificações</strong>
                <a href="#" id="btnMarcarTodasLidas">Marcar todas como lidas</a>
            </div>
            <div class="topbar-notif-lista">${corpo}</div>
        `;
    }

    function atualizarBadgeNotificacoes() {
        const btn = document.getElementById('topbarNotifBtn');
        if (!btn) return;
        const naoLidas = VangustDB.contarNotificacoesNaoLidas();
        let badge = btn.querySelector('.topbar-notif-badge');

        if (naoLidas > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'topbar-notif-badge';
                btn.appendChild(badge);
            }
            badge.textContent = naoLidas > 9 ? '9+' : naoLidas;
        } else if (badge) {
            badge.remove();
        }
    }

    function ativarCliquesNotif() {
        const dropdown = document.getElementById('topbarNotifDropdown');
        const btnMarcarTodas = document.getElementById('btnMarcarTodasLidas');

        dropdown.querySelectorAll('.topbar-notif-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = Number(item.dataset.id);
                VangustDB.marcarNotificacaoLida(id);
                item.classList.remove('nao-lida');
                const dot = item.querySelector('.topbar-notif-dot');
                if (dot) dot.remove();
                atualizarBadgeNotificacoes();
            });
        });

        if (btnMarcarTodas) {
            btnMarcarTodas.addEventListener('click', (e) => {
                e.preventDefault();
                VangustDB.marcarTodasNotificacoesLidas();
                dropdown.innerHTML = renderNotifDropdown();
                ativarCliquesNotif();
                atualizarBadgeNotificacoes();
            });
        }
    }

    function ativarNotificacoes() {
        const wrap = document.getElementById('topbarNotifWrap');
        const btn = document.getElementById('topbarNotifBtn');
        const dropdown = document.getElementById('topbarNotifDropdown');
        if (!wrap || !btn || !dropdown) return;

        atualizarBadgeNotificacoes();

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const vaiAbrir = !dropdown.classList.contains('show');
            dropdown.classList.toggle('show');
            if (vaiAbrir) {
                dropdown.innerHTML = renderNotifDropdown();
                ativarCliquesNotif();
            }
        });

        document.addEventListener('click', (e) => {
            if (!wrap.contains(e.target)) dropdown.classList.remove('show');
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
        ativarNotificacoes();
    }

    return { montar, atualizarBadgeNotificacoes };
})();
