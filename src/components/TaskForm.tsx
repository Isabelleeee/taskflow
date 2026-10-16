import { useState, type FormEvent } from 'react';
import type { NovaTarefa, Prioridade, Tarefa } from '../types/Tarefa';
import { obterDataAtual } from '../utils/tarefas';
import { useTarefas } from '../context/TarefasContext';

type TaskFormProps = {
  tarefa?: Tarefa; // presente = edição; ausente = criação
  aoSalvar: (dados: NovaTarefa) => Promise<void>;
  aoCancelar: () => void;
};

export function TaskForm({ tarefa, aoSalvar, aoCancelar }: Readonly<TaskFormProps>) {
  const { ocupada, tarefas } = useTarefas();
  const emEdicao = tarefa !== undefined;

  // Na edição, os valores persistidos são o estado inicial dos campos.
  const [titulo, setTitulo] = useState(tarefa?.titulo ?? '');
  const [descricao, setDescricao] = useState(tarefa?.descricao ?? '');
  const [data, setData] = useState(tarefa?.data ?? obterDataAtual());
  const [prioridade, setPrioridade] = useState<Prioridade>(tarefa?.prioridade ?? 'medium');
  const [projeto, setProjeto] = useState(tarefa?.projeto ?? '');
  const [erro, setErro] = useState('');

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) {
      setErro('Informe o título da tarefa.');
      return;
    }
    setErro('');
    const dados: NovaTarefa = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      data,
      prioridade,
      projeto: projeto.trim(),
      concluida: tarefa?.concluida ?? false,
    };
    try {
      await aoSalvar(dados);
    } catch {
      setErro('Não foi possível salvar. Confira a mensagem de erro na página e tente novamente.');
    }
  }

  const textoBotao = ocupada ? 'Salvando...' : emEdicao ? 'Salvar alterações' : 'Criar tarefa';

  return (
    <form onSubmit={enviar}>
      <fieldset disabled={ocupada}>
        <label>
          Título
          <input autoFocus required maxLength={120} value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="O que você precisa fazer?" />
        </label>
        <label>
          Descrição
          <textarea rows={3} maxLength={2000} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Acrescente os detalhes da tarefa" />
        </label>
        <div className="form-row">
          <label>
            Prazo
            <input type="date" required value={data} onChange={(e) => setData(e.target.value)} />
          </label>
          <label>
            Prioridade
            <select value={prioridade} onChange={(e) => setPrioridade(e.target.value as Prioridade)}>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </label>
        </div>
        <label>
          Projeto
          <input list="projetos" maxLength={80} value={projeto} onChange={(e) => setProjeto(e.target.value)} placeholder="Ex.: TaskFlow" />
        </label>
        <datalist id="projetos">
          {[...new Set(tarefas.map((t) => t.projeto).filter(Boolean))].map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
        {erro && <p role="alert" className="error">{erro}</p>}
        <div className="form-actions">
          <button type="button" className="secondary" onClick={aoCancelar}>Cancelar</button>
          <button className="primary" type="submit">{textoBotao}</button>
        </div>
      </fieldset>
    </form>
  );
}
