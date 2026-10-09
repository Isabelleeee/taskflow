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
- Todas: inclui pendentes, atrasadas e concluídas.
- Concluídas: tarefas finalizadas, com opção de reabrir.
- Cadastro e edição em modal; exclusão com confirmação.
- Busca por título, descrição e projeto, combinada com filtro de projeto.
- Indicadores globais de pendentes, vencimento hoje e concluídas.
- Estados de carregamento, lista vazia e erro; interface responsiva.

## Organização

- `src/components/Layout.tsx`: Sidebar, Header, Outlet e apresentação do TaskModal.
- `src/components/TaskModal.tsx`: diálogo acessível com fechamento por Escape, foco nativo e TaskForm.
- `src/components/TaskForm.tsx`: campos e envio do cadastro/edição.
- `src/context/TarefasContext.tsx`: estado compartilhado, carregamento e operações de tarefas.
- `src/services/tarefaService.ts`: Axios/API e modo local explícito.
- `src/pages/TaskPage.tsx`: página reutilizada nas quatro rotas.
- `src/utils/tarefas.ts`: seleção, ordenação e datas locais.

## Verificação

```cmd
npm test
npm run build
npm run preview
```

Os 10 testes automatizados verificam filtros e operações da camada de serviço. Os testes de API usam mocks: para validar o endpoint real, faça o roteiro abaixo após configurar CrudCrud.

1. Crie tarefa com título, descrição, prazo, prioridade e projeto.
2. Recarregue a página e confira a persistência.
3. Edite título e prioridade e recarregue novamente.
4. Conclua a tarefa; veja-a em Concluídas; reabra.
5. Busque pelo título e filtre pelo projeto.
6. Exclua e recarregue: a tarefa deve continuar ausente.
7. Teste uma URL inválida: deve aparecer erro com opção de tentar novamente.
8. Confira navegação e menu em tela pequena.

## GitHub e trabalho em grupo

Veja `GUIA_GITHUB.md`. Este pacote contém a implementação preparada com auxílio do ChatGPT; não contém histórico atribuído aos integrantes. O registro de autoria e participação deve corresponder às alterações realmente realizadas. O código pronto, sozinho, não comprova o critério de desenvolvimento colaborativo do enunciado.
