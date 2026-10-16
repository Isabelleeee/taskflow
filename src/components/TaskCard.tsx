import { Check, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import type { Tarefa } from '../types/Tarefa';
import { formatarData, obterDataAtual } from '../utils/tarefas';
import { useTarefas } from '../context/TarefasContext';

type TaskCardProps = {
  tarefa: Tarefa;
  editar: (tarefa: Tarefa) => void;
};

const prioridades = { high: 'Alta', medium: 'Média', low: 'Baixa' };

export function TaskCard({ tarefa, editar }: Readonly<TaskCardProps>) {
  const { alternarConclusao, removerTarefa, ocupada, carregando } = useTarefas();
  const bloqueada = ocupada || carregando;
  const acaoConclusao = tarefa.concluida ? 'Reabrir tarefa' : 'Concluir tarefa';
  const atrasada = !tarefa.concluida && tarefa.data < obterDataAtual();

  return (
    <article className={`task-card ${tarefa.concluida ? 'completed' : ''}`}>
      <button
        type="button"
        className={`task-toggle ${tarefa.concluida ? 'done' : ''}`}
        disabled={bloqueada}
        title={acaoConclusao}
        aria-label={`${acaoConclusao}: ${tarefa.titulo}`}
        onClick={() => void alternarConclusao(tarefa).catch(() => {})}
      >
        <Check size={14} />
      </button>
      <div className="task-content">
        <h3>{tarefa.titulo}</h3>
        {tarefa.descricao && <p>{tarefa.descricao}</p>}
        <div className="meta">
          <span className={atrasada ? 'overdue' : ''}>
            <CalendarDays size={14} />
            {formatarData(tarefa.data)}
          </span>
          {tarefa.projeto && <span className="project-tag">{tarefa.projeto}</span>}
          <span className={`priority ${tarefa.prioridade}`}>{prioridades[tarefa.prioridade]}</span>
        </div>
      </div>
      <div className="task-actions">
        <button className="icon" disabled={bloqueada} aria-label={`Editar ${tarefa.titulo}`} onClick={() => editar(tarefa)}>
          <Pencil size={17} />
        </button>
        <button
          className="icon danger"
          disabled={bloqueada}
          aria-label={`Excluir ${tarefa.titulo}`}
          onClick={() => {
            if (window.confirm(`Excluir a tarefa “${tarefa.titulo}”?`)) void removerTarefa(tarefa._id).catch(() => {});
          }}
        >
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}
