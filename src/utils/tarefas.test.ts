import { describe, expect, it } from 'vitest';
import { criterios, estaConcluida, filtrarTarefas } from './tarefas';
import type { Tarefa } from '../types/Tarefa';

const tarefas: Tarefa[] = [
  { _id: '1', titulo: 'Revisar React', descricao: 'Contexto', data: '2026-10-09', prioridade: 'high', projeto: 'TaskFlow', concluida: false },
  { _id: '2', titulo: 'Entrega', descricao: 'GitHub', data: '2026-11-09', prioridade: 'medium', projeto: 'TaskFlow', concluida: false },
  { _id: '3', titulo: 'Documento', descricao: '', data: '2026-10-09', prioridade: 'low', projeto: 'Estudos', concluida: true },
  { _id: '4', titulo: 'Atrasada', descricao: '', data: '2026-10-08', prioridade: 'low', projeto: 'Estudos', concluida: false },
];
const ids = (lista: Tarefa[]) => lista.map((t) => t._id);

describe('visões derivadas do mesmo estado', () => {
  it('Tarefas mostra pendentes de qualquer data, incluindo atrasadas', () =>
    expect(ids(filtrarTarefas(tarefas, 'tarefas', '', '', '2026-10-09'))).toEqual(['4', '1', '2']));
  it('Hoje mostra apenas pendentes do dia', () =>
    expect(ids(filtrarTarefas(tarefas, 'hoje', '', '', '2026-10-09'))).toEqual(['1']));
  it('Próximas exclui hoje, atrasadas e concluídas', () =>
    expect(ids(filtrarTarefas(tarefas, 'proximas', '', '', '2026-10-09'))).toEqual(['2']));
  it('Concluídas contém apenas finalizadas', () =>
    expect(ids(filtrarTarefas(tarefas, 'concluidas'))).toEqual(['3']));
  it('combina busca na descrição e projeto', () =>
    expect(ids(filtrarTarefas(tarefas, 'tarefas', 'GITHUB', 'TaskFlow'))).toEqual(['2']));
  it('concluir move a tarefa de Hoje para Concluídas sem alterar outra coleção', () => {
    const concluida = { ...tarefas[0], concluida: !tarefas[0].concluida };
    expect(criterios.hoje(concluida, '2026-10-09')).toBe(false);
    expect(estaConcluida(concluida)).toBe(true);
    expect(tarefas[0].concluida).toBe(false);
  });
});
