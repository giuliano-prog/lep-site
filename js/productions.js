/* Dados editoriais centralizados. Anos e ordem atualizados conforme briefing da LEP. */
const productions = [
  {
    slug: 'ronaldinho-gaucho',
    title: 'Ronaldinho Gaúcho',
    type: 'Minissérie documental',
    year: '2026',
    synopsis: 'Uma série que percorre a vida e a carreira de Ronaldinho, do início no esporte à projeção como ícone mundial dos dribles.',
    cover: 'assets/images/ronaldinho-gaucho.jpg',
    trailer: 'https://www.youtube.com/watch?v=bHfQtgCYLXc',
    netflix: 'https://www.netflix.com/br/title/81731400',
    instagram: 'https://www.instagram.com/lepfilmes_/',
    featured: true,
    credits: [],
    notes: 'Disponível na Netflix.'
  },
  {
    slug: 'a-conspiracao-condor',
    title: 'A Conspiração Condor',
    type: 'Longa-metragem de ficção',
    year: '2026',
    synopsis: 'Após a morte de Juscelino Kubitschek em 1976, uma jornalista investiga o caso. A morte de João Goulart, meses depois, amplia suas suspeitas.',
    cover: 'assets/images/conspiracao-condor.jpg',
    trailer: 'https://www.youtube.com/watch?v=VgtFbF31UgY',
    instagram: 'https://www.instagram.com/lepfilmes_/',
    featured: true,
    credits: [
      ['Direção', 'André Sturm'],
      ['Roteiro', 'Victor Bonini e André Sturm'],
      ['Produção', 'Liz Reis, Beatriz Reis e André Sturm'],
      ['Empresa produtora', 'LEP Filmes'],
      ['Coprodução', 'Murnau Filmes']
    ],
    notes: 'Exibido na mostra Première Brasil: Hors Concours do Festival do Rio 2025. Habilitado pela Academia Brasileira de Cinema a concorrer à vaga de representante do Brasil no Oscar 2027.'
  },
  {
    slug: 'cordialmente-teus',
    title: 'Cordialmente Teus',
    type: 'Longa-metragem',
    year: '2024',
    synopsis: 'Dez histórias em diferentes momentos da linha do tempo — como 1550, 1891, 1972 e 2083 — abordam revoltas, inquisição, tortura e sobrevivência no Brasil.',
    cover: 'assets/images/cordialmente-teus.jpg',
    trailer: 'https://www.youtube.com/watch?v=-opzTb5bV4w',
    director: 'Aimar Labaki',
    genre: 'Drama / Terror',
    featured: false,
    credits: [['Direção', 'Aimar Labaki'], ['Gênero', 'Drama / Terror']],
    notes: ''
  }
];

// Preserva todas as produções cadastradas após os destaques.
const productionOrder = ['a-conspiracao-condor', 'ronaldinho-gaucho', 'cordialmente-teus'];
productions.sort((a, b) => {
  const rank = item => productionOrder.includes(item.slug) ? productionOrder.indexOf(item.slug) : productionOrder.length;
  return rank(a) - rank(b);
});
