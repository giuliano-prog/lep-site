# Conteúdo, idiomas e catálogo

O site continua em HTML, CSS e JavaScript, sem framework ou etapa de build.

## Idiomas

- Português é o padrão. `?lang=en` seleciona inglês em qualquer página.
- O seletor preserva a rota, os outros parâmetros (inclusive `intro=teste`) e a âncora.
- Links internos mantêm o idioma. Links externos conservam os endereços originais.
- `js/translations.js` contém pares `[português, inglês]` identificados por chaves estáveis.
- Nas páginas, use `data-i18n`, `data-i18n-aria`, `data-i18n-alt` ou `data-i18n-content` conforme o atributo a traduzir.
- `js/i18n.js` resolve idioma, conteúdo e URLs. O HTML editorial das traduções é confiável; não colocar conteúdo digitado por visitantes nesses campos.
- As páginas existentes mantêm seus layouts. O footer e as duas intros mantêm apresentação e comportamento; seus controles e rótulos acompanham o idioma.

## Adicionar uma produção

1. Adicione o item em `js/productions.js`: `slug`, título oficial, tipo, ano, sinopse, diretor, imagens, trailer e plataformas.
2. Preencha `en` com tipo, sinopse, notas e créditos traduzidos. Preserve nomes próprios e títulos oficiais. `homeCategory` tem campos `pt` e `en`.
3. Use `featured: true` para exibir na Home. A ordem é a ordem do catálogo.
4. Crie `producoes/<slug>.html` usando o template existente e defina `data-production` no body.
5. A busca e a página de Produções passam a incluir o novo item automaticamente.

`js/production-showcase.js` usa o mesmo catálogo para as apresentações da Home e de Produções. A Home usa capa, título e direção sobre a imagem, categoria/ano, sinopse, CTA e logos. A página interna preserva sua apresentação anterior. `js/detail.js` atende as páginas individuais.

A busca aceita trechos de títulos, ignora maiúsculas e acentos e considera títulos oficiais e eventuais títulos ingleses cadastrados. É local, sem serviços externos. Resultados usam `textContent`, evitando interpretar consultas como HTML.

## Trailers

Os players são criados sincronamente no clique, sem carregamento anterior. A capa e suas camadas são removidas juntas. YouTube e Vimeo usam autoplay e reprodução inline; no mobile o início é silencioso para compatibilidade com políticas de autoplay. O visitante ativa o áudio no player. No Vimeo, preserve o código de acesso de vídeos não listados.

Validar sempre por servidor HTTP local. Safari/iPhone real ainda precisa de teste manual; redimensionar o navegador não emula seu motor ou suas políticas de reprodução.

## Logos de streaming

Arquivos vetoriais locais em `assets/streaming/`, obtidos em fontes oficiais:

- Prime Video: https://www.clarotvmais.com.br/img/otts/web/primevideo.svg
- Apple TV: SVG do bloco `landing-devices__apple-tv-logo` em https://tv.apple.com/
- Netflix: símbolo `n-logo-svg` em https://www.netflix.com/
- Claro TV+: https://mondrian.claro.com.br/brands/app/72px-default/claro-tvmais.svg, referenciado em https://www.claro.com.br/claro-tv-mais

Mantidas as proporções e cores dos assets. Nomes acessíveis identificam cada plataforma, e links abrem em nova aba.

## Verificação

Execute `node --test tests/content.test.cjs` para conferir traduções, URLs de idioma, conteúdo do catálogo, assets e rotas locais.

Rota nova: `producoes/abre-a-coxia.html`, também disponível com `?lang=en`.

## Arquivos desta rodada

Alterados:

- `index.html`
- `js/detail.js`, `js/home.js`, `js/intro-test.js`, `js/production-showcase.js`, `js/productions.js`, `js/site.js`
- `pages/contato.html`, `pages/equipe.html`, `pages/nossa-atuacao.html`, `pages/producoes.html`, `pages/quem-somos.html`
- `producoes/a-conspiracao-condor.html`, `producoes/cordialmente-teus.html`, `producoes/ronaldinho-gaucho.html`

Criados:

- `css/home-cinema.css`, `css/navigation.css`
- `js/i18n.js`, `js/translations.js`
- `assets/streaming/apple-tv.svg`, `assets/streaming/claro-tv.svg`, `assets/streaming/netflix.svg`, `assets/streaming/prime-video.svg`
- `producoes/abre-a-coxia.html`
- `tests/content.test.cjs`, `CONTENT.md`

Imagens fornecidas e utilizadas, sem edição: `assets/images/mellisboa.jpg`, `assets/images/ronaldinhogaucho.webp`, `assets/images/abreacoxia.jpg`. Os arquivos preexistentes não rastreados `mellisboa2.jpg` e `ronaldinho.jpg` foram preservados e não são usados nesta apresentação.

## Validação local — 08/10/2026

- Dez rotas conferidas em PT e EN a 320 e 1440 pixels; EN também a 768 pixels. Nenhum overflow horizontal ou texto ultrapassando os limites detectado nessa matriz. Revisão visual da Home e dos controles a 390 pixels.
- Busca por `conspiracao`, `gaucho` e `coxia`, estado sem resultados e navegação mantendo `lang=en`.
- Condor, Ronaldinho e Cordialmente: reprodução observada no YouTube após clique único. Abre a Coxia: reprodução observada no Vimeo com o código privado. Nenhum iframe de trailer carregado antes do clique.
- Abertura principal: ativação de som e pulo. Alternativa: abertura e pulo via `?intro=teste`. Motor da intro principal comparado com a versão anterior e preservado.
- Quatro testes de conteúdo aprovados, sintaxe de todos os scripts válida e `git diff --check` sem problemas.
- Testes feitos no navegador local Chromium; validar Safari/iPhone real, Chrome mobile, rotação, teclado virtual na busca, áudio e tela cheia dos players manualmente. O formulário mantém o comportamento anterior de abrir o aplicativo de e-mail.
