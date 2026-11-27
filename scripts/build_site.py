# -*- coding: utf-8 -*-
"""Gera as paginas estaticas do site (conteudo no HTML, para o Google ler; politica do AdSense):
/classes/ e /classes/<classe>/ (conjuntos fabricados de raide, conjuntos de masmorra, talentos quando houver data/talentos.json),
/addons/ quando houver data/addons.json. Uso: python scripts/build_site.py"""
import json, html
from pathlib import Path
R = Path(__file__).resolve().parent.parent
E = html.escape
PUB = "ca-pub-1590515754889833"
CLASSES = [("Druida", "druida", "druid", "Couro"), ("Caçador", "cacador", "hunter", "Malha"), ("Mago", "mago", "mage", "Tecido"),
           ("Paladino", "paladino", "paladin", "Placa"), ("Sacerdote", "sacerdote", "priest", "Tecido"), ("Ladino", "ladino", "rogue", "Couro"),
           ("Xamã", "xama", "shaman", "Malha"), ("Bruxo", "bruxo", "warlock", "Tecido"), ("Guerreiro", "guerreiro", "warrior", "Placa")]
TIPO = {"cloth": "Tecido", "leather": "Couro", "mail": "Malha", "plate": "Placa"}
SET_CLASSE = {"The Elements": ["Xamã"], "Beaststalker Armor": ["Caçador"], "Shadowcraft Armor": ["Ladino"], "Wildheart Raiment": ["Druida"],
              "Vestments of the Devout": ["Sacerdote"], "Magister's Regalia": ["Mago"], "Dreadmist Raiment": ["Bruxo"], "Battlegear of Valor": ["Guerreiro"],
              "Lightforge Armor": ["Paladino"], "Spider's Kiss": ["Ladino"], "Dal'Rend's Arms": ["Guerreiro", "Ladino"]}
SLOT = {"head": "Cabeça", "shoulder": "Ombros", "chest": "Peito", "wrist": "Pulsos", "hands": "Mãos", "waist": "Cintura", "legs": "Pernas", "feet": "Pés",
        "finger": "Anel", "main hand": "Mão principal", "one-hand": "Uma mão", "two-hand": "Duas mãos", "off hand": "Mão secundária"}


def page(title, desc, slug, body, depth, ads=True, nav_extra=""):
    up = "../" * depth
    ad = f'<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={PUB}" crossorigin="anonymous"></script>' if ads else ""
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{E(title)}</title>
  <meta name="description" content="{E(desc)}" />
  <meta property="og:title" content="{E(title)}" />
  <meta property="og:description" content="{E(desc)}" />
  <meta property="og:image" content="{up}assets/og.jpg" />
  <meta name="theme-color" content="#07090d" />
  <meta name="google-adsense-account" content="{PUB}" />
  <link rel="canonical" href="https://omurloc.com.br/{slug}" />
  <link rel="icon" href="{up}assets/favicon.png" type="image/png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,400;0,600;0,700;1,700;1,800;1,900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="{up}styles.css" />
  <link rel="stylesheet" href="{up}tools.css" />
  {ad}
</head>
<body>
  <header class="top">
    <a class="brand" href="{up}"><img src="{up}assets/icone.png" alt="" width="40" height="40" /><span class="brand-text">O MURLOC</span></a>
    <nav><a href="{up}guias/">Guias</a><a href="{up}classes/">Classes</a>{nav_extra}<a href="{up}videos/">Vídeos</a><a href="{up}#apoie">Apoie</a></nav>
    <a class="btn sub" href="https://www.youtube.com/@omurloc?sub_confirmation=1" target="_blank" rel="noopener">Inscrever-se</a>
  </header>
  <main class="tool">
{body}
  </main>
  <footer>
    <span class="brand-text">O MURLOC</span>
    <p><a href="{up}">Início</a> · <a href="{up}guias/">Guias</a> · <a href="{up}classes/">Classes</a> · <a href="{up}videos/">Vídeos</a> · <a href="{up}sobre/">Sobre</a> · <a href="{up}privacidade/">Privacidade</a></p>
    <p class="muted">O MURLOC é um projeto de fã, sem ligação com a Blizzard Entertainment.</p>
  </footer>
  {"<script>document.querySelectorAll('.adsbygoogle').forEach(()=>{try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){}})</script>" if ads else ""}
</body>
</html>
"""


AD = f'<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="{PUB}" data-ad-format="auto" data-full-width-responsive="true"></ins></div>'


def nav_extra():
    s = ""
    if (R / "data" / "talentos.json").exists(): s += '<a href="{up}talentos/">Talentos</a>'
    if (R / "data" / "addons.json").exists(): s += '<a href="{up}addons/">Addons</a>'
    return s


def build_classes():
    raide = json.load(open(R / "data" / "conjuntos_raide.json", encoding="utf-8"))
    masm = json.load(open(R / "data" / "conjuntos_masmorra.json", encoding="utf-8"))
    tal = json.load(open(R / "data" / "talentos.json", encoding="utf-8")) if (R / "data" / "talentos.json").exists() else {}
    cards = ""
    for nome, slug, en, arm in CLASSES:
        r = raide["classes"][nome]
        cards += f'<a class="tool-card class-card" href="{slug}/"><img src="../assets/classes/{en}.jpg" alt="" width="56" height="56"><div><h3>{E(nome)}</h3><p>{arm} · tier set fabricado com {r["prof"]} · {len(r["sets"])} conjunto(s) de raide</p></div></a>'
        # ---- pagina da classe
        b = f"""    <section class="tool-head">
      <p class="kicker">Classe · WoW Forever</p>
      <h1><img class="h1-ic" src="../../assets/classes/{en}.jpg" alt="" width="64" height="64">{E(nome)} no WoW Forever</h1>
      <p class="lead">Tudo que o {E(nome)} precisa saber no Forever: o conjunto de raide fabricado de cada especialização, a profissão que faz, os bônus e os conjuntos de masmorra que servem pra você enquanto upa.</p>
      <p class="facts">Armadura: <b>{arm}</b> · Profissão do conjunto de raide: <b>{r["prof"]}</b> no 300 · Raides abrem em <b>09/12/2026</b></p>
    </section>
"""
        if nome in tal:
            b += render_talentos(nome, tal[nome])
        b += '    <section class="block"><div class="block-head"><h2>Conjuntos de raide fabricados</h2><span class="hint">Bônus provisórios: a Blizzard ainda pode mudar</span></div>\n      <div class="sets">'
        for sname, spec, bon in r["sets"]:
            lis = "".join(f"<li><b>{n} peças:</b> {E(x)}</li>" for n, x in zip((2, 3, 4, 5), bon))
            b += f'<article class="set"><h3>{E(sname)}</h3><p class="tag">{E(spec)} · {E(r["prof"])}</p><ul>{lis}</ul></article>'
        b += "</div>\n      <ul class=\"rules\">" + "".join(f"<li>{E(x)}</li>" for x in raide["_regras"]) + "</ul>\n"
        b += f'      <p class="note">Quer saber se vale pegar {E(r["prof"])}? Veja o <a href="../../profissoes/">guia de profissões do Forever</a>.</p></section>\n'
        b += "    " + AD + "\n"
        mine = [s for s in masm if nome in SET_CLASSE.get(s["n"], []) or (s["n"] not in SET_CLASSE and any(TIPO.get(t) == arm for t in s["tipo"]))]
        mine.sort(key=lambda s: s["req"] or 0)
        b += f'    <section class="block"><div class="block-head"><h2>Conjuntos de masmorra</h2><span class="hint">{"Da sua classe e do seu tipo de armadura · bônus com o texto do jogo, em inglês" if mine else ""}</span></div>\n      <div class="sets">'
        for s in mine:
            lis = "".join(f"<li><b>{n} peças:</b> {E(x)}</li>" for n, x in s["bonus"])
            pcs = "".join(f"<li>{E(p['n'])} <span class='muted'>({SLOT.get(p['slot'], p['slot'])}) · {E(p['src'][0][0])}{' · ' + E(p['src'][0][1]) if p['src'][0][1] not in ('Trash', 'Trash Drop') and not p['src'][0][1].startswith('(') else ''}</span></li>" for p in s["pecas"])
            feito = "feito pra " + E(nome) if nome in SET_CLASSE.get(s["n"], []) else "do seu tipo de armadura"
            b += f'<article class="set"><h3>{E(s["n"])}</h3><p class="tag">Nível {s["req"]} · {feito}</p><ul>{lis}</ul><details><summary>Onde cai cada peça</summary><ul class="pcs">{pcs}</ul></details></article>'
        b += "</div></section>\n"
        b += '    <p class="sources">Fontes: banco de dados do Wowhead para o WoW Forever (atributos e bônus liberados por hotfix; a Blizzard confirmou ao Wowhead que os bônus dos conjuntos fabricados são provisórios) e anúncio oficial das raides da Blizzard. Conferido em novembro de 2026.</p>\n'
        b += f'    <p class="other">Outras classes: ' + " · ".join(f'<a href="../{s}/">{E(n)}</a>' for n, s, _, _ in CLASSES if s != slug) + "</p>"
        d = R / "classes" / slug; d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(page(f"{nome} no WoW Forever: tier set, conjuntos e talentos — O MURLOC",
                                           f"{nome} no WoW Forever: conjunto de raide fabricado de cada especialização ({r['prof']}), bônus, conjuntos de masmorra e onde cai cada peça.",
                                           f"classes/{slug}/", b, 2, nav_extra=nav_extra().replace("{up}", "../../")), encoding="utf-8")
    body = f"""    <section class="tool-head">
      <p class="kicker">Classes · WoW Forever</p>
      <h1>As 9 classes do WoW Forever</h1>
      <p class="lead">Escolha sua classe para ver o conjunto de raide fabricado de cada especialização, a profissão que faz, os bônus e os conjuntos de masmorra que servem pra você enquanto upa.</p>
    </section>
    <section class="block"><div class="tools">{cards}</div></section>
"""
    (R / "classes" / "index.html").write_text(page("Classes do WoW Forever: tier sets, conjuntos e talentos — O MURLOC",
                                                    "Guia por classe do WoW Forever: tier set fabricado, profissão, bônus e conjuntos de masmorra das 9 classes.",
                                                    "classes/", body, 1, ads=False, nav_extra=nav_extra().replace("{up}", "../")), encoding="utf-8")


def render_talentos(nome, t):
    rows = ""
    for x in t.get("builds", []):
        link = f'<a class="btn ghost" href="{E(x["link"])}" target="_blank" rel="noopener">Abrir a build</a>' if x.get("link") else ""
        rows += f'<article class="set"><h3>{E(x["spec"])}</h3><p class="tag">{E(x["objetivo"])}{" · " + E(x["pontos"]) if x.get("pontos") else ""}</p><p>{E(x.get("chave", ""))}</p>{link}</article>'
    notas = "".join(f"<li>{E(n)}</li>" for n in t.get("mudancas", []))
    return (f'    <section class="block" id="talentos"><div class="block-head"><h2>Talentos</h2><span class="hint">Builds dos guias do Forever, com link pra abrir pronta</span></div>\n'
            f'      <div class="sets">{rows}</div>' + (f'<ul class="rules">{notas}</ul>' if notas else "") +
            (f'<p class="sources">Fonte dos talentos: {E(t["fonte"])}</p>' if t.get("fonte") else "") + "</section>\n")


def build_guias():
    cards = [("../profissoes/", "Qual profissão escolher?", "Escolha pela meta (upar, ouro, raide ou PvP) e pela classe. Com calculadora de Legado, bônus da fogueira e as 12 profissões."),
             ("../classes/", "Guia por classe", "Tier set fabricado de cada especialização, profissão, bônus e conjuntos de masmorra das 9 classes.")]
    if (R / "data" / "talentos.json").exists(): cards.append(("../talentos/", "Talentos", "Builds de talento por classe e especialização, com link pra abrir pronta no calculador."))
    if (R / "data" / "addons.json").exists(): cards.append(("../addons/", "Addons", "Os addons que funcionam no WoW Forever, por categoria, com link oficial de download."))
    c = "".join(f'<a class="tool-card" href="{h}"><h3>{E(t)}</h3><p>{E(d)}</p></a>' for h, t, d in cards)
    body = f"""    <section class="tool-head"><p class="kicker">Guias · WoW Forever</p><h1>Guias do WoW Forever</h1>
      <p class="lead">Ferramentas e listas pra decidir rápido antes de logar, feitas pelo canal O MURLOC com base nos anúncios da Blizzard e nos dados do jogo.</p></section>
    <section class="block"><div class="tools">{c}</div></section>"""
    (R / "guias").mkdir(exist_ok=True)
    (R / "guias" / "index.html").write_text(page("Guias do WoW Forever — O MURLOC", "Guias e ferramentas do WoW Forever: profissões, classes, talentos e addons.", "guias/", body, 1, ads=False,
                                                nav_extra=nav_extra().replace("{up}", "../")), encoding="utf-8")


def build_addons():
    f = R / "data" / "addons.json"
    if not f.exists(): return
    a = json.load(open(f, encoding="utf-8"))
    idx = " · ".join(f'<a href="#c{i}">{E(c["cat"])}</a>' for i, c in enumerate(a["categorias"]))
    b = f"""    <section class="tool-head"><p class="kicker">Addons · WoW Forever</p><h1>Addons do WoW Forever</h1>
      <p class="lead">Os addons que já têm versão para o WoW Forever, separados por categoria, com o que cada um faz e o link oficial. Só entra aqui o addon cuja página lista o Forever entre as versões, com arquivo para baixar (conferido em {a["conferido"]}).</p>
      <ul class="rules">{"".join(f"<li>{E(x)}</li>" for x in a["dicas"])}</ul>
      <p class="other">Pular para: {idx}</p></section>
"""
    for i, c in enumerate(a["categorias"]):
        rows = "".join(f'<tr><td><a href="{E(x["link"])}" target="_blank" rel="noopener nofollow">{E(x["n"])}</a></td><td>{E(x["faz"])}</td><td class="muted">{E(x["evid"])}</td></tr>' for x in c["addons"])
        b += f'    <section class="block" id="c{i}"><div class="block-head"><h2>{E(c["cat"])}</h2><span class="hint">{len(c["addons"])} addons</span></div><div class="table-wrap"><table class="camp addons"><thead><tr><th>Addon</th><th>O que faz</th><th>Versão do Forever</th></tr></thead><tbody>{rows}</tbody></table></div></section>\n'
        if i in (1, 4): b += "    " + AD + "\n"
    rows = "".join(f'<tr><td><a href="{E(x["link"])}" target="_blank" rel="noopener nofollow">{E(x["n"])}</a></td><td>{E(x["situacao"])}</td></tr>' for x in a["sem_confirmacao"])
    b += f'    <section class="block"><div class="block-head"><h2>Ainda sem versão confirmada</h2><span class="hint">Não garantimos que funcionam</span></div><div class="table-wrap"><table class="camp addons"><thead><tr><th>Addon</th><th>Situação</th></tr></thead><tbody>{rows}</tbody></table></div></section>\n'
    b += '    <p class="sources">Fontes: ' + "; ".join(E(x) for x in a["fontes"]) + '. Os addons são de seus autores; o O MURLOC só indica. Baixe sempre do link oficial.</p>'
    (R / "addons").mkdir(exist_ok=True)
    (R / "addons" / "index.html").write_text(page("Addons do WoW Forever: lista dos que funcionam (2026) — O MURLOC",
        "Lista de addons que funcionam no WoW Forever: Questie, Auctionator, DBM, Details, ForeverAuras e mais, por categoria, com link oficial e versão conferida.",
        "addons/", b, 1, nav_extra=nav_extra().replace("{up}", "../")), encoding="utf-8")


def build_home():
    p = R / "index.html"; s = p.read_text(encoding="utf-8")
    import re
    cards = ""; nav = ""
    if (R / "data" / "talentos.json").exists():
        cards += '<a class="tool-card" href="talentos/"><h3>Talentos</h3><p>Builds de talento de cada classe e especialização do Forever, com link pra abrir pronta no calculador.</p></a>'
        nav += '<a href="talentos/">Talentos</a>'
    if (R / "data" / "addons.json").exists():
        cards += '<a class="tool-card" href="addons/"><h3>Addons</h3><p>Os addons que já funcionam no WoW Forever, por categoria, com o link oficial e a versão conferida.</p></a>'
        nav += '<a href="addons/">Addons</a>'
    s = re.sub(r"<!--CARDS_EXTRA-->.*?<!--/CARDS_EXTRA-->|<!--CARDS_EXTRA-->", f"<!--CARDS_EXTRA-->{cards}<!--/CARDS_EXTRA-->", s, flags=re.S)
    s = re.sub(r"<!--NAV_EXTRA-->.*?<!--/NAV_EXTRA-->|<!--NAV_EXTRA-->", f"<!--NAV_EXTRA-->{nav}<!--/NAV_EXTRA-->", s, flags=re.S)
    p.write_text(s, encoding="utf-8")


if __name__ == "__main__":
    build_classes()
    build_guias()
    build_addons()
    build_home()
    print("ok classes")
