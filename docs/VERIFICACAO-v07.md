# Verificação — consulta da vida de Jesus, v0.7

Verificado em 2 de outubro de 2026.

- Tipagem TypeScript e build de produção com base `/cronologia-biblica-interativa/` aprovados.
- 7 arquivos de testes, 21 testes aprovados. Incluem filtros da página de Jesus, vínculos ao catálogo, busca, preservação da rota anterior e integridade dos contêineres WebP do manifesto.
- 24 verificações de navegação em Chromium, em telas de 320, 390, 768 e 1366 px. Sem erros de JavaScript ou respostas HTTP de erro nos recursos locais.
- Página de Jesus: oito momentos, quatro Evangelhos, filtros por etapa, atualização de estado acessível, ativação por teclado e atalhos para seções. Imagem principal e oito imagens dos momentos decodificadas, sem substitutos por falha.
- Imagens responsivas: variante menor até 800 px e variante principal no desktop.
- Navegação para os novos eventos, crucificação no endereço legado, destaque da página inicial, períodos da cronologia e ficha genérica de Débora aprovada.
- Sem rolagem horizontal da página nos quatro tamanhos. Menu móvel opaco e fechamento com Escape preservados.
- Inspeção visual das capturas da página e da etapa de ministério. Filtros em duas colunas no celular, imagens e referências legíveis.
- Todos os WebP de produção foram decodificados com Pillow. Recuperados os dois arquivos antigos que estavam vazios, descritos em [MEDIA-v07.md](MEDIA-v07.md).

Os novos registros apresentam referências bíblicas e faixas de data. A sequência visual é editorial e não atribui datas exatas a acontecimentos sem ano informado nas passagens. Os detalhes da geração de imagens e os prompts estão em [MEDIA-v07.md](MEDIA-v07.md).
