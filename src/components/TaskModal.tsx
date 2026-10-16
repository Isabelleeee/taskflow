import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { useTarefas } from '../context/TarefasContext';
import type { NovaTarefa, Tarefa } from '../types/Tarefa';

type TaskModalProps = {
  tarefa?: Tarefa; // tarefa selecionada para edição; undefined = criação
  aoFechar: () => void;
};

export function TaskModal({ tarefa, aoFechar }: Readonly<TaskModalProps>) {
  const ref = useRef<HTMLDialogElement>(null);
  const { ocupada, adicionarTarefa, alterarTarefa } = useTarefas();
  const emEdicao = tarefa !== undefined;

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  // Mesma interface, operações diferentes: POST na criação, PUT com o mesmo _id na edição.
  async function salvar(dados: NovaTarefa) {
    if (tarefa) await alterarTarefa({ ...dados, _id: tarefa._id });
    else await adicionarTarefa(dados);
    aoFechar(); // só executa se a operação não lançou erro
  }

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="modal-titulo"
      onCancel={(e) => {
        e.preventDefault();
        if (!ocupada) aoFechar();
      }}
      onClick={(e) => {
        if (e.target === ref.current && !ocupada) aoFechar();
      }}
    >
      <div className="modal-heading">
        <div>
          <p className="eyebrow">{emEdicao ? 'ALTERE O REGISTRO EXISTENTE' : 'ORGANIZE SEU PRÓXIMO PASSO'}</p>
          <h2 id="modal-titulo">{emEdicao ? 'Editar tarefa' : 'Nova tarefa'}</h2>
        </div>
        <button className="icon" disabled={ocupada} onClick={aoFechar} aria-label="Fechar formulário">
          <X />
        </button>
      </div>
      <TaskForm tarefa={tarefa} aoSalvar={salvar} aoCancelar={aoFechar} />
    </dialog>
  );
}
