import type { Tarefa, VisaoTarefas } from '../types/Tarefa';

// Data local no mesmo formato do input type="date" (AAAA-MM-DD).
export function obterDataAtual() {
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

// Predicados: cada um avalia uma condição e devolve true ou false.
export const estaConcluida = (tarefa: Tarefa) => tarefa.concluida;
export const estaPendente = (tarefa: Tarefa) => !tarefa.concluida;
export const venceEm = (tarefa: Tarefa, data: string) => tarefa.data === data;
// Strings AAAA-MM-DD com a mesma estrutura mantêm a ordem cronológica.
export const venceDepoisDe = (tarefa: Tarefa, data: string) => tarefa.data > data;

// Critério de seleção de cada visualização (estado derivado de "tarefas").
export const criterios: Record<VisaoTarefas, (tarefa: Tarefa, hoje: string) => boolean> = {
  tarefas: (tarefa) => estaPendente(tarefa),
  hoje: (tarefa, hoje) => estaPendente(tarefa) && venceEm(tarefa, hoje),
  proximas: (tarefa, hoje) => estaPendente(tarefa) && venceDepoisDe(tarefa, hoje),
  concluidas: (tarefa) => estaConcluida(tarefa),
};

function correspondeBusca(tarefa: Tarefa, busca: string) {
  const texto = `${tarefa.titulo} ${tarefa.descricao} ${tarefa.projeto}`.toLocaleLowerCase('pt-BR');
  return texto.includes(busca.toLocaleLowerCase('pt-BR'));
}

export function filtrarTarefas(
  tarefas: Tarefa[],
  visao: VisaoTarefas,
  busca = '',
  projeto = '',
  hoje = obterDataAtual(),
) {
  return tarefas
    .filter((tarefa) => criterios[visao](tarefa, hoje))
    .filter((tarefa) => !projeto || tarefa.projeto === projeto)
    .filter((tarefa) => correspondeBusca(tarefa, busca))
    .sort((a, b) => a.data.localeCompare(b.data));
}

export function formatarData(data: string) {
  return new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
