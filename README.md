# Cronologia Bíblica Interativa

Aplicação web responsiva para explorar acontecimentos, personagens, livros e lugares bíblicos em uma linha do tempo conectada.

## Começar

Requer Node.js 22 ou superior e npm.

```bash
npm install
npm run dev
```

## Verificações e build

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

O build final fica em `dist/`.

## Recursos desta versão

- Consulta de 66 livros do cânon protestante (39 AT, 27 NT), em ordem bíblica e por faixas propostas de composição.
- Autoria tradicional ou identificação debatida descrita por livro; composição e contexto narrado aparecem separadamente.
- 31 personagens, incluindo Melquisedeque, João Batista, Maria Madalena, Estêvão, Barnabé, Lídia, Priscila e outros da igreja inicial.
- Cronologia horizontal e lista por período no celular. Começa apenas com acontecimentos; as demais camadas são opcionais.
- Busca aproximada em português para eventos, pessoas, livros, lugares e impérios.
- Comparação de personagens com faixas biográficas disponíveis, referências bíblicas e fontes de contexto.
- 16 cenas editoriais interpretativas, PWA e rotas para hospedagem estática.

Favoritos, anotações, histórico e visões salvas permanecem implementados e no armazenamento local, porém a interface de estudo pessoal está suspensa nesta versão de consulta. Nenhum dado local é apagado na atualização.

## Convenção cronológica

Os anos são números inteiros assinados: `-1000` representa 1000 a.C. e `1` representa 1 d.C. A convenção histórica não possui ano zero; os valores são destinados à ordenação e visualização, não a cálculos de duração que atravessem a transição entre eras. O número negativo maior em valor absoluto ocorreu antes: `-1000` vem antes de `-586`.

`dateType` separa datas estabelecidas, aproximadas, debatidas, faixas e datas desconhecidas. Uma posição na linha do tempo pode ser uma estimativa de visualização: o rótulo e a descrição do registro devem ser lidos antes de tratar a posição como uma data precisa.

## Dados

Os registros ficam em `src/data/` como JSON. O acesso é centralizado em `src/repositories/catalogRepository.ts`; componentes não importam arquivos de dados diretamente. Para ampliar o catálogo:

1. Adicione o registro ao JSON correspondente.
2. Use IDs existentes nas relações ou crie o novo registro relacionado.
3. Inclua referências bíblicas estruturadas e `dateType`.
4. Para afirmações cronológicas ou extrabíblicas, acrescente uma fonte em `sources.json` e relacione o `sourceId`.
5. Rode `npm run typecheck`, `npm test` e `npm run build`.

Os 66 livros estão catalogados, mas os eventos e personagens ainda são uma seleção em expansão. Autoria e data de composição são questões complexas; os intervalos numéricos são propostas editoriais amplas, não datas exatas ou consenso universal. Livros sem data única ficam fora do eixo numérico de composição. Os registros de origens e de pessoas sem biografia datável podem ter posições técnicas apenas para agrupamento; a interface mostra a incerteza.

## Dados locais preservados

`src/services/` mantém histórico, favoritos, notas e visões da cronologia. A interface de escrita e recuperação está oculta enquanto o produto funciona como consulta. As chaves anteriores do `localStorage` foram mantidas; o recurso pode voltar em uma versão futura sem migrar ou apagar dados.

## Publicar grátis no GitHub Pages

O workflow `.github/workflows/deploy.yml` verifica tipos e testes, cria o build e publica a pasta `dist`. Para um repositório de projeto:

1. Envie o repositório para o GitHub com a branch `main`.
2. Em **Settings → Pages**, escolha **GitHub Actions** como origem.
3. Aguarde a execução do workflow e abra o endereço exibido pelo GitHub Pages.

O workflow define `VITE_BASE_PATH` com o nome do repositório e copia o `index.html` para `404.html` para permitir acesso direto às rotas. Para hospedagem em domínio raiz local ou própria, `npm run build` usa `/` como base.

## Evolução futura

Para adicionar sincronização, login ou administração remota, implemente uma nova camada por trás das interfaces de repositório e serviço. Supabase ou Firebase não são dependências desta versão. A UI e os JSONs atuais podem ser preservados enquanto se adiciona uma fonte remota.

## Atualização visual v0.2

A cronologia oferece uma lista vertical por período no celular e conserva o panorama horizontal como alternativa. As imagens em `public/media/v2/` são ilustrações interpretativas, não reconstruções ou retratos históricos. O catálogo, as rotas e os dados de favoritos, notas e visões salvas no navegador permanecem com as mesmas chaves.

O mapa regional em páginas de lugar marca apenas Jerusalém, Belém e Damasco com posições aproximadas de cidades atuais. Outros lugares continuam descritos em texto até haver base geográfica específica. Consulte `docs/MEDIA.md` para ativos, fontes e limitações editoriais.

## Atualização visual v0.3

Três novas cenas cobrem conquista e juízes, reino dividido e período intertestamentário. Os cartões das eras e a lista vertical no celular usam as imagens do período com rótulo de ilustração interpretativa. A exportação do estudo permite guardar e transferir os dados locais sem criar uma conta.

## Ajustes visuais v0.4

Os eventos de nascimento e morte/ressurreição de Jesus têm cenas próprias, diferenciadas da paisagem da Galileia. Foram corrigidos a largura da cronologia em telas estreitas, a rolagem lateral involuntária em Explorar e o destaque comprimido da Home. Os botões de categoria em Explorar agora anunciam seu estado como filtros; **Meu estudo** mostra a contagem real de anotações.

## Atualização de consulta v0.5

O catálogo cobre os 66 livros conforme a organização protestante. A página **Livros** distingue ordem canônica e início aproximado da faixa de composição; faixas podem se sobrepor. A ordem sugerida na visualização de composição não determina qual obra foi finalizada antes. Autores são mostrados como atribuições tradicionais quando apropriado; Hebreus permanece anônimo. A página usa fontes gerais da Society of Biblical Literature e da American Bible Society, cujos panoramas não validam isoladamente cada intervalo numérico do catálogo.

Foram acrescentados personagens e eventos com referências, sem atribuir datas de nascimento ou morte a Melquisedeque ou a outras pessoas cuja vida não pode ser datada. As novas ilustrações estão documentadas em `docs/MEDIA.md`. A navegação e os controles de estudo pessoal foram ocultos; o código e os dados locais foram preservados.
