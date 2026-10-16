import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { NovaTarefa, Tarefa } from '../types/Tarefa';
import * as servico from '../services/tarefaService';

type Estado = {
  tarefas: Tarefa[];
  carregando: boolean;
  ocupada: boolean;
  erro: string;
  recarregar: () => Promise<void>;
  adicionarTarefa: (dados: NovaTarefa) => Promise<void>;
  alterarTarefa: (tarefa: Tarefa) => Promise<void>;
  alternarConclusao: (tarefa: Tarefa) => Promise<void>;
  removerTarefa: (id: string) => Promise<void>;
};

const Contexto = createContext<Estado | null>(null);

export function TarefasProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [ocupada, setOcupada] = useState(false);
  const [erro, setErro] = useState('');
  const bloqueada = useRef(false);
  const requisicao = useRef(0);

  const recarregar = useCallback(async () => {
    const numero = ++requisicao.current;
    setCarregando(true);
    setErro('');
    try {
      const dados = await servico.listarTarefas();
      if (numero === requisicao.current) setTarefas(dados);
    } catch (e) {
      if (numero === requisicao.current) setErro(servico.mensagemErro(e));
    } finally {
      if (numero === requisicao.current) setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void recarregar();
    return () => {
      requisicao.current++;
    };
  }, [recarregar]);

  // Impede operações simultâneas e propaga o erro para quem chamou.
  async function executar(acao: () => Promise<void>) {
    if (bloqueada.current) throw new Error('Aguarde a operação atual.');
    bloqueada.current = true;
    setOcupada(true);
    setErro('');
    try {
      await acao();
    } catch (e) {
      setErro(servico.mensagemErro(e));
      throw e;
    } finally {
      bloqueada.current = false;
      setOcupada(false);
    }
  }

  async function adicionarTarefa(dados: NovaTarefa) {
    await executar(async () => {
      const criada = await servico.criarTarefa(dados);
      setTarefas((tarefasAtuais) => [criada, ...tarefasAtuais]);
    });
  }

  // Persiste com PUT e substitui no estado apenas o elemento com o mesmo _id.
  async function alterarTarefa(tarefa: Tarefa) {
    await executar(async () => {
      const { _id, ...dados } = tarefa;
      const tarefaAtualizada = await servico.alterarTarefa(_id, dados);
      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((tarefaAtual) =>
          tarefaAtual._id === tarefaAtualizada._id ? tarefaAtualizada : tarefaAtual,
        ),
      );
    });
  }

  // Intenção da interface (concluir/reabrir) sobre a mesma operação de atualização.
  async function alternarConclusao(tarefa: Tarefa) {
    await alterarTarefa({
      ...tarefa,
      concluida: !tarefa.concluida,
    });
  }

  async function removerTarefa(id: string) {
    await executar(async () => {
      await servico.excluirTarefa(id);
      setTarefas((tarefasAtuais) => tarefasAtuais.filter((t) => t._id !== id));
    });
  }

  return (
    <Contexto.Provider
      value={{ tarefas, carregando, ocupada, erro, recarregar, adicionarTarefa, alterarTarefa, alternarConclusao, removerTarefa }}
    >
      {children}
    </Contexto.Provider>
  );
}

export function useTarefas() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error('Use dentro de TarefasProvider.');
  return ctx;
}
