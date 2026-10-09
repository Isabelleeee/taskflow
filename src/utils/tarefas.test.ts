import { describe, expect, it } from 'vitest';
import { filtrarTarefas } from './tarefas';
import type { Tarefa } from '../types/Tarefa';
const tarefas:Tarefa[]=[
 {_id:'1',titulo:'Revisar React',descricao:'Contexto',data:'2026-10-09',prioridade:'high',projeto:'TaskFlow',concluida:false},
 {_id:'2',titulo:'Entrega',descricao:'GitHub',data:'2026-11-09',prioridade:'medium',projeto:'TaskFlow',concluida:false},
 {_id:'3',titulo:'Documento',descricao:'',data:'2026-10-09',prioridade:'low',projeto:'Estudos',concluida:true},
 {_id:'4',titulo:'Atrasada',descricao:'',data:'2026-10-08',prioridade:'low',projeto:'Estudos',concluida:false}
];
describe('visões e filtros',()=>{
 it('Hoje mostra apenas pendentes do dia',()=>expect(filtrarTarefas(tarefas,'hoje','','','2026-10-09').map(t=>t._id)).toEqual(['1']));
 it('Próximas exclui hoje, atrasadas e concluídas',()=>expect(filtrarTarefas(tarefas,'proximas','','','2026-10-09').map(t=>t._id)).toEqual(['2']));
 it('Concluídas contém apenas finalizadas',()=>expect(filtrarTarefas(tarefas,'concluidas').map(t=>t._id)).toEqual(['3']));
 it('combina busca na descrição e projeto',()=>expect(filtrarTarefas(tarefas,'todas','GITHUB','TaskFlow').map(t=>t._id)).toEqual(['2']));
 it('mantém atrasadas na visão Todas',()=>expect(filtrarTarefas(tarefas,'todas')[0]._id).toBe('4'));
});
