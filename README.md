# TaskFlow

Gerenciador de tarefas da disciplina Desenvolvimento Mobile. React, TypeScript, React Router, Axios e Vite.

**Equipe:** Isabelle Lopes, Artur Sudre e Murilo Rocha.

## Executar no Windows

Instale Node.js com npm. Extraia este ZIP, abra a pasta `taskflow`, clique na barra de endereço do Explorador, digite `cmd` e pressione Enter.

```cmd
npm install
copy .env.example .env
npm run dev
```

Abra o endereço informado no terminal (normalmente http://localhost:5173). Mantenha o terminal aberto; Ctrl+C encerra o servidor.

## Configurar a API da aula

A configuração inicial usa armazenamento local para permitir testar sem um endpoint. Esse modo salva apenas no navegador atual e **não substitui a integração com CrudCrud exigida na aula**.

Acesse https://crudcrud.com, obtenha um endpoint e altere `.env`:

```env
VITE_STORAGE_MODE=crudcrud
VITE_API_URL=https://crudcrud.com/api/IDENTIFICADOR_REAL
```

Use a URL base, sem `/tarefas`. Reinicie `npm run dev`. O modo API utiliza GET, POST, PUT e DELETE em `/tarefas`; no PUT o `_id` não é enviado no corpo. Nenhuma falha da API é convertida silenciosamente em armazenamento local. As tarefas dos dois modos são independentes; não há migração automática. Se o endpoint deixar de funcionar, substitua-o e reinicie o servidor. A URL VITE é visível no navegador.

## Funcionalidades

- Hoje: tarefas pendentes com prazo na data local atual.
- Próximas: tarefas pendentes com prazo depois de hoje.
- Tarefas: todas as pendentes, independentemente da data (inclui atrasadas).
- Concluídas: tarefas finalizadas, com opção de reabrir.
- Cadastro e edição no mesmo TaskModal (POST na criação, PUT com o mesmo `_id` na edição); conclusão/reabertura pelo botão do TaskCard; exclusão com confirmação.
- As quatro visualizações são estado derivado do array `tarefas` do contexto (`filter`), sem coleções paralelas.
- Busca por título, descrição e projeto, combinada com filtro de projeto.
- Indicadores globais de pendentes, vencimento hoje e concluídas.
- Estados de carregamento, lista vazia e erro; interface responsiva.

## Organização

- `src/components/Layout.tsx`: Sidebar, Header, Outlet, TaskModal e referência da tarefa em edição.
- `src/components/TaskModal.tsx`: diálogo; decide entre `adicionarTarefa` e `alterarTarefa` conforme a tarefa recebida.
- `src/components/TaskForm.tsx`: campos; estado inicial vazio (criação) ou com os valores persistidos (edição).
- `src/context/TarefasContext.tsx`: estado compartilhado; `adicionarTarefa`, `alterarTarefa`, `alternarConclusao`, `removerTarefa`.
- `src/services/tarefaService.ts`: Axios/API (`listarTarefas`, `criarTarefa`, `alterarTarefa`, `excluirTarefa`) e modo local explícito.
- `src/pages/Tasks.tsx`: página parametrizada por `visao: VisaoTarefas`, reutilizada nas quatro rotas.
- `src/utils/tarefas.ts`: `obterDataAtual`, predicados, critérios por visualização e ordenação.

## Verificação

```cmd
npm test
npm run build
npm run preview
```

Os 11 testes automatizados verificam filtros e operações da camada de serviço. Os testes de API usam mocks: para validar o endpoint real, faça o roteiro abaixo após configurar CrudCrud.

1. Crie tarefa com título, descrição, prazo, prioridade e projeto.
2. Recarregue a página e confira a persistência.
3. Edite título e prioridade e recarregue novamente.
4. Confira no CrudCrud que o `_id` não mudou após a edição.
5. Em Hoje, conclua a tarefa: ela sai de Hoje e aparece em Concluídas; reabra e confira o retorno.
6. Busque pelo título e filtre pelo projeto.
7. Exclua e recarregue: a tarefa deve continuar ausente.
8. Teste uma URL inválida: deve aparecer erro com opção de tentar novamente.
9. Confira navegação e menu em tela pequena.

## GitHub e trabalho em grupo

Veja `GUIA_GITHUB.md`. Este pacote contém a implementação preparada com auxílio do ChatGPT; a evolução de edição, conclusão e reutilização foi preparada com auxílio do Claude; não contém histórico atribuído aos integrantes. O registro de autoria e participação deve corresponder às alterações realmente realizadas. O código pronto, sozinho, não comprova o critério de desenvolvimento colaborativo do enunciado.
