(() => {
  const PAGE = 12;
  const NEW_DAYS = 7;
  const $ = (s) => document.querySelector(s);
  const esc = (s = "") => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const fmtViews = (n) => {
    if (!n) return "";
    const v = n >= 1e6 ? (n / 1e6).toFixed(1).replace(".0", "") + " mi" : n >= 1e3 ? (n / 1e3).toFixed(1).replace(".0", "") + " mil" : String(n);
    return `${v.replace(".", ",")} visualizações`;
  };
  const ago = (iso) => {
    const s = (Date.now() - new Date(iso)) / 1000;
    const units = [[31536000, "ano", "anos"], [2592000, "mês", "meses"], [604800, "semana", "semanas"], [86400, "dia", "dias"], [3600, "hora", "horas"], [60, "minuto", "minutos"]];
    for (const [sec, one, many] of units) {
      const n = Math.floor(s / sec);
      if (n >= 1) return `há ${n} ${n === 1 ? one : many}`;
    }
    return "agora mesmo";
  };
  const isNew = (v) => Date.now() - new Date(v.published) < NEW_DAYS * 864e5;
  const thumb = (v, hi) => `https://i.ytimg.com/vi/${v.id}/${hi ? "maxresdefault" : "hqdefault"}.jpg`;
  const ytUrl = (v) => (v.type === "short" ? `https://www.youtube.com/shorts/${v.id}` : `https://www.youtube.com/watch?v=${v.id}`);
  const meta = (v) => ago(v.published) || "";

  const thumbBtn = (v, hi) => `
    <button class="thumb" data-play="${v.id}" aria-label="Assistir: ${esc(v.title)}">
      <img src="${thumb(v, hi)}" alt="" loading="lazy" ${hi ? `onerror="this.onerror=null;this.src='${thumb(v)}'"` : ""} />
      <span class="play"></span>
    </button>`;

  let all = [];
  let filter = "all";
  let shown = PAGE;

  function renderFeature(el, v, kind) {
    if (!v) {
      el.innerHTML = `<div class="empty">Nenhum ${kind === "short" ? "Short" : "vídeo"} ainda.</div>`;
      return;
    }
    el.innerHTML = `
      ${thumbBtn(v, kind !== "short")}
      <div class="info">
        <span class="label">${isNew(v) ? '<span class="badge-new">Novo</span>' : ""}${kind === "short" ? "Último Short" : "Último vídeo"}</span>
        <h3>${esc(v.title)}</h3>
        <div class="meta">${meta(v)}</div>
      </div>`;
  }

  function renderShorts(list) {
    $("#shorts-list").innerHTML = list.length
      ? list.slice(0, 15).map((v) => `
        <article class="short-card">
          ${thumbBtn(v)}
          <h3>${esc(v.title)}</h3>
          <div class="meta">${meta(v)}</div>
        </article>`).join("")
      : `<div class="empty">Os Shorts aparecem aqui assim que saírem.</div>`;
  }

  function renderPopular(list) {
    $("#popular-list").innerHTML = list.length
      ? list.map((v, i) => `
        <li>
          ${thumbBtn(v, i === 0)}
          <div class="info">
            <h3>${esc(v.title)}</h3>
            <div class="meta">${meta(v)}</div>
          </div>
        </li>`).join("")
      : `<div class="empty">Ainda calculando os mais assistidos.</div>`;
  }

  function renderAll() {
    const list = filter === "all" ? all : all.filter((v) => v.type === filter);
    $("#all-list").innerHTML = list.length
      ? list.slice(0, shown).map((v) => `
        <article class="card ${v.type === "short" ? "is-short" : ""}">
          ${thumbBtn(v)}
          <h3>${esc(v.title)}</h3>
          <div class="meta">${v.type === "short" ? '<span class="tag-short">Short</span> · ' : ""}${meta(v)}</div>
        </article>`).join("")
      : `<div class="empty">Nada por aqui ainda.</div>`;
    $("#load-more").hidden = list.length <= shown;
  }

  // Player em janela, sem sair do site
  const dlg = $("#player");
  const ROOT = document.body.dataset.root || "";
  function openPlayer(id) {
    if (!dlg) return;
    const v = all.find((x) => x.id === id);
    if (!v) return;
    const frame = dlg.querySelector(".frame");
    frame.classList.toggle("vertical", v.type === "short");
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    dlg.querySelector("h3").textContent = v.title;
    dlg.querySelector(".player-meta a").href = ytUrl(v);
    dlg.showModal();
  }
  const closePlayer = () => { dlg.close(); };
  if (dlg) {
    dlg.addEventListener("close", () => { dlg.querySelector(".frame").innerHTML = ""; });
    dlg.querySelector(".close").addEventListener("click", closePlayer);
    dlg.addEventListener("click", (e) => { if (e.target === dlg) closePlayer(); });
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-play]");
    if (b) openPlayer(b.dataset.play);
  });

  document.querySelectorAll(".tabs button").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelectorAll(".tabs button").forEach((x) => x.setAttribute("aria-selected", x === b));
      filter = b.dataset.filter;
      shown = PAGE;
      renderAll();
    })
  );
  if ($("#load-more")) $("#load-more").addEventListener("click", () => { shown += PAGE; renderAll(); });

  fetch(`${ROOT}data/videos.json?t=${Date.now()}`)
    .then((r) => r.json())
    .then((db) => {
      all = Object.values(db.videos || {}).sort((a, b) => new Date(b.published) - new Date(a.published));
      const videos = all.filter((v) => v.type !== "short");
      const shorts = all.filter((v) => v.type === "short");

      const ranked = (videos.length ? videos : all).slice().sort((a, b) => {
        const ra = a.popularRank ?? Infinity, rb = b.popularRank ?? Infinity;
        return ra !== rb ? ra - rb : (b.views || 0) - (a.views || 0);
      });

      if (videos[0]) document.querySelectorAll("[data-latest]").forEach((a) => { a.href = `https://www.youtube.com/watch?v=${videos[0].id}`; });
      if (!$("#all-list")) return;  // pagina inicial: so os links do video novo
      renderFeature($("#latest-video"), videos[0], "video");
      renderFeature($("#latest-short"), shorts[0], "short");
      renderShorts(shorts);
      renderPopular(ranked.slice(0, 6));
      renderAll();

      if (db.updatedAt && $("#updated")) $("#updated").textContent = `Última novidade detectada ${ago(db.updatedAt)}.`;
      const newest = all[0];
      if (newest && isNew(newest)) document.title = `Novo: ${newest.title} — O MURLOC`;
    })
    .catch(() => {
      if ($("#latest-video")) $("#latest-video").innerHTML = `<div class="empty">Não deu pra carregar os vídeos agora. Tenta de novo em instantes.</div>`;
    });
})();
