import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { normalizeResponse } from '../../services/api';
import { RAW_AI_UNAVAILABLE_RESPONSE, RAW_FULL_RESPONSE, RAW_NO_ISSUES_RESPONSE } from '../../test/fixtures';
import AIExplanation from './AIExplanation';
import AnalysisSummary from './AnalysisSummary';
import CorrectedCode from './CorrectedCode';
import GeneratedTests from './GeneratedTests';
import IssuesExplorer from './IssuesExplorer';
import SeverityBadge from './SeverityBadge';

const full = normalizeResponse(RAW_FULL_RESPONSE);
const aiDown = normalizeResponse(RAW_AI_UNAVAILABLE_RESPONSE);
const ORIGINAL = 'def calculate_average(numbers=[]):\n    total = 0\n';

describe('SeverityBadge', () => {
  it.each([['critical', 'Critical'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']])(
    'renders %s',
    (severity, label) => {
      render(<SeverityBadge severity={severity} />);
      expect(screen.getByText(label)).toHaveAttribute('data-severity', severity);
    },
  );

  it('does not pretend an unknown severity is a known one', () => {
    render(<SeverityBadge severity="blocker" />);
    expect(screen.getByText('Unknown')).toHaveAttribute('data-severity', 'unknown');
  });
});

describe('IssuesExplorer', () => {
  it('lists every issue with type, rule id, line and severity', () => {
    render(<IssuesExplorer issues={full.issues} originalCode={ORIGINAL} />);
    const list = screen.getByRole('list', { name: 'Detected issues' });

    expect(within(list).getAllByRole('listitem')).toHaveLength(4);
    expect(within(list).getByText('PotentialZeroDivision')).toBeInTheDocument();
    expect(within(list).getByText('PY_DIV_ZERO')).toBeInTheDocument();
    expect(within(list).getByText('Line 5')).toBeInTheDocument();
    expect(within(list).getByText('High')).toBeInTheDocument();
  });

  it('shows the most severe issue first', () => {
    render(<IssuesExplorer issues={full.issues} originalCode={ORIGINAL} />);
    const first = within(screen.getByRole('list', { name: 'Detected issues' })).getAllByRole('listitem')[0];
    expect(first).toHaveTextContent('PotentialZeroDivision');
  });

  it('shows severity counters and filters by severity', async () => {
    const user = userEvent.setup();
    render(<IssuesExplorer issues={full.issues} originalCode={ORIGINAL} />);

    expect(screen.getByRole('button', { name: /^All\s*4$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Medium\s*2$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Critical\s*0$/ })).toBeInTheDocument();

    const filters = within(screen.getByRole('group', { name: 'Filter by severity' }));
    await user.click(filters.getByRole('button', { name: /^Medium/ }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByText('PotentialZeroDivision')).not.toBeInTheDocument();
  });

  it('searches by type or rule id and can reset an empty result', async () => {
    const user = userEvent.setup();
    render(<IssuesExplorer issues={full.issues} originalCode={ORIGINAL} />);

    await user.type(screen.getByLabelText(/search issues/i), 'py_unreachable');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('UnreachableCode')).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/search issues/i));
    await user.type(screen.getByLabelText(/search issues/i), 'nothing matches');
    expect(screen.getByText('No issue matches these filters')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  it('shows the details and the source line of the selected issue', async () => {
    const user = userEvent.setup();
    render(<IssuesExplorer issues={full.issues} originalCode={ORIGINAL} />);
    expect(screen.getByText(/select an issue/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /MutableDefaultArgument/ }));
    expect(screen.getByRole('button', { name: /MutableDefaultArgument/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('def calculate_average(numbers=[]):')).toBeInTheDocument();
  });

  it('shows an honest empty state when no issue was detected', () => {
    render(<IssuesExplorer issues={[]} originalCode="x = 1" />);
    expect(screen.getByText('No issue detected by static analysis')).toBeInTheDocument();
    expect(screen.getByText(/does not prove/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/search issues/i)).not.toBeInTheDocument();
  });
});

describe('AnalysisSummary', () => {
  const metric = (label) => within(screen.getByText(label, { selector: 'dt' }).parentElement);

  it('shows status, issue count, AI status, syntax and the backend summary', () => {
    render(<AnalysisSummary result={full} status="success" />);
    expect(metric('Analysis').getByText('Completed')).toBeInTheDocument();
    expect(metric('Issues detected').getByText('4')).toBeInTheDocument();
    expect(metric('AI analysis').getByText('Completed')).toBeInTheDocument();
    expect(metric('Syntax').getByText('Valid syntax')).toBeInTheDocument();
    expect(screen.getByText('4 problem(s) detected.')).toBeInTheDocument();
    expect(screen.queryByText(/Read these before/)).not.toBeInTheDocument();
  });

  it('lists warnings when the AI is unavailable', () => {
    render(<AnalysisSummary result={aiDown} status="warning" />);
    expect(screen.getByText('Completed with warnings')).toBeInTheDocument();
    expect(screen.getByText(/LLM provider timeout/)).toBeInTheDocument();
  });
});

describe('AIExplanation', () => {
  it('shows the explanation and root causes, flagged as model output', () => {
    render(<AIExplanation explanation={full.explanation} rootCauses={full.rootCauses} aiAvailable aiError={null} />);
    expect(screen.getByText(/divides by zero/)).toBeInTheDocument();
    expect(screen.getByText('Hard-coded zero divisor')).toBeInTheDocument();
    expect(screen.getByText(/Written by a language model/)).toBeInTheDocument();
    expect(screen.getByText('How the AI is used')).toBeInTheDocument();
  });

  it('explains why there is no content when the AI failed', () => {
    render(<AIExplanation explanation={null} rootCauses={[]} aiAvailable={false} aiError="LLM provider timeout" />);
    expect(screen.getByText('No AI explanation available')).toBeInTheDocument();
    expect(screen.getByText('LLM provider timeout')).toBeInTheDocument();
  });
});

describe('CorrectedCode', () => {
  it('shows original and corrected code in the diff and never alters the original', () => {
    render(<CorrectedCode originalCode={ORIGINAL} correctedCode={full.correctedCode} aiAvailable />);
    expect(screen.getByTestId('diff-original')).toHaveTextContent('numbers=[]');
    expect(screen.getByTestId('diff-modified')).toHaveTextContent('numbers=None');
    expect(screen.getByText(/never replaced/i)).toBeInTheDocument();
  });

  it('copies the corrected code only', async () => {
    const user = userEvent.setup();
    render(<CorrectedCode originalCode={ORIGINAL} correctedCode={full.correctedCode} aiAvailable />);
    await user.click(screen.getByRole('button', { name: 'Copy corrected code' }));
    expect(await navigator.clipboard.readText()).toBe(full.correctedCode);
  });

  it('can switch to the corrected code alone', async () => {
    const user = userEvent.setup();
    render(<CorrectedCode originalCode={ORIGINAL} correctedCode={full.correctedCode} aiAvailable />);
    await user.click(screen.getByRole('button', { name: 'Corrected code only' }));
    expect(screen.queryByTestId('monaco-diff')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Corrected Python code')).toHaveValue(full.correctedCode);
  });

  it('says so when the corrected code equals the original', () => {
    render(<CorrectedCode originalCode={"x = 1\n"} correctedCode="x = 1" aiAvailable />);
    expect(screen.getByText(/identical to your original/i)).toBeInTheDocument();
  });

  it('shows an empty state when there is no corrected code', () => {
    render(<CorrectedCode originalCode={ORIGINAL} correctedCode={null} aiAvailable={false} />);
    expect(screen.getByText('No corrected code available')).toBeInTheDocument();
    expect(screen.queryByTestId('monaco-diff')).not.toBeInTheDocument();
  });
});

describe('GeneratedTests', () => {
  it('shows each generated test separately with a copy button', async () => {
    const user = userEvent.setup();
    render(<GeneratedTests tests={full.tests} aiAvailable />);

    expect(screen.getByText('Generated test 1')).toBeInTheDocument();
    expect(screen.getByText('Generated test 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Generated Pytest code 1')).toHaveValue(full.tests[0]);

    await user.click(screen.getByRole('button', { name: 'Copy generated test 2' }));
    expect(await navigator.clipboard.readText()).toBe(full.tests[1]);
  });

  it('states that tests are generated and never claims a pass or fail result', () => {
    render(<GeneratedTests tests={full.tests} aiAvailable />);
    expect(screen.getByText('Generated, not executed')).toBeInTheDocument();
    expect(screen.queryByText(/^passed$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^failed$/i)).not.toBeInTheDocument();
  });

  it('shows an empty state when the list is empty', () => {
    render(<GeneratedTests tests={normalizeResponse(RAW_NO_ISSUES_RESPONSE).tests} aiAvailable />);
    expect(screen.getByText('No generated tests')).toBeInTheDocument();
  });
});
