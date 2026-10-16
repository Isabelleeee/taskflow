import { useOutletContext } from 'react-router-dom';
import { useTarefas } from '../context/TarefasContext';
import type { LayoutDados } from '../components/Layout';
import type { VisaoTarefas } from '../types/Tarefa';
import { TaskIndicators } from '../components/TaskIndicators';
import { TaskList } from '../components/TaskList';
import { filtrarTarefas } from '../utils/tarefas';

type TasksProps = {
  visao: VisaoTarefas;
};

// O que muda entre as quatro visualizações: título e texto de apoio.
const textos: Record<VisaoTarefas, { titulo: string; apoio: string }> = {
  tarefas: { titulo: 'Tarefas', apoio: 'Tudo o que ainda está pendente, independentemente da data.' },
  hoje: { titulo: 'Hoje', apoio: 'Concentre-se no que precisa avançar agora.' },
  proximas: { titulo: 'Próximas', apoio: 'Prepare os próximos dias com tranquilidade.' },
  concluidas: { titulo: 'Concluídas', apoio: 'Veja tudo o que você já realizou.' },
};

export function Tasks({ visao }: Readonly<TasksProps>) {
  const { tarefas, carregando, erro, recarregar, ocupada } = useTarefas();
  const { busca, projeto, editar } = useOutletContext<LayoutDados>();

  // Estado derivado: calculado a cada renderização a partir de "tarefas", sem estado paralelo.
  const lista = filtrarTarefas(tarefas, visao, busca, projeto);

  return (
    <section data-visao={visao}>
      <div className="page-heading">
        <p className="eyebrow">SEU DIA, MAIS LEVE</p>
        <h1>{textos[visao].titulo}</h1>
        <p>{textos[visao].apoio}</p>
      </div>
      <TaskIndicators />
      {erro && (
        <div className="error" role="alert">
          {erro}{' '}
          <button disabled={ocupada || carregando} onClick={() => void recarregar()}>Tentar novamente</button>
        </div>
      )}
      <div className="list-heading">
        <h2>
          {projeto || 'Suas tarefas'} <span>{lista.length}</span>
        </h2>
        <small>Por data de vencimento</small>
      </div>
      {carregando ? <p role="status" className="empty">Carregando tarefas...</p> : <TaskList tarefas={lista} editar={editar} />}
    </section>
  );
}
