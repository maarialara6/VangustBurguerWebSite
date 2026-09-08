function mostrarToast(mensagem) {
    let toast = document.getElementById('vg-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'vg-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = mensagem;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

function formatarMoeda(valor) {
    return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

function formatarData(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function statusLabel(status) {
    const mapa = {
        recebido: 'Recebido',
        em_preparo: 'Em preparo',
        saiu_entrega: 'Saiu p/ entrega',
        entregue: 'Entregue',
        cancelado: 'Cancelado',
    };
    return mapa[status] || status;
}
