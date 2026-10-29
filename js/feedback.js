VangustAuth.exigirLogin();
    VangustLayout.montar('feedbacks.html');

    const MODO_DEMO = true;

    const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost/api_hamburgueria/'
        : window.location.origin + '/api_hamburgueria/';

    const DADOS_DEMO = [
        { id_feedback: 1, nome_cliente: 'Ana Beatriz Souza', id_pedido: 12, nota: 5, comentario: 'Chegou quentinho e o Brutão na Chapa estava incrível. Voltarei a pedir!', data_feedback: diasAtrasISO(0) },
        { id_feedback: 2, nome_cliente: 'João Pedro Alves', id_pedido: 11, nota: 4, comentario: 'Hambúrguer ótimo, só demorou um pouco mais do que o previsto.', data_feedback: diasAtrasISO(1) },
        { id_feedback: 3, nome_cliente: 'Carla Menezes', id_pedido: 9, nota: 2, comentario: 'O pedido veio sem o refrigerante do combo.', data_feedback: diasAtrasISO(2) },
        { id_feedback: 4, nome_cliente: 'Rafael Dias', id_pedido: 8, nota: 5, comentario: '', data_feedback: diasAtrasISO(3) },
        { id_feedback: 5, nome_cliente: 'Marina Lopes', id_pedido: 6, nota: 3, comentario: 'O Veggie da Horta é bom, mas o molho poderia ter mais sabor.', data_feedback: diasAtrasISO(5) },
    ];

    function diasAtrasISO(n) {
        const d = new Date();
        d.setDate(d.getDate() - n);
        return d.toISOString();
    }

    let feedbacks = [];

    function esc(texto) {
        const div = document.createElement('div');
        div.textContent = texto == null ? '' : String(texto);
        return div.innerHTML;
    }

    function estrelas(nota) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += `<i class="fa-solid fa-star ${i <= nota ? '' : 'vazia'}"></i>`;
        }
        return `<span class="fb-estrelas" role="img" aria-label="Nota ${nota} de 5">${html}</span>`;
    }

    function classeNota(nota) {
        if (nota >= 4) return 'positivo';
        if (nota === 3) return 'neutro';
        return 'negativo';
    }

    function renderResumo(lista) {
        const total = lista.length;
        const soma = lista.reduce((acc, f) => acc + Number(f.nota), 0);
        const positivos = lista.filter(f => Number(f.nota) >= 4).length;

        document.getElementById('statTotal').textContent = total;
        document.getElementById('statMedia').textContent = total ? (soma / total).toFixed(1).replace('.', ',') : '–';
        document.getElementById('statPositivos').textContent = total ? Math.round(positivos / total * 100) + '%' : '–';

        document.getElementById('distribuicao').innerHTML = [5, 4, 3, 2, 1].map(n => {
            const qtd = lista.filter(f => Number(f.nota) === n).length;
            const pct = total ? (qtd / total * 100) : 0;
            return `
                <div class="fb-dist-linha">
                    <span>${n} <i class="fa-solid fa-star" style="color:var(--vg-tan-dark)"></i></span>
                    <div class="fb-dist-barra"><span style="width:${pct}%"></span></div>
                    <span>${qtd}</span>
                </div>`;
        }).join('');
    }

    function renderLista() {
        const busca = document.getElementById('filtroBusca').value.trim().toLowerCase();
        const nota = document.getElementById('filtroNota').value;
        const ordem = document.getElementById('filtroOrdem').value;

        let lista = feedbacks.filter(f => {
            if (nota && Number(f.nota) !== Number(nota)) return false;
            if (!busca) return true;
            return (f.nome_cliente || '').toLowerCase().includes(busca)
                || (f.comentario || '').toLowerCase().includes(busca);
        });

        lista.sort((a, b) => {
            if (ordem === 'antigos') return new Date(a.data_feedback) - new Date(b.data_feedback);
            if (ordem === 'maior') return b.nota - a.nota || new Date(b.data_feedback) - new Date(a.data_feedback);
            if (ordem === 'menor') return a.nota - b.nota || new Date(b.data_feedback) - new Date(a.data_feedback);
            return new Date(b.data_feedback) - new Date(a.data_feedback);
        });

        const box = document.getElementById('listaFeedbacks');

        if (!lista.length) {
            box.innerHTML = `<div class="fb-vazio">${feedbacks.length
                ? 'Nenhum feedback encontrado com esses filtros.'
                : 'Ainda não há feedbacks. Eles aparecem aqui quando os clientes avaliam um pedido.'}</div>`;
            return;
        }

        box.innerHTML = lista.map(f => `
            <article class="fb-card ${classeNota(Number(f.nota))}">
                <div class="fb-topo">
                    <div>
                        <div class="fb-nome">${esc(f.nome_cliente)}</div>
                        <div class="fb-meta">Pedido #${esc(f.id_pedido)} · ${formatarData(f.data_feedback)}</div>
                    </div>
                    ${estrelas(Number(f.nota))}
                </div>
                ${f.comentario
                    ? `<p class="fb-comentario">${esc(f.comentario)}</p>`
                    : `<p class="fb-comentario sem-texto">O cliente deu a nota sem escrever comentário.</p>`}
            </article>
        `).join('');
    }

    async function carregarFeedbacks() {
        const box = document.getElementById('listaFeedbacks');
        box.innerHTML = '<div class="fb-vazio">Carregando feedbacks...</div>';

        try {
            if (MODO_DEMO) {
                feedbacks = DADOS_DEMO;
            } else {
                const resposta = await fetch(API_BASE + 'listar_feedbacks.php');
                if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
                feedbacks = await resposta.json();
            }
            renderResumo(feedbacks);
            renderLista();
        } catch (erro) {
            console.error('Erro ao carregar feedbacks:', erro);
            box.innerHTML = '<div class="fb-vazio" style="color:var(--vg-danger);">Não foi possível carregar os feedbacks. Verifique a conexão com a API.</div>';
        }
    }

    ['filtroBusca', 'filtroNota', 'filtroOrdem'].forEach(id => {
        document.getElementById(id).addEventListener('input', renderLista);
    });

    carregarFeedbacks();