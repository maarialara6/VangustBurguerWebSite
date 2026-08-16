<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="css/sidebar.css">
	<title></title>
</head>
<body>
<nav>
    <!-- Topo do Sidebar-->
    <div>
        <h2>VANGUST-Burguer</h2>
        <p><small>Restaurant Admin</small></p>
    </div>

    <hr>

    <!-- 1: DASHBOARD -->
    <div>
        <h3>Dashboard</h3>
        <ul>
            <li>
                <a href="dashboard.php"><strong>Visão Geral (Analytics)</strong></a>
            </li>
        </ul>
    </div>

    <!-- 2: GERENCIAR PEDIDOS -->
    <div>
        <h3>Pedidos Delivery</h3>
        <ul>
            <li>
                <a href="pedidos.php">Fila de Pedidos (Order List)</a>
            </li>
            <li>
                <a href="historico_pedidos.php">Histórico de Vendas</a>
            </li>
        </ul>
    </div>

    <!-- 3: GERENCIAR CARDÁPIO -->
    <div>
        <h3>Cardápio Digital</h3>
        <ul>
            <li>
                <a href="cardapio.php">Itens do Cardápio (Food Items)</a>
            </li>
            <li>
                <a href="categorias_cardapio.php">Categorias de Pratos</a>
            </li>
        </ul>
    </div>

    <!-- 4: LOGÍSTICA & CLIENTES -->
    <div>
        <h3>Pessoas & Logística</h3>
        <ul>
            <li>
                <a href="clientes.php">Clientes Cadastrados</a>
            </li>
            <li>
                <a href="entregadores.php">Status dos Entregadores</a>
            </li>
        </ul>
    </div>

    <hr>

    <!-- 5: CONFIGURAÇÕES OPERACIONAIS -->
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
</body>
</html>