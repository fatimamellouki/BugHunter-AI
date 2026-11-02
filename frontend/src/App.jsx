import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { AnalysisProvider } from './context/AnalysisContext';
import AnalysisResults from './pages/AnalysisResults';
import CodeAnalysis from './pages/CodeAnalysis';
import Dashboard from './pages/Dashboard';

export default function App({ analyze }) {
  return (
    <AnalysisProvider analyze={analyze}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analysis" element={<CodeAnalysis />} />
          <Route path="results" element={<AnalysisResults />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnalysisProvider>
  );
}
