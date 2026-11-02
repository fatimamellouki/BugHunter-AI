import { FileSearch, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AIExplanation from '../components/analysis/AIExplanation';
import AnalysisSummary from '../components/analysis/AnalysisSummary';
import CorrectedCode from '../components/analysis/CorrectedCode';
import GeneratedTests from '../components/analysis/GeneratedTests';
import IssuesExplorer from '../components/analysis/IssuesExplorer';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import Tabs, { panelId, tabId } from '../components/common/Tabs';
import { useAnalysis } from '../context/AnalysisContext';

export default function AnalysisResults() {
  const { result, status, submittedCode } = useAnalysis();
  const [activeTab, setActiveTab] = useState('issues');

  if (!result) {
    return (
      <div>
        <PageHeader title="Analysis Results" />
        <EmptyState
          icon={FileSearch}
          title="No analysis yet"
          action={
            <Link to="/analysis" className="btn btn--primary">
              <span>Go to Code Analysis</span>
            </Link>
          }
        >
          Results appear here after you analyze some code. They are not stored, so a page reload clears them.
        </EmptyState>
      </div>
    );
  }

  const tabs = [
    { id: 'issues', label: 'Issues', count: result.issues.length },
    { id: 'explanation', label: 'AI explanation' },
    { id: 'corrected', label: 'Corrected code' },
    { id: 'tests', label: 'Generated tests', count: result.tests.length },
  ];

  const panels = {
    issues: <IssuesExplorer issues={result.issues} originalCode={submittedCode} />,
    explanation: (
      <AIExplanation
        explanation={result.explanation}
        rootCauses={result.rootCauses}
        aiAvailable={result.aiAvailable}
        aiError={result.aiError}
      />
    ),
    corrected: (
      <CorrectedCode
        originalCode={submittedCode}
        correctedCode={result.correctedCode}
        aiAvailable={result.aiAvailable}
      />
    ),
    tests: <GeneratedTests tests={result.tests} aiAvailable={result.aiAvailable} />,
  };

  return (
    <div className="results-page">
      <PageHeader
        title="Analysis Results"
        actions={
          <Link to="/analysis" className="btn btn--secondary">
            <Pencil className="btn__icon" size={16} aria-hidden="true" />
            <span>Edit code</span>
          </Link>
        }
      />
      <AnalysisSummary result={result} status={status} />
      <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} label="Result sections" />
      <div role="tabpanel" id={panelId(activeTab)} aria-labelledby={tabId(activeTab)} className="tab-panel">
        {panels[activeTab]}
      </div>
    </div>
  );
}
