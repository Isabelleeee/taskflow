# Integracao pelo GitHub

As branches isabelle, artur e murilo partem de uma base comum. A main recebe o projeto completo depois dos tres merges.

1. Convide Artur e Murilo em Settings > Collaborators pelos usuarios GitHub. Eles precisam aceitar.
2. Cada integrante abre Compare & pull request da propria branch, base main.
3. Isabelle integra os tres PRs escolhendo **Create a merge commit**. Aprovacao sozinha nao faz o merge.
4. Nao use squash/rebase, e preserve as branches.
5. Depois dos tres merges, execute git pull --ff-only origin main, npm ci, npm test e npm run build.
6. Configure .env com VITE_STORAGE_MODE=crudcrud e VITE_API_URL valido. Reinicie npm run dev e teste as operacoes na API real.

Os commits foram preparados por automacao a partir do codigo fornecido com assistencia do ChatGPT. A autoria declarada no Git e configuravel; o PR registra a conta que o abriu.

Entrega: link deste repositorio, ate 09/11/2026, por uma pessoa do grupo.
