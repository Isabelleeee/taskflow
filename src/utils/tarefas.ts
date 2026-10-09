import type { Tarefa } from '../types/Tarefa';
export function hojeLocal() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
export type Visao = 'hoje' | 'proximas' | 'todas' | 'concluidas';
export function filtrarTarefas(tarefas: Tarefa[], visao: Visao, busca = '', projeto = '', hoje = hojeLocal()) {
  return tarefas.filter(t => (visao === 'todas' || (visao === 'concluidas' ? t.concluida : !t.concluida && (visao === 'hoje' ? t.data === hoje : t.data > hoje))) && (!projeto || t.projeto === projeto) && `${t.titulo} ${t.descricao} ${t.projeto}`.toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR'))).sort((a,b) => a.data.localeCompare(b.data));
}
export function formatarData(data: string) { return new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR', {day:'2-digit',month:'short',year:'numeric'}); }
