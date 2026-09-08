const VangustAuth = (() => {
    const CHAVE_SESSAO = 'vangust_admin_logado';

    function login(email, senha) {
        const usuario = VangustDB.autenticar(email, senha);
        if (usuario) {
            sessionStorage.setItem(CHAVE_SESSAO, '1');
            return true;
        }
        return false;
    }

    function estaLogado() {
        return sessionStorage.getItem(CHAVE_SESSAO) === '1';
    }

    function exigirLogin() {
        if (!estaLogado()) {
            window.location.href = 'index.html';
        }
    }

    function logout() {
        sessionStorage.removeItem(CHAVE_SESSAO);
        window.location.href = 'index.html';
    }

    return { login, estaLogado, exigirLogin, logout };
})();
