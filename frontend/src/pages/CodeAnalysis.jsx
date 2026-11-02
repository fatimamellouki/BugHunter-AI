import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/common/ErrorMessage';
import Notice from '../components/common/Notice';
import PageHeader from '../components/common/PageHeader';
import CodeActions from '../components/editor/CodeActions';
import CodeEditor from '../components/editor/CodeEditor';
import { useAnalysis } from '../context/AnalysisContext';
import { ANALYSIS_STATUS } from '../utils/constants';

export default function CodeAnalysis() {
  const navigate = useNavigate();
  const { code, setCode, error, isLoading, runAnalysis, loadExample, clearCode } = useAnalysis();

  const handleAnalyze = async () => {
    const outcome = await runAnalysis();
    if (outcome === ANALYSIS_STATUS.SUCCESS || outcome === ANALYSIS_STATUS.WARNING) navigate('/results');
  };

  return (
    <div className="analysis-page">
      <PageHeader
        title="Code Analysis"
        description="Paste Python code, run the analysis and get a report with issues, an AI explanation, a proposed fix and generated tests."
      />

      <div className="editor-frame">
        <CodeEditor value={code} onChange={setCode} height="100%" ariaLabel="Python code to analyze" />
      </div>

      <CodeActions
        code={code}
        isLoading={isLoading}
        onClear={clearCode}
        onLoadExample={loadExample}
        onAnalyze={handleAnalyze}
      />

      {isLoading && (
        <Notice variant="info" title="Analyzing your code">
          <p>Static analysis and the AI review are running. The AI step can take a while.</p>
          <div className="progress" aria-hidden="true">
            <span className="progress__bar" />
          </div>
        </Notice>
      )}
      <ErrorMessage error={error} onRetry={handleAnalyze} />
    </div>
  );
}
