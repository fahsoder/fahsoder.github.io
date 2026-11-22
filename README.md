# Site do canal O Murloc

Site estático que lista automaticamente os vídeos e Shorts do canal [@omurloc](https://www.youtube.com/@omurloc), com destaque para o último lançamento e para os mais assistidos.

- **Hospedagem:** GitHub Pages (grátis)
- **Atualização:** GitHub Actions roda a cada hora, lê os feeds RSS públicos do YouTube e atualiza `data/videos.json`. Não precisa de chave de API.
- **Separação vídeo/Short:** usa as playlists automáticas do YouTube (`UULF…` = vídeos longos, `UUSH…` = Shorts, `UULP…` = populares).

## Publicar (uma vez só)

1. Crie um repositório público no GitHub, por exemplo `omurloc-site`, e suba estes arquivos na branch `main`.
2. Em **Settings → Pages → Build and deployment → Source**, escolha **GitHub Actions**.
3. Em **Actions**, abra "Atualizar e publicar site" e clique em **Run workflow**.
4. Em ~1 minuto o site estará em `https://<seu-usuario>.github.io/omurloc-site/`.

Daí em diante é sozinho: postou vídeo ou Short, em até uma hora ele aparece no site com o selo **Novo** (fica por 7 dias).

## Ajustes rápidos

| O quê | Onde |
|---|---|
| Canal (channel ID) | `CHANNEL_ID` em `scripts/update.mjs` |
| Frequência | `cron` em `.github/workflows/update.yml` |
| Textos do topo | `index.html` (seção `hero`) |
| Cores | variáveis no topo de `styles.css` (`--cyan` é a cor da legenda do canal) |
| Dias com selo "Novo" / itens por página | `NEW_DAYS` e `PAGE` em `app.js` |

## Observações

- Os feeds do YouTube trazem só os 15 itens mais recentes de cada lista; o script vai acumulando o histórico no JSON a cada execução. Vídeos mais antigos que isso no dia da instalação podem não aparecer em "Todos os vídeos" (os populares aparecem pelo feed `UULP`).
- O GitHub pausa agendamentos em repositórios sem nenhum commit por 60 dias. Como o próprio robô faz commit quando sai vídeo novo, isso só acontece se o canal ficar 2 meses parado; aí é só clicar em "Run workflow" de novo.
- Domínio próprio: Settings → Pages → Custom domain.

## Atualizar o site depois de editar

Rode `publicar.bat` (ou `git add -A && git commit -m "..." && git push`). O deploy roda sozinho a cada push.
