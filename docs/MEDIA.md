# Mídia editorial v0.4

As treze cenas foram produzidas com geração de imagem e selecionadas como ilustração interpretativa. Não são fotografias, mapas, retratos de pessoas bíblicas nem reconstruções arqueológicas. Cada imagem possui uma variante pequena para telas de até 800 px; `src/media/manifest.ts` define alt, legenda e contexto.

| ID | Arquivo | Uso |
| --- | --- | --- |
| I01 | `atlas-hero.webp` | Hero com a linha vetorial sobreposta |
| I02 | `queda-jerusalem.webp` | Destaque e evento da queda de Jerusalém |
| I03 | `jornada-abraao.webp` | Narrativas patriarcais |
| I04 | `sinai-deserto.webp` | Êxodo e Sinai |
| I05 | `jerusalem-reinos.webp` | Monarquia unida |
| I06 | `retorno-exilio.webp` | Retorno do exílio |
| I07 | `galileia-seculo-i.webp` | Contexto do ministério de Jesus |
| I08 | `porto-igreja-primitiva.webp` | Igreja primitiva |
| I09 | `canaa-juizes.webp` | Paisagem temática para conquista e juízes |
| I10 | `reinos-divididos.webp` | Reino dividido e eventos da expansão assíria |
| I11 | `mediterraneo-helenistico.webp` | Ambiente do período intertestamentário |
| I12 | `belem-noite.webp` | Contexto do nascimento de Jesus |
| I13 | `jerusalem-seculo-i.webp` | Contexto da morte e ressurreição de Jesus |
| — | `textura-papel.webp` | Fundo sutil; uso opcional |

As cenas aparecem nos cartões de períodos e na lista vertical da cronologia. Os três novos arquivos foram convertidos para WebP a 1536 × 1024 e 800 × 533 px. Cidades, embarcações e paisagens são composições genéricas; a associação a um período não identifica um sítio arqueológico.

O mapa `mapa-levante.svg` é uma grade esquemática de referência, sem contornos políticos, rotas ou localizações antigas inferidas. Os pontos modernos aproximados foram conferidos em [OpenStreetMap Wiki: Jerusalém](https://wiki.openstreetmap.org/wiki/Jerusalem), [OpenStreetMap Wiki: Damasco](https://wiki.openstreetmap.org/wiki/Damascus) e [Serviço Meteorológico Palestino: estações](https://www.pmd.ps/en/stations-coordinates) para Belém. A posição antiga de sítios e as fronteiras de Canaã, Israel e Judá exigem tratamento próprio. A rota de Paulo ainda não foi desenhada porque este catálogo não fornece todas as paradas e coordenadas com fonte suficiente. Não conectar automaticamente lugares apenas por ordem de eventos.

## Prompts de origem das imagens

Estilo comum: pintura digital editorial de atlas bíblico, leve textura de gravura e papel, verde profundo `#173D3E`, dourado fosco `#C89B4A`, papel `#F8F6F0`, oliva `#677D63`, luz natural quente. Figuras pequenas e sem rosto discernível. Sem texto, logos, objetos modernos, divindades, fantasia ou aparência de registro fotográfico.

- I01: caminho sinuoso em colinas secas, vale e curso de água ao pôr do sol; metade esquerda mais escura para sobreposição vetorial.
- I02: muralhas distantes após conflito, fumaça tênue, sem violência gráfica nem arquitetura afirmada como exata.
- I03: pequena caravana e tendas distantes nas colinas do Levante.
- I04: montanhas rochosas e acampamento diminuto no deserto ao amanhecer.
- I05: cidade genérica de pedra sobre colina, sem templo reconstruído.
- I06: viajantes distantes em estrada de vale junto a rio, horizonte aberto.
- I07: lago da Galileia e dois barcos ao amanhecer, sem Jesus identificável.
- I08: pequeno porto mediterrâneo antigo com barcos e viajantes distantes.
- I09: colinas e aldeias genéricas de Canaã, terraços cultivados e caminho em primeiro plano, sem batalha ou personagem identificável.
- I10: duas cidades genéricas em colinas separadas por vale e estrada, sem monumento específico ou governante.
- I11: porto mediterrâneo genérico com embarcações, cais e povoado, sem inscrição, bandeira ou monumento identificado.
- I12: aldeia genérica nas colinas da Judeia à noite, sem personagens bíblicos ou arquitetura específica de Belém.
- I13: cidade murada genérica nas colinas da Judeia ao entardecer, sem cruzes nem reconstrução do templo ou de Jerusalém.
- Textura: padrão quadrado discreto de fibra de papel/linho, contraste baixíssimo.
