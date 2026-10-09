import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { useTarefas } from '../context/TarefasContext';
import type { Tarefa } from '../types/Tarefa';
export function TaskModal({tarefa,fechar}:{tarefa?:Tarefa;fechar:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);const {ocupada}=useTarefas();
 useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close();},[]);
 return <dialog ref={ref} className="modal" aria-labelledby="modal-titulo" onCancel={e=>{e.preventDefault();if(!ocupada)fechar();}} onClick={e=>{if(e.target===ref.current&&!ocupada)fechar();}}><div className="modal-heading"><div><p className="eyebrow">ORGANIZE SEU PRÓXIMO PASSO</p><h2 id="modal-titulo">{tarefa?'Editar tarefa':'Nova tarefa'}</h2></div><button className="icon" disabled={ocupada} onClick={fechar} aria-label="Fechar formulário"><X/></button></div><TaskForm tarefa={tarefa} cancelar={fechar} sucesso={fechar}/></dialog>;
}
