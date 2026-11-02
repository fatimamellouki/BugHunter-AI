import { createContext, useContext } from 'react';
import { useCodeAnalysis } from '../hooks/useCodeAnalysis';

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children, analyze, initialCode }) {
  const analysis = useCodeAnalysis({ analyze, initialCode });
  return <AnalysisContext.Provider value={analysis}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) throw new Error('useAnalysis must be used inside <AnalysisProvider>.');
  return context;
}
