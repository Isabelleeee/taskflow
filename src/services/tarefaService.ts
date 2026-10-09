import axios from 'axios';
import type { NovaTarefa, Tarefa } from '../types/Tarefa';
export const modoLocal = (import.meta.env.VITE_STORAGE_MODE || 'local') === 'local';
const api = axios.create({baseURL: import.meta.env.VITE_API_URL?.replace(/\/$/, ''), timeout: 15000});
const chave = 'taskflow.tarefas.v1';
function configurar() { if (!modoLocal && !import.meta.env.VITE_API_URL) throw new Error('Configure VITE_API_URL no arquivo .env e reinicie o servidor.'); }
function lerLocal(): Tarefa[] { const value = JSON.parse(localStorage.getItem(chave) || '[]'); if (!Array.isArray(value)) throw new Error('Os dados locais são inválidos.'); return value; }
function gravarLocal(tarefas: Tarefa[]) { localStorage.setItem(chave, JSON.stringify(tarefas)); }
export async function listarTarefas(): Promise<Tarefa[]> { configurar(); return modoLocal ? lerLocal() : (await api.get<Tarefa[]>('/tarefas')).data; }
export async function criarTarefa(dados: NovaTarefa): Promise<Tarefa> { configurar(); if (!modoLocal) return (await api.post<Tarefa>('/tarefas',dados)).data; const tarefa = {...dados, _id: crypto.randomUUID()}; gravarLocal([...lerLocal(), tarefa]); return tarefa; }
export async function atualizarTarefa(id: string, dados: NovaTarefa): Promise<Tarefa> { configurar(); if (modoLocal) gravarLocal(lerLocal().map(t => t._id === id ? {...dados,_id:id} : t)); else await api.put(`/tarefas/${encodeURIComponent(id)}`, dados); return {...dados,_id:id}; }
export async function excluirTarefa(id: string): Promise<void> { configurar(); if (modoLocal) gravarLocal(lerLocal().filter(t=>t._id!==id)); else await api.delete(`/tarefas/${encodeURIComponent(id)}`); }
export function mensagemErro(erro: unknown) { if (axios.isAxiosError(erro)) return `Não foi possível acessar a API${erro.response ? ` (HTTP ${erro.response.status})` : ''}. Confira a conexão e o endpoint do CrudCrud.`; return erro instanceof Error ? erro.message : 'Não foi possível realizar a operação. Tente novamente.'; }
