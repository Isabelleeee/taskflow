import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import type { Tarefa } from '../types/Tarefa';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TaskModal } from './TaskModal';
import { modoLocal } from '../services/tarefaService';
import { useTarefas } from '../context/TarefasContext';

// Dados que o Layout entrega às páginas pelo Outlet.
export type LayoutDados = {
  busca: string;
  projeto: string;
  editar: (tarefa: Tarefa) => void;
};

export function Layout() {
  const [busca, buscar] = useState('');
  const [projeto, selecionar] = useState('');
  const [menu, setMenu] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  // Referência da tarefa em edição enquanto o modal está aberto (undefined = criação).
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<Tarefa>();
  const { carregando } = useTarefas();

  function abrirCriacao() {
    if (carregando) return;
    setTarefaEmEdicao(undefined);
    setModalAberto(true);
    setMenu(false);
  }

  function abrirEdicao(tarefa: Tarefa) {
    setTarefaEmEdicao(tarefa);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setTarefaEmEdicao(undefined);
  }

  const dados: LayoutDados = { busca, projeto, editar: abrirEdicao };

  return (
    <div className={`app ${menu ? 'menu-open' : ''}`}>
      <button className="menu-shade" aria-label="Fechar menu" onClick={() => setMenu(false)} />
      <Sidebar nova={abrirCriacao} projeto={projeto} selecionar={selecionar} fechar={() => setMenu(false)} />
      <div className="workspace">
        <Header busca={busca} buscar={buscar} nova={abrirCriacao} menu={() => setMenu(true)} />
        <main>
          {modoLocal && (
            <div className="local-notice">Modo local · Tarefas salvas neste navegador. Configure o CrudCrud para usar a API da aula.</div>
          )}
          <Outlet context={dados} />
        </main>
      </div>
      {modalAberto && <TaskModal tarefa={tarefaEmEdicao} aoFechar={fecharModal} />}
    </div>
  );
}
