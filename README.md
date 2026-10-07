# LEP Filmes — Redesign experimental

Versão independente e estática para exploração de uma presença digital mais cinematográfica para a LEP Filmes. Este projeto não altera o site público e mantém os arquivos originais fornecidos na raiz do diretório.

## Como abrir

Use um servidor estático local, como a extensão Live Server do VS Code, e abra `index.html` por HTTP. Não há dependências de build. Abrir diretamente por `file://` permite ver o layout, mas o YouTube pode bloquear os trailers sem a identificação de origem enviada pelo navegador.

## Estrutura

```text
LEP_Redesign/
├── index.html
├── pages/                 # Quem somos, produções, equipe e contato
├── producoes/             # Páginas individuais das obras
├── assets/images/         # Cópias dos materiais visuais fornecidos
├── css/styles.css
├── js/productions.js      # Fonte única dos dados editoriais
├── js/site.js             # Navegação e componentes compartilhados
└── js/detail.js           # Renderização das páginas individuais
```

## Dados das produções

Edite `js/productions.js` para incluir uma nova obra. Cada objeto aceita `title`, `type`, `year`, `synopsis`, `cover`, `trailer`, `netflix`, `instagram`, `credits`, `featured` e `notes`. Só preencha campos que tenham fonte verificável. Para uma página individual, copie uma das páginas em `producoes/`, ajuste `data-production` e inclua o novo `slug`.

## Fontes consultadas

- Site institucional da LEP Filmes: https://www.lepfilmes.com.br/
- Equipe da LEP: https://www.lepfilmes.com.br/equipe/
- Contato da LEP: https://www.lepfilmes.com.br/contato/
- Netflix, *Ronaldinho Gaúcho*: https://www.netflix.com/br/title/81731400
- Trailer oficial de *Ronaldinho Gaúcho*: https://www.youtube.com/watch?v=bHfQtgCYLXc
- Festival do Rio, *A Conspiração Condor*: https://www.festivaldorio.com.br/br/edicoes-anteriores/2025/filmes/a-conspiracao-condor
- Festival do Rio, lista de filmes habilitados para a seleção brasileira do Oscar 2027: https://www.festivaldorio.com.br/br/noticias/filmes-exibidos-e-premiados-no-festival-do-rio-estao-entre-os-habilitados-a-representar-o-brasil-no-oscar-2027
- Instagram oficial: https://www.instagram.com/lepfilmes_/

## Limites de verificação

O Instagram não foi usado para confirmar posts específicos, pois a navegação pública disponível não permitiu validar conteúdo individual. Por isso, os CTAs de Instagram apontam para o perfil oficial, sem sugerir que sejam posts da obra. As imagens no redesign são cópias locais dos materiais entregues pelo usuário; não foram baixadas imagens de Netflix, Instagram ou outras fontes externas. Os anos de catálogo seguem o briefing da LEP: `Cordialmente Teus` (2024), `A Conspiração Condor` (2026) e `Ronaldinho Gaúcho` (2026). A nota sobre a exibição de Condor no Festival do Rio 2025 foi preservada.

## Abertura e mídias

- A logo usa diretamente `assets/brand/20250715_LEP_Filmes_FlatColors_White.png`.
- O original fornecido está em `assets/video/lep-intro.mov.mov`: ProRes 4444, 3840 × 2160, 8,47 segundos e aproximadamente 274 MB. Esse codec não exibiu imagem no navegador de teste.
- `assets/video/lep-intro.mp4` é a única mídia derivada adicionada: H.264, 1920 × 1080, aproximadamente 1,06 MB, sem áudio e com fast start. Necessária para reprodução web; o original permanece intacto.
- A abertura toca silenciosamente, uma vez por sessão da aba, com reprodução inline, opção de pular e transição para a home. Falha de carregamento, autoplay bloqueado ou interrupção prolongada libera a página. A preferência de movimento reduzido pula a intro.
- Para rever a abertura, abra o endereço em uma nova aba independente ou remova a chave `lep-intro-seen` do Session Storage nas ferramentas do navegador.
- Retratos usam os arquivos de `assets/team/`. As bordas de interface presentes nas capturas de Liz, Bia e Myia são ocultadas por enquadramento CSS, sem editar ou duplicar imagens.
- O menu usa um diálogo nativo: mantém o foco dentro do menu, fecha com Escape e devolve o foco ao botão.

## Revisão local

1. Conferir abertura, botão “Pular abertura” e transição em Safari/iPhone e Chrome/Android reais.
2. Reproduzir os dois trailers e conferir áudio e tela cheia.
3. Revisar fotos, enquadramentos, textos, anos e cargos.
4. Conferir menu, navegação por teclado, páginas individuais e contato.
5. Em conexão lenta, confirmar que a abertura pode ser pulada e não impede o acesso ao site.

Nenhum deploy, push ou publicação é necessário para esta revisão.
