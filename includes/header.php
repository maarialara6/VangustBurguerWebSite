<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
</head>
<body>
	<div>
        <!-- Espaço vazio reservado para alinhamento com o Menu Lateral (Sidebar)-->
    </div>

    <!-- Container Geral-->
    <div>
        
        <!-- Botão para abrir o menu-->
        <button type="button">
            Menu
        </button>

        <!-- Barra de Pesquisa-->
        <form action="pedidos.php" method="GET">
            <div>
                <label for="campo-busca">Buscar:</label>
                <input id="campo-busca" type="search" name="pesquisa" placeholder="Buscar pedido ou prato...">
            </div>
        </form>

        <!-- Ações do Lado Direito -->
        <ul>
            
            <!-- Link de Notificações de Novos Pedidos -->
            <li>
                <a href="notificacoes.php">
                    Notificações
                    <!-- Indicador de que há alertas pendentes -->
                    <span>(Novo)</span>
                </a>
            </li>

            <!-- Informações do Administrador-->
            <li>
                <div>
                    <!-- foto de perfil -->
                    <img src="" alt="imagem do funcionario">
                    
                    <!-- Dados textuais do usuário logado -->
                    <div>
                        <p>Olá, <strong>Admin</strong>!</p>
                    </div>
                </div>
                
                <!-- Links de Opções de Conta -->
                <ul>
                    <li><a href="perfil.php">Meu Perfil</a></li>
                    <li><a href="configuracoes.php">Configurações</a></li>
                    <li><a href="logout.php">Sair</a></li>
                </ul>
            </li>

        </ul>
    </div>
</body>
</html>