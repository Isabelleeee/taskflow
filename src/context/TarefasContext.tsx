import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { NovaTarefa, Tarefa } from '../types/Tarefa';
import * as servico from '../services/tarefaService';
type Estado = { tarefas:Tarefa[]; carregando:boolean; ocupada:boolean; erro:string; recarregar:()=>Promise<void>; salvar:(dados:NovaTarefa,id?:string)=>Promise<void>; excluir:(id:string)=>Promise<void>; alternar:(t:Tarefa)=>Promise<void> };
const Contexto = createContext<Estado | null>(null);
export function TarefasProvider({children}:{children:ReactNode}) {
  const [tarefas,setTarefas]=useState<Tarefa[]>([]), [carregando,setCarregando]=useState(true), [ocupada,setOcupada]=useState(false), [erro,setErro]=useState('');
  const bloqueada=useRef(false), requisicao=useRef(0);
  const recarregar=useCallback(async()=>{ const numero=++requisicao.current; setCarregando(true);setErro('');try {const dados=await servico.listarTarefas();if(numero===requisicao.current)setTarefas(dados);}catch(e){if(numero===requisicao.current)setErro(servico.mensagemErro(e));}finally{if(numero===requisicao.current)setCarregando(false);}},[]);
  useEffect(()=>{void recarregar();return ()=>{requisicao.current++;};},[recarregar]);
  async function executar(acao:()=>Promise<void>) { if(bloqueada.current) throw new Error('Aguarde a operação atual.');bloqueada.current=true;setOcupada(true);setErro('');try{await acao();}catch(e){setErro(servico.mensagemErro(e));throw e;}finally{bloqueada.current=false;setOcupada(false);} }
  async function salvar(dados:NovaTarefa,id?:string) {await executar(async()=>{const t=id?await servico.atualizarTarefa(id,dados):await servico.criarTarefa(dados);setTarefas(atual=>id?atual.map(item=>item._id===id?t:item):[t,...atual]);});}
  async function excluir(id:string) {await executar(async()=>{await servico.excluirTarefa(id);setTarefas(atual=>atual.filter(t=>t._id!==id));});}
  async function alternar(t:Tarefa) { const {_id,...dados}=t;await salvar({...dados,concluida:!t.concluida},_id); }
  return <Contexto.Provider value={{tarefas,carregando,ocupada,erro,recarregar,salvar,excluir,alternar}}>{children}</Contexto.Provider>;
}
export function useTarefas(){const ctx=useContext(Contexto);if(!ctx)throw new Error('Use dentro de TarefasProvider.');return ctx;}
