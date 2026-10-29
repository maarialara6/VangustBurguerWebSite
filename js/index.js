if (VangustAuth.estaLogado()) {
            window.location.href = 'dashboard.html';
        }

        document.getElementById('formLogin').addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value;
            const erroBox = document.getElementById('mensagemErro');

            // Tenta fazer o login real na API
            const sucesso = await VangustAuth.login(email, senha);

            if (sucesso) {
                window.location.href = 'dashboard.html';
            } else {
                erroBox.textContent = 'E-mail ou senha inválidos.';
                erroBox.style.display = 'block';
            }
        });