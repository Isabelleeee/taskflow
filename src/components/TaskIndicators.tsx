import { useTarefas } from '../context/TarefasContext';
import { estaConcluida, estaPendente, obterDataAtual, venceEm } from '../utils/tarefas';
export function IndicatorCard({titulo,valor,classe}:{titulo:string;valor:number;classe:string}){return <article className={`indicator ${classe}`}><span>{titulo}</span><strong>{valor}</strong><small>{classe==='done'?'Cada passo conta.':'Vamos avançar juntos.'}</small></article>;}
export function TaskIndicators(){
  const {tarefas}=useTarefas();
  const hoje=obterDataAtual();
  return <div className="indicators"><IndicatorCard titulo="Tarefas pendentes" valor={tarefas.filter(estaPendente).length} classe="pending"/><IndicatorCard titulo="Vencem hoje" valor={tarefas.filter(t=>estaPendente(t)&&venceEm(t,hoje)).length} classe="today"/><IndicatorCard titulo="Concluídas" valor={tarefas.filter(estaConcluida).length} classe="done"/></div>;
}
