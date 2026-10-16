import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { TarefasProvider } from './context/TarefasContext';
import { Layout } from './components/Layout';
import { Tasks } from './pages/Tasks';

// As quatro rotas usam o mesmo componente, parametrizado pela visualização.
export default function App() {
  return (
    <TarefasProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Tasks visao="hoje" />} />
            <Route path="proximas" element={<Tasks visao="proximas" />} />
            <Route path="tarefas" element={<Tasks visao="tarefas" />} />
            <Route path="concluidas" element={<Tasks visao="concluidas" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TarefasProvider>
  );
}
