// ---------- DADOS ----------
// Fotos: coloque imagens SUAS em /img com o id do personagem (ex: img/luffy.png).
// Se o arquivo não existir, aparece a inicial colorida.
const crew = [
  { id: "luffy",   nome: "Luffy",   funcao: "Capitão",     cor: "#e4572e", mar: "east",    sonho: "Se tornar o Rei dos Piratas", hab: "Corpo de borracha (Fruta Gomu Gomu)", sobre: "Otimista e impulsivo, é quem puxa todo mundo pra aventura." },
  { id: "zoro",    nome: "Zoro",    funcao: "Espadachim",  cor: "#2e7d4f", mar: "east",    sonho: "Ser o maior espadachim do mundo", hab: "Estilo de três espadas", sobre: "Focado e leal. Vive treinando e tem péssimo senso de direção." },
  { id: "nami",    nome: "Nami",    funcao: "Navegadora",  cor: "#e07a1f", mar: "east",    sonho: "Desenhar o mapa do mundo inteiro", hab: "Navegação e Clima-Tact", sobre: "Lê o clima como ninguém e cuida do dinheiro do grupo." },
  { id: "usopp",   nome: "Usopp",   funcao: "Atirador",    cor: "#8a6a2b", mar: "east",    sonho: "Ser um bravo guerreiro do mar", hab: "Pontaria com estilingue", sobre: "Criativo, inventa gadgets e conta histórias exageradas." },
  { id: "sanji",   nome: "Sanji",   funcao: "Cozinheiro",  cor: "#2b5fa8", mar: "north",   sonho: "Encontrar o All Blue", hab: "Chutes de fogo", sobre: "Cozinha pra todo mundo e luta usando só as pernas." },
  { id: "chopper", nome: "Chopper", funcao: "Médico",      cor: "#c2578a", mar: "paraiso", sonho: "Curar qualquer doença", hab: "Fruta Hito Hito (forma humana)", sobre: "Estudioso e fofo, é quem cuida de toda a tripulação." },
  { id: "robin",   nome: "Robin",   funcao: "Arqueóloga",  cor: "#5b3f8f", mar: "west",    sonho: "Descobrir a história verdadeira do mundo", hab: "Fruta Hana Hana (braços extras)", sobre: "Calma e curiosa, vive atrás de ruínas e livros antigos." },
  { id: "franky",  nome: "Franky",  funcao: "Carpinteiro", cor: "#1f9bb8", mar: "south",   sonho: "Levar o navio até o fim do mundo", hab: "Corpo de ciborgue", sobre: "Construtor barulhento, transforma qualquer ideia em máquina." },
  { id: "brook",   nome: "Brook",   funcao: "Músico",      cor: "#444b57", mar: "west",    sonho: "Reencontrar a baleia Laboon", hab: "Fruta Yomi Yomi e esgrima", sobre: "Toca violino, faz piada de si mesmo e é bem experiente." },
  { id: "jinbe",   nome: "Jinbe",   funcao: "Timoneiro",   cor: "#3a7ca5", mar: "paraiso", sonho: "Unir humanos e povo-peixe", hab: "Caratê dos Homens-Peixe", sobre: "Sério e sábio, é o mestre do caratê dos homens-peixe." }
];

const mares = {
  north:   { nome: "North Blue", txt: "Um dos quatro mares. É a terra natal de Sanji e de Law." },
  east:    { nome: "East Blue", txt: "Onde a história começa. É considerado o mais fraco dos quatro mares." },
  west:    { nome: "West Blue", txt: "Terra natal de Robin e de Brook." },
  south:   { nome: "South Blue", txt: "Terra natal de Franky." },
  paraiso: { nome: "Paraíso", txt: "Primeira metade da Grand Line. O clima é imprevisível e só dá pra navegar com o Log Pose." },
  novo:    { nome: "Novo Mundo", txt: "Segunda metade da Grand Line. É bem mais perigosa e é onde ficam os piratas mais fortes." },
  red:     { nome: "Red Line", txt: "Continente gigante que dá a volta no mundo e cruza a Grand Line." }
};

const avatar = c => `<div class="avatar" style="background:${c.cor}">${c.nome[0]}<img src="img/${c.id}.png" alt="" onerror="this.remove()"></div>`;

// ---------- TEMA ----------
const root = document.documentElement;
try { const t = localStorage.getItem("tema"); if (t) root.dataset.theme = t; } catch (e) {}
if (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches) root.dataset.theme = "dark";
document.getElementById("tema").onclick = () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("tema", root.dataset.theme); } catch (e) {}
};

// ---------- BÚSSOLA ----------
const needle = document.getElementById("needle");
const compass = document.querySelector(".compass");
addEventListener("mousemove", e => {
  const r = compass.getBoundingClientRect();
  const ang = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI + 90;
  needle.style.transform = `rotate(${ang}deg)`;
});

// ---------- MAPA ----------
const painel = document.getElementById("painel");
const regs = document.querySelectorAll(".reg");

function escolherMar(id) {
  regs.forEach(r => r.classList.toggle("on", r.dataset.r === id));
  const m = mares[id];
  const gente = crew.filter(c => c.mar === id);
  painel.innerHTML = `<h3>${m.nome}</h3><p>${m.txt}</p>` +
    (gente.length ? `<p><strong>Da tripulação:</strong></p><div class="chips"></div>` : "");
  const chips = painel.querySelector(".chips");
  gente.forEach(c => {
    const b = document.createElement("button");
    b.textContent = c.nome;
    b.onclick = () => abrirModal(c);
    chips.appendChild(b);
  });
}
regs.forEach(r => {
  r.onclick = () => escolherMar(r.dataset.r);
  r.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); escolherMar(r.dataset.r); } };
});
painel.innerHTML = "<h3>Escolha um mar</h3><p>Clica numa região do mapa.</p>";

// ---------- TRIPULAÇÃO ----------
const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
const busca = document.getElementById("busca");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const funcoes = ["Todos", ...new Set(crew.map(c => c.funcao))];
let filtro = "Todos";

function renderFiltros() {
  filters.innerHTML = "";
  funcoes.forEach(f => {
    const b = document.createElement("button");
    b.textContent = f;
    b.setAttribute("aria-pressed", f === filtro);
    b.onclick = () => { filtro = f; renderFiltros(); renderCards(); };
    filters.appendChild(b);
  });
}

function renderCards() {
  const q = busca.value.trim().toLowerCase();
  const lista = crew.filter(c => (filtro === "Todos" || c.funcao === filtro) && c.nome.toLowerCase().includes(q));
  grid.innerHTML = lista.length ? "" : '<p class="vazio">Ninguém encontrado. Tenta outro nome ou filtro.</p>';
  lista.forEach(c => {
    const card = document.createElement("button");
    card.className = "card";
    card.innerHTML = `${avatar(c)}<h3>${c.nome}</h3><span>${c.funcao}</span>`;
    card.onclick = () => abrirModal(c);
    grid.appendChild(card);
  });
}

function abrirModal(c) {
  modalBody.innerHTML = `${avatar(c)}<h3>${c.nome}</h3>
    <dl>
      <dt>Função</dt><dd>${c.funcao}</dd>
      <dt>Sonho</dt><dd>${c.sonho}</dd>
      <dt>Habilidade</dt><dd>${c.hab}</dd>
      <dt>Origem</dt><dd>${mares[c.mar].nome}</dd>
      <dt>Sobre</dt><dd>${c.sobre}</dd>
    </dl>
    <button class="btn" id="ver-mapa">Ver no mapa</button>`;
  document.getElementById("ver-mapa").onclick = () => {
    modal.close();
    escolherMar(c.mar);
    document.getElementById("mapa").scrollIntoView();
  };
  if (!modal.open) modal.showModal();
}

document.getElementById("close").onclick = () => modal.close();
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });
busca.addEventListener("input", renderCards);
renderFiltros();
renderCards();

// ---------- QUIZ ----------
const perguntas = [
  { q: "Sexta à noite, você prefere:", o: [
    ["Sair pra aventura sem plano", "luffy"], ["Treinar até cansar", "zoro"], ["Organizar o rolê e a grana", "nami"],
    ["Contar uma história exagerada", "usopp"], ["Ler um livro em silêncio", "robin"] ] },
  { q: "No projeto de grupo da faculdade, você é quem:", o: [
    ["Puxa a galera na bagunça", "luffy"], ["Entrega quieto, sem reclamar", "zoro"], ["Cuida do cronograma", "nami"],
    ["Cuida de todo mundo", "chopper"], ["Monta a parte técnica", "franky"] ] },
  { q: "Sua maior qualidade:", o: [
    ["Coragem", "luffy"], ["Foco", "zoro"], ["Esperteza", "nami"], ["Criatividade", "usopp"], ["Sabedoria", "jinbe"] ] },
  { q: "No rolê, você é quem:", o: [
    ["Cozinha pra todo mundo", "sanji"], ["Dorme em qualquer lugar", "zoro"], ["Vira o médico do grupo", "chopper"],
    ["Leva o violão e anima", "brook"], ["Conta vantagem", "usopp"] ] },
  { q: "O que você mais quer na vida?", o: [
    ["Liberdade total", "luffy"], ["Ser o melhor no que faço", "zoro"], ["Conhecer o mundo todo", "nami"],
    ["Construir algo enorme", "franky"], ["Entender a história de tudo", "robin"], ["Ver as pessoas em paz", "jinbe"] ] }
];

const box = document.getElementById("quiz-box");
let passo = 0, pontos = {};

function mostrarPergunta() {
  const p = perguntas[passo];
  box.innerHTML = `<div class="progress"><i style="width:${(passo / perguntas.length) * 100}%"></i></div>
    <p class="q-title">${p.q}</p><div class="opts"></div>`;
  p.o.forEach(([texto, id]) => {
    const b = document.createElement("button");
    b.textContent = texto;
    b.onclick = () => {
      pontos[id] = (pontos[id] || 0) + 1;
      passo++;
      passo < perguntas.length ? mostrarPergunta() : mostrarResultado();
    };
    box.querySelector(".opts").appendChild(b);
  });
}

function mostrarResultado() {
  const id = Object.entries(pontos).sort((a, b) => b[1] - a[1])[0][0];
  const c = crew.find(x => x.id === id);
  box.innerHTML = `<div class="result"><p>Você seria:</p>${avatar(c)}<h3>${c.nome}</h3>
    <p><strong>${c.funcao}</strong>. ${c.sobre}</p><p>Sonho: ${c.sonho}</p>
    <br><button class="again">Fazer de novo</button></div>`;
  box.querySelector(".again").onclick = () => { passo = 0; pontos = {}; mostrarPergunta(); };
}
mostrarPergunta();