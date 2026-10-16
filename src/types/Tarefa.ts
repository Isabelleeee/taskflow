export type Prioridade = 'high' | 'medium' | 'low';

export type Tarefa = {
  _id: string;
  titulo: string;
  descricao: string;
  data: string;
  prioridade: Prioridade;
  projeto: string;
  concluida: boolean;
};

// Dados enviados ao serviço: o _id é gerado no POST e vai no endereço no PUT.
export type NovaTarefa = Omit<Tarefa, '_id'>;

// Tipo união: limita as visualizações às quatro rotas da aplicação.
export type VisaoTarefas = 'tarefas' | 'hoje' | 'proximas' | 'concluidas';
