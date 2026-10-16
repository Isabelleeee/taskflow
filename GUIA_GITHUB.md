# Integracao pelo GitHub

## Etapa 1 - estrutura inicial (concluida)

Branches isabelle, artur e murilo, integradas na main por merge commit. Preservadas.

## Etapa 2 - edicao, conclusao e reutilizacao das tasks

Branches evolucao-isabelle, evolucao-artur e evolucao-murilo partem da main atual.

| Branch | Responsabilidade |
|---|---|
| evolucao-artur | `alterarTarefa` no service, `alterarTarefa`/`alternarConclusao` no contexto, `VisaoTarefas`, predicados e testes |
| evolucao-murilo | TaskCard (concluir/reabrir), TaskForm/TaskModal em criacao e edicao, `Tasks.tsx` parametrizado |
| evolucao-isabelle | Layout com tarefa em edicao, rotas com `<Tasks visao=...>`, navegacao, estilos e documentacao |

1. Cada integrante abre o PR da propria branch, base main.
2. Isabelle integra os tres PRs com **Create a merge commit**, na ordem artur, murilo, isabelle. Sem squash/rebase; branches preservadas.
3. O build completo exige os tres merges (as branches dependem umas das outras).
4. Depois: git pull --ff-only origin main, npm ci, npm test, npm run build, npm run dev com o .env do CrudCrud.

Os commits foram preparados por automacao (etapa 1 com assistencia do ChatGPT; etapa 2 com assistencia do Claude). A autoria declarada no Git e configuravel; o PR registra a conta que o abriu.
