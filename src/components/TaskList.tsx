import { Inbox } from 'lucide-react';
import type { Tarefa } from '../types/Tarefa';
import { TaskCard } from './TaskCard';
export function TaskList({tarefas,editar}:{tarefas:Tarefa[];editar:(t:Tarefa)=>void}){return tarefas.length?<div className="task-list">{tarefas.map(t=><TaskCard key={t._id} tarefa={t} editar={editar}/>)}</div>:<div className="empty"><Inbox size={36}/><h3>Nada por aqui, por enquanto.</h3><p>Crie uma tarefa ou ajuste a busca e os filtros.</p></div>;}
