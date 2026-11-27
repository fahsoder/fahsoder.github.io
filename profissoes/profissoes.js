// Guia de profissoes do WoW Forever (dados do video "WoW Forever: nao escolha profissao sem ver isso", conferidos em 11/2026)
(() => {
  const $ = (s) => document.querySelector(s);
  const P = [
    { n: "Mineração", t: "coleta", ic: "mineracao",
      mudou: "Veio de Tório Pesado, só no Monte Hyjal, e a Barra de Azerótio, nova. As Calças de Fundição (dropam nas Minas Mortas) cortam 25% do tempo pra fundir cobre, estanho, bronze e prata.",
      upar: "Cobre na zona inicial até 65; Vale Gris e Sertões; Arathi e Desolação; Tanaris e Azshara; no fim mitril, veraprata e tório. Fundir dá ponto até 185.",
      ouro: "Minerar e vender minério e barras no leilão. Custo zero; as barras de fim de jogo entram no conjunto da Ferraria e na munição.",
      combina: "Ferraria e Engenharia", fog: ["Magnetita", "Poder de Ataque"] },
    { n: "Herborismo", t: "coleta", ic: "herborismo",
      mudou: "A erva agora vai pra Alquimia e para os Primeiros Socorros (poções de cura). Tem sementes pra plantar na Estufa do acampamento e o Misturador de Semente. Ervas novas: Marefolha, Demonissálvia e Lótus-da-morte.",
      upar: "Zona inicial até 70; Costa Negra e Loch Modan; Eira dos Montes e Pantanal; Espinhaço e Arathi; no fim Tanaris e as ervas de alto nível, até o Lótus Preto no 300.",
      ouro: "Colher e vender no leilão. Agora tem procura dupla: Alquimia e Primeiros Socorros.",
      combina: "Alquimia e Primeiros Socorros", fog: ["Vela de Incenso", "Intelecto"] },
    { n: "Esfolamento", t: "coleta", ic: "esfolamento",
      mudou: "Dá pra aprender já na zona inicial, como recompensa de missão. Dá pra esfolar o bicho que outro jogador matou.",
      upar: "Zona inicial até 75; Sertões e Loch Modan; Vale Gris e Floresta do Crepúsculo; Arathi e Mil Agulhas; no fim Feralas, Un'Goro e Hibérnia.",
      ouro: "Uma das mais fáceis: esfola enquanto upa e vende o couro pra quem faz Couraria. O Couro Vil entra no conjunto da Couraria.",
      combina: "Couraria", fog: ["Cadeira de Acampamento", "2% de crítico"] },
    { n: "Alquimia", t: "producao", ic: "alquimia",
      mudou: "Perdeu as poções de cura, ganhou as tinturas (usadas por outras profissões). Frascos Naturais novos: 30 de Vigor em qualquer lugar e +2% de acerto, crítico ou outro atributo só em Hyjal e nas Profundezas Tumulares.",
      upar: "Elixires e poções de mana até 225; faça a Pedra Filosofal (guarde, precisa dela pra transmutar); do 270 ao 300, Poção Elevada Descolorida de Cura.",
      ouro: "Transmutar Arcanita, que vai em todo o conjunto da Ferraria.",
      combina: "Herborismo", fog: ["Poço de Mana", "29 de mana a cada 5 s (não acumula com Bênção de Sabedoria)"] },
    { n: "Ferraria", t: "producao", ic: "ferraria",
      mudou: "O trecho final (279 a 300) é um punhal com a Barra de Azerótio, nova. Faz o conjunto de raide do Paladino e do Guerreiro e a melhor arma fabricada pra Caçador e Ladino.",
      upar: "Pedras; depois cobre, bronze, ferro, mitril e tório; do 279 ao 300, o punhal de Azerótio.",
      ouro: "Pedras de afiar e contrapesos no leilão e armas pra quem upa. Armadura vinculada no vendedor passou a valer menos.",
      combina: "Mineração", fog: ["Roda de Afiar", "Força"] },
    { n: "Encantamento", t: "producao", ic: "encantamento",
      mudou: "Agora faz cajados, itens de mão secundária e relíquias, além das varinhas, e tem encanto de colar. A Essência da Natureza Maleável (receitas do conjunto de raide) só sai desencantando item do Pico Hyjal ou das Profundezas Tumulares.",
      upar: "Desencantar dá ponto até 20; depois varinhas e braçadeiras. Guarde todos os bastões.",
      ouro: "Serviço: encantar o item dos outros e receber gorjeta. Só o encantador consegue a Essência.",
      combina: "Alfaiataria", fog: ["Alaúde Encantado", "308 de armadura, 13 em todos os atributos, 22 em resistências (não acumula com Marca do Indomado)"] },
    { n: "Engenharia", t: "producao", ic: "engenharia",
      mudou: "Especializações Gnômica e Goblin confirmadas. Munição nova de raide (Flecha Penaveloz e Projétil Tiroveloz) agora negociável. Óculos Ígneos com 17 de resistência a fogo.",
      upar: "Pólvoras, bombas e tubos, com a Chave de Arco Voltaico e o Micro-ajustador Giromático no caminho.",
      ouro: "Munição nova pros Caçadores e bombas e dinamite pra quem faz PvP. A Granada de Ferro no vendedor foi nerfada.",
      combina: "Mineração", fog: ["Robô de Reagentes", "Vendedor no meio do acampamento"] },
    { n: "Couraria", t: "producao", ic: "couraria",
      mudou: "A que tem mais conjunto de raide: 9 conjuntos (Druida, Caçador, Ladino e Xamã). No 225 escolhe especialização; a Dracônica ficou separada por função (preta: Poder de Ataque, azul: Intelecto, verde: regeneração de mana).",
      upar: "Couro leve e kits; depois cintos e luvas; do 270 ao 300, Elmo Escorpídeo Pesado.",
      ouro: "Kits de armadura no leilão, que todo mundo usa enquanto upa.",
      combina: "Esfolamento", fog: ["Barraca", "Enche o descanso até 5% de um nível"] },
    { n: "Alfaiataria", t: "producao", ic: "alfaiataria",
      mudou: "Bolsas maiores desde 11/11 e bolsa de reagente nova. Faz o conjunto de raide do Mago, do Sacerdote e do Bruxo. Não precisa de coleta: o tecido cai dos móbs.",
      upar: "Linho, lã, seda, magitrama e runatrama. A Veste do Poder é um dos trechos mais caros (uns 20 de cada Elemental).",
      ouro: "Junto com o Encantamento: desencantar o que você fabrica vira material de encantamento.",
      combina: "Encantamento", fog: ["Estandarte de Facção", "Espírito"] },
    { n: "Culinária", t: "secundaria", ic: "culinaria",
      mudou: "Quase toda comida dá Bem Alimentado: +5% de experiência por abate, mas dura só 15 minutos. Em 23/11 a Sopa de Barbatana de Murloc ficou mais forte. É a dona da fogueira.",
      upar: "Dá pra ir só cozinhando peixe, cinco tipos do começo ao fim.",
      ouro: "Comida em todos os níveis, com o bônus de experiência.",
      combina: "Pesca", fog: ["A própria fogueira", "Recebe os objetos das outras"] },
    { n: "Primeiros Socorros", t: "secundaria", ic: "primeiros",
      mudou: "Agora faz as poções de cura, da menor até a do Monte Hyjal, além de ataduras e curativos novos: Cataplasma Simples (doença) e Torniquete de Lã (sangramento).",
      upar: "Ataduras de linho, lã, seda, magitrama e runatrama.",
      ouro: "Qualquer classe pode virar o fornecedor de poção da guilda.",
      combina: "Herborismo", fog: ["Kit", "Vigor"] },
    { n: "Pesca", t: "secundaria", ic: "pesca",
      mudou: "No Torneio de Pesca do Espinhaço, os 250 primeiros ganham a Vara de Pescar de Arcanita.",
      upar: "Conta o número de peixes, não a zona: zona inicial até 75; capitais até 150; Pântano Vadeoso ou Espinhaço até 225; Tanaris até 300.",
      ouro: "Custo zero: pescar e vender pra quem upa Culinária.",
      combina: "Culinária", fog: ["Aquário", "8% em todos os atributos (não acumula com Bênção dos Reis)"] },
  ];
  const ICON = (i) => `../assets/prof/${i}.jpg`;

  // ---- qual escolher
  const RAIDE = { Druida: "Couraria", "Caçador": "Couraria", Ladino: "Couraria", "Xamã": "Couraria", Mago: "Alfaiataria", Sacerdote: "Alfaiataria", Bruxo: "Alfaiataria", Paladino: "Ferraria", Guerreiro: "Ferraria" };
  const PAR = { Couraria: "Esfolamento", Alfaiataria: "Encantamento", Ferraria: "Mineração" };
  function responder() {
    const meta = $("#meta [aria-pressed=true]").dataset.v, cl = $("#classe").value;
    let a = "", b = "";
    if (meta === "upar") { a = "Couraria ou Engenharia"; b = "A Barraca da Couraria enche o descanso até 5% de um nível; a Engenharia põe um vendedor (Robô de Reagentes) no acampamento. Junte com uma de coleta pra bancar os materiais."; }
    if (meta === "ouro") { a = "Duas de coleta: Mineração + Herborismo"; b = "É a dupla mais procurada, mas só dá pra rastrear uma coisa por vez (minério ou planta). Por isso muita gente junta uma das duas com o Esfolamento, que não usa rastreio."; }
    if (meta === "raide") {
      if (cl) { const p = RAIDE[cl]; a = `${p} + ${PAR[p]}`; b = `${p} faz o conjunto de raide de ${cl}. ${PAR[p]} é o par natural (${p === "Alfaiataria" ? "você desencanta o que fabrica e faz a Essência do conjunto" : "dá o material do conjunto"}). E todo mundo vai precisar de um encantador.`; }
      else { a = "A profissão do seu conjunto"; b = "Druida, Caçador, Ladino e Xamã: Couraria. Mago, Sacerdote e Bruxo: Alfaiataria. Paladino e Guerreiro: Ferraria. Escolha sua classe acima pra ver a dupla."; }
    }
    if (meta === "pvp") {
      const caster = ["Mago", "Sacerdote", "Bruxo", "Druida", "Xamã"].includes(cl);
      a = caster ? "Engenharia, ou Alquimia + Herborismo" : "Engenharia";
      b = caster ? "A Engenharia continua forte no PvP. Curador e caster também vão bem de Alquimia com Herborismo." : "Bombas, dinamite e aparelhos: a Engenharia continua a mais forte no PvP.";
    }
    $("#resposta").innerHTML = `<p class="pick">${a}</p><p>${b}</p><p class="also">E as três secundárias (Culinária, Primeiros Socorros e Pesca) todo mundo deveria ter: não ocupam vaga.</p>`;
  }
  function chips(sel, fn) {
    document.querySelectorAll(`${sel} button`).forEach((bt) => bt.addEventListener("click", () => {
      document.querySelectorAll(`${sel} button`).forEach((x) => x.setAttribute("aria-pressed", x === bt));
      fn();
    }));
  }
  chips("#meta", responder); $("#classe").addEventListener("change", responder); responder();

  // ---- legado
  const prod = P.filter((p) => p.t === "producao");
  $("#legacy").innerHTML = prod.map((p, i) => `<div class="leg"><img src="${ICON(p.ic)}" alt="" width="36" height="36" loading="lazy"><span>${p.n}</span>
    ${[150, 225, 300].map((lv) => `<label><input type="checkbox" data-i="${i}" data-lv="${lv}">${lv}</label>`).join("")}</div>`).join("");
  const KEY = "omurloc-legado";
  let saved = {}; try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
  document.querySelectorAll("#legacy input").forEach((c) => {
    c.checked = !!saved[c.dataset.i + "-" + c.dataset.lv];
    c.addEventListener("change", () => {
      // marcar 300 marca 150 e 225 (o ponto vem ao passar por cada faixa)
      const row = [...document.querySelectorAll(`#legacy input[data-i="${c.dataset.i}"]`)];
      row.forEach((x) => { if (c.checked && +x.dataset.lv < +c.dataset.lv) x.checked = true; if (!c.checked && +x.dataset.lv > +c.dataset.lv) x.checked = false; });
      contar();
    });
  });
  function contar() {
    const st = {}; let n = 0;
    document.querySelectorAll("#legacy input").forEach((c) => { if (c.checked) { n++; st[c.dataset.i + "-" + c.dataset.lv] = 1; } });
    $("#leg-total").textContent = n; try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  }
  contar();

  // ---- fogueira
  $("#camp tbody").innerHTML = P.map((p) => `<tr><td>${p.n}</td><td>${p.fog[0]}</td><td>${p.fog[1]}</td></tr>`).join("");

  // ---- fichas
  function fichas() {
    const f = $("#tipo [aria-pressed=true]").dataset.v;
    $("#profs").innerHTML = P.filter((p) => f === "todas" || p.t === f).map((p) => `<article class="prof" id="${p.n.normalize("NFD").replace(/[^\w]/g, "").toLowerCase()}">
      <header><img src="${ICON(p.ic)}" alt="" width="48" height="48" loading="lazy"><div><h3>${p.n}</h3><span class="tag">${{ coleta: "Coleta", producao: "Produção", secundaria: "Secundária" }[p.t]}</span></div></header>
      <dl><dt>O que mudou</dt><dd>${p.mudou}</dd><dt>Como upar (1 a 300)</dt><dd>${p.upar}</dd><dt>Como fazer ouro</dt><dd>${p.ouro}</dd>
      <dt>Combina com</dt><dd>${p.combina}</dd><dt>Na fogueira</dt><dd>${p.fog[0]}: ${p.fog[1]}</dd></dl></article>`).join("");
  }
  chips("#tipo", fichas); fichas();

  // anuncios (AdSense): um push por bloco
  document.querySelectorAll(".adsbygoogle").forEach(() => { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {} });
})();
