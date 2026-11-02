import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeActions from './CodeActions';
import CodeEditor from './CodeEditor';

describe('CodeEditor', () => {
  it('shows the value and reports edits', async () => {
    const onChange = vi.fn();
    render(<CodeEditor value="x = 1" onChange={onChange} ariaLabel="Python code to analyze" />);

    const editor = screen.getByLabelText('Python code to analyze');
    expect(editor).toHaveValue('x = 1');
    await userEvent.type(editor, '2');
    expect(onChange).toHaveBeenLastCalledWith('x = 12');
  });

  it('can be read-only', () => {
    render(<CodeEditor value="x = 1" readOnly ariaLabel="Viewer" />);
    expect(screen.getByLabelText('Viewer')).toHaveAttribute('readonly');
  });
});

describe('CodeActions', () => {
  const setup = (props = {}) => {
    const handlers = { onClear: vi.fn(), onLoadExample: vi.fn(), onAnalyze: vi.fn() };
    render(<CodeActions code={'a = 1\nb = 2'} isLoading={false} {...handlers} {...props} />);
    return handlers;
  };

  it('shows the Analyze, Clear and Load Example buttons and the code size', async () => {
    const handlers = setup();
    expect(screen.getByText('11 characters · 2 lines')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Analyze with AI' }));
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    await userEvent.click(screen.getByRole('button', { name: 'Load Example' }));
    expect(handlers.onAnalyze).toHaveBeenCalledTimes(1);
    expect(handlers.onClear).toHaveBeenCalledTimes(1);
    expect(handlers.onLoadExample).toHaveBeenCalledTimes(1);
  });

  it('disables everything while loading', () => {
    setup({ isLoading: true });
    expect(screen.getByRole('button', { name: /Analyzing/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Load Example' })).toBeDisabled();
  });
});
