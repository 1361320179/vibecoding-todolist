import { Navigate, Route, Routes } from 'react-router-dom';
import { DailySummaryPage } from './pages/DailySummaryPage';
import { TodoPage } from './pages/TodoPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TodoPage />} />
      <Route path="/history" element={<DailySummaryPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
