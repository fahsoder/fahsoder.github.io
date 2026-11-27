# -*- coding: utf-8 -*-
"""Grava no HTML o conteudo que o JS monta (fichas, tabela, calculadora, resposta padrao), para o Google ler sem rodar script
(politica do AdSense: tela sem conteudo do editor). Rodar depois de mudar profissoes/profissoes.js: python scripts/prerender.py"""
import re, http.server, threading, functools
from pathlib import Path
from playwright.sync_api import sync_playwright
R = Path(__file__).resolve().parent.parent
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(R))
class Q(H.func):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8766), functools.partial(Q, directory=str(R))); threading.Thread(target=srv.serve_forever, daemon=True).start()
PAGES = {"profissoes/index.html": ["#resposta", "#legacy", "#camp tbody", "#profs"]}
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.route("**/pagead2.googlesyndication.com/**", lambda r: r.abort())
    for f, sels in PAGES.items():
        pg.goto(f"http://127.0.0.1:8766/{f.replace('index.html', '')}"); pg.wait_for_timeout(1500)
        pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(1500)
        src = (R / f).read_text(encoding="utf-8")
        for s in sels:
            inner = pg.inner_html(s)
            idsel = s.split()[0][1:]
            if s.endswith("tbody"):
                src = re.sub(r"(<table class=\"camp\" id=\"camp\">.*?<tbody>).*?(</tbody>)", lambda m: m.group(1) + inner + m.group(2), src, flags=re.S)
            else:
                src = re.sub(rf'(<div class="[^"]*" id="{idsel}"[^>]*>).*?(</div><!--/{idsel}-->)', lambda m: m.group(1) + inner + m.group(2), src, flags=re.S)
        (R / f).write_text(src, encoding="utf-8"); print("ok", f)
    b.close()
srv.shutdown()
