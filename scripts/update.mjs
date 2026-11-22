// Atualiza data/videos.json a partir dos feeds RSS públicos do YouTube.
// Não precisa de chave de API. Roda no GitHub Actions (Node 20+).
//
// Feeds usados (o sufixo do channel ID é o mesmo, só muda o prefixo):
//   UULF... -> vídeos longos   UUSH... -> Shorts   UULP... -> uploads populares
// Cada feed devolve só os 15 itens mais recentes/populares, então o script
// acumula o histórico no próprio JSON e só atualiza views/títulos.

import { readFile, writeFile } from "node:fs/promises";

const CHANNEL_ID = process.env.CHANNEL_ID || "UCQT7eGprwnshcTUS_mXLGBA";
const OUT = new URL("../data/videos.json", import.meta.url);
const suffix = CHANNEL_ID.slice(2);

const FEEDS = {
  videos: `https://www.youtube.com/feeds/videos.xml?playlist_id=UULF${suffix}`,
  shorts: `https://www.youtube.com/feeds/videos.xml?playlist_id=UUSH${suffix}`,
  popular: `https://www.youtube.com/feeds/videos.xml?playlist_id=UULP${suffix}`,
  all: `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
};

const decode = (s = "") =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1].trim()) : "";
};
const attr = (xml, name, a) => {
  const m = xml.match(new RegExp(`<${name}[^>]*\\b${a}="([^"]*)"`));
  return m ? decode(m[1]) : "";
};

export function parseFeed(xml) {
  const channelTitle = tag(xml.split("<entry>")[0], "title");
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
    id: tag(e, "yt:videoId"),
    title: tag(e, "title"),
    published: tag(e, "published"),
    updated: tag(e, "updated"),
    description: tag(e, "media:description").slice(0, 280),
    views: Number(attr(e, "media:statistics", "views")) || 0,
    likes: Number(attr(e, "media:starRating", "count")) || 0,
  }));
  return { channelTitle, entries: entries.filter((e) => e.id) };
}

async function getFeed(url) {
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 omurloc-site" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parseFeed(await res.text());
  } catch (err) {
    console.warn(`Falha ao ler ${url}: ${err.message}`);
    return null;
  }
}

async function main() {
  let db = { channel: {}, videos: {} };
  try {
    db = JSON.parse(await readFile(OUT, "utf8"));
  } catch {}
  db.videos ||= {};
  const before = JSON.stringify(db.videos);

  const [videos, shorts, popular, all] = await Promise.all([
    getFeed(FEEDS.videos),
    getFeed(FEEDS.shorts),
    getFeed(FEEDS.popular),
    getFeed(FEEDS.all),
  ]);

  if (!videos && !shorts && !all) {
    console.error("Nenhum feed respondeu; mantendo dados atuais.");
    return;
  }

  const upsert = (e, patch = {}) => {
    const prev = db.videos[e.id] || {};
    db.videos[e.id] = { ...prev, ...e, ...patch, views: Math.max(e.views, prev.views || 0) };
  };

  videos?.entries.forEach((e) => upsert(e, { type: "video" }));
  shorts?.entries.forEach((e) => upsert(e, { type: "short" }));
  // Feed geral cobre o caso de os feeds por tipo falharem; não sobrescreve o tipo.
  all?.entries.forEach((e) => upsert(e, { type: db.videos[e.id]?.type || "video" }));
  // Ranking popular do próprio YouTube (posição 0 = mais popular).
  if (popular) {
    Object.values(db.videos).forEach((v) => delete v.popularRank);
    popular.entries.forEach((e, i) => upsert(e, { type: db.videos[e.id]?.type || "video", popularRank: i }));
  }

  db.channel = {
    id: CHANNEL_ID,
    title: all?.channelTitle?.replace(/^Uploads from /, "") || db.channel.title || "O Murloc",
    url: `https://www.youtube.com/channel/${CHANNEL_ID}`,
  };
  const after = JSON.stringify(db.videos);
  if (after === before) {
    console.log("Nada novo no canal.");
    return;
  }
  db.updatedAt = new Date().toISOString();

  await writeFile(OUT, JSON.stringify(db, null, 2) + "\n");
  const list = Object.values(db.videos);
  console.log(
    `OK: ${list.filter((v) => v.type === "video").length} vídeos, ${list.filter((v) => v.type === "short").length} shorts.`
  );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
