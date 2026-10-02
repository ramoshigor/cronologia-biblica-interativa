export interface EditorialImage {
  id: string
  file: string
  width: number
  height: number
  alt: string
  caption: string
  focalPoint: string
}

const image = (id: string, file: string, alt: string, caption: string, width = 1536, height = 1024): EditorialImage => ({ id, file, width, height, alt, caption, focalPoint: 'center' })

export const editorialImages = {
  hero: image('I01', 'atlas-hero', 'Paisagem ilustrada com caminho entre colinas do antigo Oriente Próximo.', 'Ilustração interpretativa do ambiente antigo.', 1672, 941),
  fall: image('I02', 'queda-jerusalem', 'Muralhas de uma cidade antiga vistas à distância após um conflito.', 'Ilustração interpretativa da queda de Jerusalém.'),
  abraham: image('I03', 'jornada-abraao', 'Pequena caravana atravessa colinas áridas.', 'Ilustração interpretativa da jornada patriarcal.'),
  sinai: image('I04', 'sinai-deserto', 'Montanhas rochosas e pequeno acampamento no deserto.', 'Ilustração interpretativa do cenário do Sinai.'),
  kingdom: image('I05', 'jerusalem-reinos', 'Cidade de pedra sobre uma colina no antigo Levante.', 'Ilustração interpretativa do período dos reinos.'),
  return: image('I06', 'retorno-exilio', 'Viajantes seguem por uma estrada em um vale próximo a um rio.', 'Ilustração interpretativa do retorno do exílio.'),
  galilee: image('I07', 'galileia-seculo-i', 'Lago da Galileia com barcos distantes ao amanhecer.', 'Ilustração interpretativa da Galileia no século I.', 800, 533),
  church: image('I08', 'porto-igreja-primitiva', 'Pequeno porto mediterrâneo com barcos e viajantes.', 'Ilustração interpretativa das viagens da igreja primitiva.'),
  judges: image('I09', 'canaa-juizes', 'Colinas, campos e aldeias em uma paisagem de Canaã.', 'Ilustração interpretativa do período dos juízes.'),
  divided: image('I10', 'reinos-divididos', 'Duas cidades distantes em colinas separadas por um vale.', 'Ilustração interpretativa dos reinos de Israel e Judá.'),
  hellenistic: image('I11', 'mediterraneo-helenistico', 'Porto mediterrâneo com embarcações e povoado nas colinas.', 'Ilustração interpretativa do ambiente mediterrâneo entre os Testamentos.'),
  bethlehem: image('I12', 'belem-noite', 'Aldeia genérica nas colinas da Judeia sob o céu noturno.', 'Ilustração interpretativa do ambiente do nascimento de Jesus.'),
  jerusalemFirstCentury: image('I13', 'jerusalem-seculo-i', 'Cidade murada genérica nas colinas da Judeia ao entardecer.', 'Ilustração interpretativa do ambiente de Jerusalém no século I.'),
  melchizedek: image('I14', 'melquisedeque-salem', 'Viajantes encontram um sacerdote diante de uma cidade antiga sobre colinas.', 'Ilustração interpretativa de Gênesis 14.'),
  manuscripts: image('I15', 'manuscritos-biblicos', 'Rolos e manuscritos em uma mesa próxima ao mar Mediterrâneo.', 'Ilustração interpretativa da transmissão dos textos bíblicos.'),
  jordan: image('I16', 'joao-jordao', 'Pessoas ouvem um pregador junto a um rio em uma paisagem antiga.', 'Ilustração interpretativa do ministério de João Batista.'),
  deborah: image('I17', 'debora-palmeira', 'Mulher sentada sob uma palmeira conversa com um grupo nas colinas de Israel.', 'Ilustração interpretativa de Débora em Juízes 4.'),
  ruth: image('I18', 'rute-colheita', 'Mulher recolhe espigas em um campo com ceifeiros e colinas ao fundo.', 'Ilustração interpretativa de Rute 2.'),
  teaching: image('I19', 'priscila-aquila-apolo', 'Uma mulher e dois homens conversam junto a uma mesa com rolos em um pátio antigo.', 'Ilustração interpretativa do ensino em Atos 18.'),
  jesusTeaching: image('I20', 'jesus-ensino-monte', 'Jesus sentado em uma colina ensina um grupo de pessoas, com o lago da Galileia ao fundo.', 'Ilustração interpretativa do ensino no monte em Mateus 5.'),
  lastSupper: image('I21', 'jesus-ultima-ceia', 'Jesus e os apóstolos reunidos ao redor de uma mesa baixa em uma sala iluminada por lamparinas.', 'Ilustração interpretativa da última ceia em Lucas 22.'),
  emptyTomb: image('I22', 'jesus-tumulo-vazio', 'Três mulheres se aproximam de um túmulo aberto em um jardim ao amanhecer.', 'Ilustração interpretativa dos relatos do túmulo vazio em Marcos 16 e Lucas 24.'),
} satisfies Record<string, EditorialImage>

export const imageForEvent: Record<string, EditorialImage> = {
  'jerusalem-fall': editorialImages.fall,
  'call-of-abraham': editorialImages.abraham,
  'covenant-abraham': editorialImages.abraham,
  exodus: editorialImages.sinai,
  'sinai-covenant': editorialImages.sinai,
  'anointing-saul': editorialImages.kingdom,
  'anointing-david': editorialImages.kingdom,
  'david-goliath': editorialImages.kingdom,
  'jerusalem-david': editorialImages.kingdom,
  'united-monarchy': editorialImages.kingdom,
  'first-temple': editorialImages.kingdom,
  'return-exile': editorialImages.return,
  'birth-jesus': editorialImages.bethlehem,
  'crucifixion': editorialImages.jerusalemFirstCentury,
  pentecost: editorialImages.church,
  'paul-conversion': editorialImages.church,
  'first-journey': editorialImages.church,
  'council-jerusalem': editorialImages.church,
  'cornelius-conversion': editorialImages.church,
  'kingdom-divided': editorialImages.divided,
  'elijah-carmel': editorialImages.divided,
  'assyria-samaria': editorialImages.divided,
  'jerusalem-assyria': editorialImages.divided,
  'melchizedek-meets-abraham': editorialImages.melchizedek,
  'john-baptist-ministry': editorialImages.jordan,
  'stephen-witness': editorialImages.church,
  'jordan-crossing': editorialImages.judges,
  'second-temple': editorialImages.return,
  'ezra-reading': editorialImages.return,
  'jesus-baptism': editorialImages.jordan,
  'deborah-barak': editorialImages.deborah,
  'ruth-bethlehem': editorialImages.ruth,
  'ephesus-teaching': editorialImages.teaching,
  'jacob-bethel': editorialImages.abraham,
  'hannah-samuel': editorialImages.judges,
  'nehemiah-walls': editorialImages.return,
  'thomas-risen': editorialImages.jerusalemFirstCentury,
  'first-disciples': editorialImages.galilee,
  'sermon-mount': editorialImages.jesusTeaching,
  'last-supper': editorialImages.lastSupper,
  'empty-tomb': editorialImages.emptyTomb,
  'philippi-gospel': editorialImages.church,
}

export const imageForPerson: Record<string, EditorialImage> = {
  jesus: editorialImages.jesusTeaching,
  melchizedek: editorialImages.melchizedek,
  'john-baptist': editorialImages.jordan,
  deborah: editorialImages.deborah,
  ruth: editorialImages.ruth,
  priscilla: editorialImages.teaching,
  aquila: editorialImages.teaching,
  apollos: editorialImages.teaching,
}

export const imageForPeriod: Record<string, EditorialImage> = {
  patriarchs: editorialImages.abraham,
  exodus: editorialImages.sinai,
  conquest: editorialImages.judges,
  united: editorialImages.kingdom,
  divided: editorialImages.divided,
  exile: editorialImages.fall,
  return: editorialImages.return,
  intertestamental: editorialImages.hellenistic,
  jesus: editorialImages.galilee,
  church: editorialImages.church,
}
