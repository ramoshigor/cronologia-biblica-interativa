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

- Home com eras históricas e acesso ao último conteúdo visitado.
- Cronologia horizontal com períodos, eventos, personagens, impérios e período narrado dos livros.
- Seleção de período, filtros por camada, zoom e visões de filtros salvas no navegador.
- Busca aproximada em português para eventos, pessoas, livros, lugares e impérios.
- Páginas de detalhe para eventos, personagens, livros e lugares.
- Comparação de até três personagens com faixas de vida aproximadas.
- Favoritos e notas locais, sem conta ou serviço externo.
- Instalação PWA e cache básico da aplicação depois da primeira visita online.
- Rotas com endereço legível e fallback para hospedagem estática.

## Convenção cronológica

Os anos são números inteiros assinados: `-1000` representa 1000 a.C. e `1` representa 1 d.C. A convenção histórica não possui ano zero; os valores são destinados à ordenação e visualização, não a cálculos de duração que atravessem a transição entre eras. O número negativo maior em valor absoluto ocorreu antes: `-1000` vem antes de `-586`.

`dateType` separa datas estabelecidas, aproximadas, debatidas, faixas e datas desconhecidas. Uma posição na linha do tempo pode ser uma estimativa de visualização: o rótulo e a descrição do registro devem ser lidos antes de tratar a posição como uma data precisa.

## Dados

Os registros ficam em `src/data/` como JSON. O acesso é centralizado em `src/repositories/catalogRepository.ts`; componentes não importam arquivos de dados diretamente. Para ampliar a amostra:

1. Adicione o registro ao JSON correspondente.
2. Use IDs existentes nas relações ou crie o novo registro relacionado.
3. Inclua referências bíblicas estruturadas e `dateType`.
4. Para afirmações cronológicas ou extrabíblicas, acrescente uma fonte em `sources.json` e relacione o `sourceId`.
5. Rode `npm run typecheck`, `npm test` e `npm run build`.

Os primeiros registros são uma amostra de produto, não um catálogo completo. As datas controversas foram marcadas como debatidas e as estimativas como aproximadas. Referências não substituem consulta ao texto bíblico nem a avaliação das fontes.

## Armazenamento local

`src/services/` centraliza preferências, histórico, favoritos e notas. Favoritos, anotações, visões salvas e itens recentes permanecem no `localStorage` do navegador e não são sincronizados ou enviados a um servidor. Não armazene informação sensível.

## Publicar grátis no GitHub Pages

O workflow `.github/workflows/deploy.yml` verifica tipos e testes, cria o build e publica a pasta `dist`. Para um repositório de projeto:

1. Envie o repositório para o GitHub com a branch `main`.
2. Em **Settings → Pages**, escolha **GitHub Actions** como origem.
3. Aguarde a execução do workflow e abra o endereço exibido pelo GitHub Pages.

O workflow define `VITE_BASE_PATH` com o nome do repositório e copia o `index.html` para `404.html` para permitir acesso direto às rotas. Para hospedagem em domínio raiz local ou própria, `npm run build` usa `/` como base.

## Evolução futura

Para adicionar sincronização, login ou administração remota, implemente uma nova camada por trás das interfaces de repositório e serviço. Supabase ou Firebase não são dependências desta versão. A UI e os JSONs atuais podem ser preservados enquanto se adiciona uma fonte remota.
