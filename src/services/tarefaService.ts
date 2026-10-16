import axios from 'axios';
import type { NovaTarefa, Tarefa } from '../types/Tarefa';

export const modoLocal = (import.meta.env.VITE_STORAGE_MODE || 'local') === 'local';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL?.replace(/\/$/, ''), timeout: 15000 });
const RECURSO = '/tarefas';
const chave = 'taskflow.tarefas.v1';

function configurar() {
  if (!modoLocal && !import.meta.env.VITE_API_URL) throw new Error('Configure VITE_API_URL no arquivo .env e reinicie o servidor.');
}
function lerLocal(): Tarefa[] {
  const value = JSON.parse(localStorage.getItem(chave) || '[]');
  if (!Array.isArray(value)) throw new Error('Os dados locais são inválidos.');
  return value;
}
function gravarLocal(tarefas: Tarefa[]) {
  localStorage.setItem(chave, JSON.stringify(tarefas));
}

export async function listarTarefas(): Promise<Tarefa[]> {
  configurar();
  if (modoLocal) return lerLocal();
  return (await api.get<Tarefa[]>(RECURSO)).data;
}

// POST: o serviço gera um novo _id.
export async function criarTarefa(dados: NovaTarefa): Promise<Tarefa> {
  configurar();
  if (!modoLocal) return (await api.post<Tarefa>(RECURSO, dados)).data;
  const tarefa = { ...dados, _id: crypto.randomUUID() };
  gravarLocal([...lerLocal(), tarefa]);
  return tarefa;
}

// PUT: o _id existente localiza o registro e não vai no corpo da requisição.
export async function alterarTarefa(id: string, tarefa: Omit<Tarefa, '_id'>) {
  configurar();
  if (modoLocal) {
    gravarLocal(lerLocal().map((atual) => (atual._id === id ? { ...tarefa, _id: id } : atual)));
  } else {
    await api.put(`${RECURSO}/${id}`, tarefa);
  }

  return {
    ...tarefa,
    _id: id,
  };
}

export async function excluirTarefa(id: string): Promise<void> {
  configurar();
  if (modoLocal) gravarLocal(lerLocal().filter((t) => t._id !== id));
  else await api.delete(`${RECURSO}/${id}`);
}

export function mensagemErro(erro: unknown) {
  if (axios.isAxiosError(erro)) return `Não foi possível acessar a API${erro.response ? ` (HTTP ${erro.response.status})` : ''}. Confira a conexão e o endpoint do CrudCrud.`;
  return erro instanceof Error ? erro.message : 'Não foi possível realizar a operação. Tente novamente.';
}
