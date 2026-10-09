export type Prioridade = 'high' | 'medium' | 'low';
export type NovaTarefa = { titulo: string; descricao: string; data: string; prioridade: Prioridade; projeto: string; concluida: boolean };
export type Tarefa = NovaTarefa & { _id: string };
