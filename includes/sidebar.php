<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
</head>
<body>
	<!-- INÍCIO DO MENU LATERAL (SIDEBAR) - ESTILO DAVUR PURÍSSIMO -->
<nav>
    <!-- Topo da Sidebar (Identificação idêntica ao Davur) -->
    <div>
        <h2>Davur</h2>
        <p><small>Restaurant Admin</small></p>
    </div>

    <hr>

    <!-- MÓDULO 1: DASHBOARD (Seção Principal do Davur) -->
    <div>
        <h3>Dashboard</h3>
        <ul>
            <li>
                <!-- Seus arquivos principais cadastrados na raiz -->
                <a href="dashboard.php"><strong>Visão Geral (Analytics)</strong></a>
            </li>
        </ul>
    </div>

    <!-- MÓDULO 2: GERENCIAR PEDIDOS (Caso de Uso: Realizar/Acompanhar Pedidos) -->
    <div>
        <h3>Pedidos Delivery</h3>
        <ul>
            <li>
                <!-- Arquivo pedidos.php que você já tem criado -->
                <a href="pedidos.php">Fila de Pedidos (Order List)</a>
            </li>
            <li>
                <!-- Link para o histórico geral mapeado no banco -->
                <a href="historico_pedidos.php">Histórico de Vendas</a>
            </li>
        </ul>
    </div>

    <!-- MÓDULO 3: GERENCIAR CARDÁPIO (Caso de Uso: Criar/Editar Pratos) -->
    <div>
        <h3>Cardápio Digital</h3>
        <ul>
            <li>
                <!-- Arquivo cardapio.php que você já tem criado -->
                <a href="cardapio.php">Itens do Cardápio (Food Items)</a>
            </li>
            <li>
                <a href="categorias_cardapio.php">Categorias de Pratos</a>
            </li>
        </ul>
    </div>

    <!-- MÓDULO 4: LOGÍSTICA & CLIENTES (Caso de Uso: Gerenciar Entregas e Clientes) -->
    <div>
        <h3>Pessoas & Logística</h3>
        <ul>
            <li>
                <!-- Ator do seu diagrama: Clientes -->
                <a href="clientes.php">Clientes Cadastrados</a>
            </li>
            <li>
                <!-- Ator do seu diagrama: Entregador -->
                <a href="entregadores.php">Status dos Entregadores</a>
            </li>
        </ul>
    </div>

    <hr>

    <!-- MÓDULO 5: CONFIGURAÇÕES OPERACIONAIS -->
    <div>
        <h3>Configurações</h3>
        <ul>
            <li>
                <a href="configuracoes.php">Configurações do Painel</a>
            </li>
            <li>
                <a href="logout.php">Sair do Painel (Logout)</a>
            </li>
        </ul>
    </div>
</nav>
<!-- FIM DO MENU LATERAL (SIDEBAR) -->

</body>
</html>