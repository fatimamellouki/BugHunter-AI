import { Eraser, FileCode, Sparkles } from 'lucide-react';
import { countLines } from '../../utils/codeLines';
import { pluralize } from '../../utils/formatters';
import Button from '../common/Button';

export default function CodeActions({ code, isLoading, onClear, onLoadExample, onAnalyze }) {
  return (
    <div className="code-actions">
      <p className="code-actions__meta" aria-live="polite">
        {pluralize(code.length, 'character')} · {pluralize(countLines(code), 'line')}
      </p>
      <div className="code-actions__buttons">
        <Button icon={Eraser} onClick={onClear} disabled={isLoading}>
          Clear
        </Button>
        <Button icon={FileCode} onClick={onLoadExample} disabled={isLoading}>
          Load Example
        </Button>
        <Button variant="primary" icon={Sparkles} onClick={onAnalyze} loading={isLoading}>
          {isLoading ? 'Analyzing…' : 'Analyze with AI'}
        </Button>
      </div>
    </div>
  );
}
