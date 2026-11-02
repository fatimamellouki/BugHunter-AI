import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEBUG_URL } from '../services/api';
import {
  jsonResponse,
  RAW_AI_UNAVAILABLE_RESPONSE,
  RAW_FULL_RESPONSE,
  RAW_NO_ISSUES_RESPONSE,
} from '../test/fixtures';
import { renderApp } from '../test/renderHelpers';
import { EXAMPLE_CODE } from '../utils/constants';

const mockFetch = (impl) => {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

const editor = () => screen.getByLabelText('Python code to analyze');

async function typeCode(user, code) {
  await user.clear(editor());
  await user.click(editor());
  await user.paste(code);
}

describe('Dashboard and navigation', () => {
  it('presents the product and links to a new analysis', async () => {
    const user = userEvent.setup();
    renderApp('/');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/find the bug/i);
    expect(screen.getAllByText('BugHunter AI').length).toBeGreaterThan(0);
    expect(screen.getByText(/not stored, so there is no history/i)).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /new analysis/i }));
    expect(screen.getByRole('heading', { level: 1, name: 'Code Analysis' })).toBeInTheDocument();
  });

  it('navigates with the sidebar', async () => {
    const user = userEvent.setup();
    renderApp('/');
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });

    await user.click(within(nav).getByRole('link', { name: /Code Analysis/ }));
    expect(screen.getByRole('heading', { level: 1, name: 'Code Analysis' })).toBeInTheDocument();
    await user.click(within(nav).getByRole('link', { name: /Analysis Results/ }));
    expect(screen.getByRole('heading', { level: 1, name: 'Analysis Results' })).toBeInTheDocument();
  });

  it('redirects unknown routes to the dashboard', () => {
    renderApp('/does-not-exist');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/find the bug/i);
  });

  it('opens and closes the mobile navigation', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(screen.getByRole('complementary', { name: 'Sidebar' })).toHaveClass('sidebar--open');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('complementary', { name: 'Sidebar' })).not.toHaveClass('sidebar--open');
  });
});

describe('Code Analysis page', () => {
  it('preloads the example, with the editor and the three actions', () => {
    renderApp('/analysis');
    expect(editor()).toHaveValue(EXAMPLE_CODE);
    expect(screen.getByRole('button', { name: 'Analyze with AI' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load Example' })).toBeInTheDocument();
  });

  it('clears the editor and reloads the example', async () => {
    const user = userEvent.setup();
    renderApp('/analysis');
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(editor()).toHaveValue('');
    await user.click(screen.getByRole('button', { name: 'Load Example' }));
    expect(editor()).toHaveValue(EXAMPLE_CODE);
  });

  it('refuses empty code without calling the backend', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetch(async () => jsonResponse(RAW_FULL_RESPONSE));
    renderApp('/analysis');

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    await user.click(screen.getByRole('button', { name: 'Analyze with AI' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Nothing to analyze');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('Full flow: editor -> API -> results', () => {
  it('sends the typed code to the backend and displays the results', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetch(async () => jsonResponse(RAW_FULL_RESPONSE));
    renderApp('/analysis');

    await typeCode(user, 'def calculate(a, b):\n    return a / b');
    await user.click(screen.getByRole('button', { name: 'Analyze with AI' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Analysis Results' })).toBeInTheDocument();

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(DEBUG_URL);
    expect(JSON.parse(options.body)).toEqual({ code: 'def calculate(a, b):\n    return a / b', language: 'python' });

    expect(screen.getByText('4 problem(s) detected.')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Detected issues' })).toHaveTextContent('PotentialZeroDivision');
  });

  it('shows a loading state while waiting for the backend', async () => {
    const user = userEvent.setup();
    let resolve;
    mockFetch(() => new Promise((r) => (resolve = r)));
    renderApp('/analysis');

    await user.click(screen.getByRole('button', { name: 'Analyze with AI' }));
    expect(screen.getByRole('button', { name: /Analyzing/ })).toBeDisabled();
    expect(screen.getByText('Analyzing your code')).toBeInTheDocument();

    resolve(jsonResponse(RAW_FULL_RESPONSE));
    expect(await screen.findByRole('heading', { level: 1, name: 'Analysis Results' })).toBeInTheDocument();
  });

  it('lets the user browse the other result sections', async () => {
    const user = userEvent.setup();
    mockFetch(async () => jsonResponse(RAW_FULL_RESPONSE));
    renderApp('/analysis');
    await user.click(screen.getByRole('button', { name: 'Analyze with AI' }));
    await screen.findByRole('heading', { level: 1, name: 'Analysis Results' });

    await user.click(screen.getByRole('tab', { name: 'AI explanation' }));
    expect(screen.getByText('Identity operator used instead of equality')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Corrected code' }));
    expect(screen.getByTestId('diff-modified')).toHaveTextContent('numbers=None');
    expect(screen.getByTestId('diff-original')).toHaveTextContent('def calculate_average');

    await user.click(screen.getByRole('tab', { name: /Generated tests/ }));
    expect(screen.getByText('Generated test 2')).toBeInTheDocument();
  });

  it('handles a response without any bug', async () => {
    const user = userEvent.setup();
    mockFetch(async () => jsonResponse(RAW_NO_ISSUES_RESPONSE));
    renderApp('/analysis');
    await user.click(screen.getByRole('button', { name: 'Analyze with AI' }));

    expect(await screen.findByText('No issue detected by static analysis')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /Generated tests/ }));
    expect(screen.getByText('No generated tests')).toBeInTheDocument();
  });

  it('still shows static results with a warning when the AI is unavailable', async () => {
    const user = userEvent.setup();
    mockFetch(async () => jsonResponse(RAW_AI_UNAVAILABLE_RESPONSE));
    renderApp('/analysis');
    await user.click(screen.getByRole('button', { name: 'Analyze with AI' }));

    expect(await screen.findByText(/AI analysis unavailable: LLM provider timeout/)).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Detected issues' })).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Corrected code' }));
    expect(screen.getByText('No corrected code available')).toBeInTheDocument();
  });
});

describe('Error handling keeps the user on the page with the code intact', () => {
  const cases = [
    ['HTTP 422', () => jsonResponse({ detail: [{ loc: ['body', 'code'], msg: 'Field required' }] }, 422), 'The backend rejected the request'],
    ['HTTP 500', () => jsonResponse({ detail: 'boom' }, 500), 'The backend hit an error'],
    ['unreachable backend', () => Promise.reject(new TypeError('Failed to fetch')), 'Backend unreachable'],
    ['malformed JSON', () => new Response('<html>', { status: 200 }), 'The response could not be read'],
  ];

  it.each(cases)('%s', async (_name, respond, expectedTitle) => {
    const user = userEvent.setup();
    mockFetch(async () => respond());
    renderApp('/analysis');

    await typeCode(user, 'keep_me = 1');
    await user.click(screen.getByRole('button', { name: 'Analyze with AI' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(expectedTitle);
    expect(screen.getByRole('heading', { level: 1, name: 'Code Analysis' })).toBeInTheDocument();
    expect(editor()).toHaveValue('keep_me = 1');
  });

  it('lets the user retry after an error', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetch(async () => jsonResponse({}, 500));
    renderApp('/analysis');
    await user.click(screen.getByRole('button', { name: 'Analyze with AI' }));
    await screen.findByRole('alert');

    fetchMock.mockImplementation(async () => jsonResponse(RAW_FULL_RESPONSE));
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Analysis Results' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('Analysis Results page without data', () => {
  it('invites the user to run an analysis first', async () => {
    const user = userEvent.setup();
    renderApp('/results');
    expect(screen.getByText('No analysis yet')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Go to Code Analysis' }));
    await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: 'Code Analysis' })).toBeInTheDocument());
  });
});
