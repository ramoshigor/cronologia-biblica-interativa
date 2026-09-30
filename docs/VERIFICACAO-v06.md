# Verificação da atualização v0.6

Data: 30/09/2026.

- TypeScript: verificação sem erros.
- Vitest: 18 testes passaram em 5 arquivos. Incluem integridade das relações entre pessoas, eventos, livros e lugares, preservação de notas locais, busca aproximada e navegação por endereço.
- Build de produção concluído com a base `/cronologia-biblica-interativa/`, usada no GitHub Pages.
- Navegador Chromium: 28 combinações de página e tamanho, nas larguras 320, 390, 768 e 1366 px. Nenhuma rolagem lateral involuntária do documento, erro JavaScript ou resposta HTTP de erro.
- Menu: fundo opaco em toda a altura dos links; fechamento por Esc com retorno do foco, toque fora e navegação. Em paisagem de 568 × 320 px, o painel permite rolar até o último item e acessar Livros.
- Cronologia: alternância entre lista e panorama, avanço entre períodos, camadas opcionais, navegação do panorama pelo teclado e rótulos de camada fixos durante a rolagem horizontal.
- Catálogo: filtro de personagens por período; imagens responsivas de Débora, Rute e Áquila carregadas.
- Livros: 66 itens permanecem acessíveis na visualização de composição, com autoria e faixas visuais.

## Escopo e limites

Verificação visual e funcional em Chromium, com larguras simuladas. Não foi realizada uma execução em aparelhos físicos Android ou iOS. As imagens são interpretações artísticas; datas biográficas não disponíveis não foram acrescentadas. Os intervalos de composição existentes foram preservados, e a nova representação mantém a indicação de que podem se sobrepor.
