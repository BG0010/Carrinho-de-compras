const produtos = [
  { id: 1, nome: "Camiseta Básica", preco: 49.90 },
  { id: 2, nome: "Calça Jeans", preco: 129.99 },
  { id: 3, nome: "Tênis Esportivo", preco: 199.90 },
  { id: 4, nome: "Mochila Escolar", preco: 89.50 },
  { id: 5, nome: "Fone de Ouvido Bluetooth", preco: 149.00 },
  { id: 6, nome: "Relógio Digital", preco: 89.90 },
  { id: 7, nome: "Livro de Ficção", preco: 39.90 },
  { id: 8, nome: "Teclado Mecânico", preco: 229.99 },
  { id: 9, nome: "Mouse Gamer", preco: 99.90 },
  { id: 10, nome: "Luminária de Mesa LED", preco: 59.90 },
];

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let compras = JSON.parse(localStorage.getItem('compras')) || [];

function formatarPreco(valor) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function renderizarProdutos() {
  const lista = document.getElementById('lista-produtos');
  lista.innerHTML = '';
  produtos.forEach(prod => {
    const div = document.createElement('div');
    div.innerHTML = `
      <img src="../zImagens/produto${prod.id}.webp" alt="${prod.nome}" class="imagem-produto">
      <strong>${prod.nome}</strong> - ${formatarPreco(prod.preco)}
      <button onclick="adicionarAoCarrinho(${prod.id})">Adicionar</button>
    `;
    lista.appendChild(div);
  });
}

function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  const item = carrinho.find(i => i.id === id);
  const totalItens = carrinho.reduce((acc, cur) => acc + cur.qtd, 0);

  if (totalItens >= 10) {
    alert("Limite de 10 itens no carrinho atingido.");
    return;
  }

  if (item) {
    item.qtd++;
  } else {
    carrinho.push({ ...produto, qtd: 1 });
  }

  salvarCarrinho();
  atualizarCarrinho();
}

function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarCarrinho() {
  const ul = document.getElementById('itens-carrinho');
  const totalSpan = document.getElementById('total-itens');
  const valorSpan = document.getElementById('valor-total');

  ul.innerHTML = '';
  let totalQtd = 0;
  let totalValor = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.qtd;
    totalQtd += item.qtd;
    totalValor += subtotal;

    const li = document.createElement('li');
    li.textContent = `${item.nome} - ${item.qtd} x ${formatarPreco(item.preco)} = ${formatarPreco(subtotal)}`;
    ul.appendChild(li);
  });

  totalSpan.textContent = totalQtd;
  valorSpan.textContent = formatarPreco(totalValor);
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("O carrinho está vazio.");
    return;
  }

  compras.push(...carrinho);
  localStorage.setItem('compras', JSON.stringify(compras));
  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();
  renderizarCompras();
}

function renderizarCompras() {
  const tabela = document.getElementById('tabela-compras');
  tabela.innerHTML = '';

  compras.forEach((item, index) => {
    const subtotal = item.qtd * item.preco;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.qtd}</td>
      <td>${formatarPreco(subtotal)}</td>
      <td>
        <button onclick="detalhar(${index})">Detalhes</button>
        <button onclick="atualizar(${index})">Atualizar</button>
        <button onclick="excluir(${index})">Excluir</button>
      </td>
    `;
    tabela.appendChild(row);
  });
}

function detalhar(index) {
  alert(JSON.stringify(compras[index], null, 2));
}

function atualizar(index) {
  const novaQtd = parseInt(prompt("Nova quantidade:", compras[index].qtd));
  if (!isNaN(novaQtd) && novaQtd > 0) {
    compras[index].qtd = novaQtd;
    localStorage.setItem('compras', JSON.stringify(compras));
    renderizarCompras();
  }
}

function excluir(index) {
  if (confirm("Deseja realmente excluir?")) {
    compras.splice(index, 1);
    localStorage.setItem('compras', JSON.stringify(compras));
    renderizarCompras();
  }
}

renderizarProdutos();
atualizarCarrinho();
renderizarCompras();
