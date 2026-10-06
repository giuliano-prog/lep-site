# LEP Filmes — Redesign experimental

Versão independente e estática para exploração de uma presença digital mais cinematográfica para a LEP Filmes. Este projeto não altera o site público e mantém os arquivos originais fornecidos na raiz do diretório.

## Como abrir

Abra `index.html` no navegador. Não há dependências, build ou servidor obrigatório. Para uma prévia mais próxima de produção, pode-se usar qualquer servidor estático, por exemplo a extensão Live Server do VS Code.

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

O Instagram não foi usado para confirmar posts específicos, pois a navegação pública disponível não permitiu validar conteúdo individual. Por isso, os CTAs de Instagram apontam para o perfil oficial, sem sugerir que sejam posts da obra. As imagens no redesign são cópias locais dos materiais entregues pelo usuário; não foram baixadas imagens de Netflix, Instagram ou outras fontes externas. `Cordialmente Teus` é exibido apenas com a informação de participação indicada no material fornecido, sem acrescentar ano, sinopse ou créditos não verificados.
