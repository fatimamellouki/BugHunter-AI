import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ERROR_KINDS } from '../../utils/constants';
import CopyButton from './CopyButton';
import EmptyState from './EmptyState';
import ErrorMessage from './ErrorMessage';
import Tabs from './Tabs';

describe('ErrorMessage', () => {
  it('renders nothing without an error', () => {
    const { container } = render(<ErrorMessage error={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('announces a network error with a hint and a retry button', async () => {
    const onRetry = vi.fn();
    render(<ErrorMessage error={{ kind: ERROR_KINDS.NETWORK, message: 'Could not reach the backend.' }} onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Backend unreachable');
    expect(screen.getByText(/CORS/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not offer a retry for a validation error', () => {
    render(<ErrorMessage error={{ kind: ERROR_KINDS.VALIDATION, message: 'Empty.' }} onRetry={() => {}} />);
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('shows a title, a text and an action', () => {
    render(
      <EmptyState title="Nothing here" action={<button type="button">Do it</button>}>
        Explain what to do.
      </EmptyState>,
    );
    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument();
    expect(screen.getByText('Explain what to do.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Do it' })).toBeInTheDocument();
  });
});

describe('CopyButton', () => {
  it('copies the text and confirms it', async () => {
    const user = userEvent.setup();
    render(<CopyButton text="print('hi')" label="Copy" />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(await navigator.clipboard.readText()).toBe("print('hi')");
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});

describe('Tabs', () => {
  function Harness() {
    const [active, setActive] = useState('a');
    const tabs = [
      { id: 'a', label: 'First' },
      { id: 'b', label: 'Second', count: 3 },
      { id: 'c', label: 'Third' },
    ];
    return <Tabs tabs={tabs} activeId={active} onChange={setActive} label="Sections" />;
  }

  it('marks the active tab and shows counts', () => {
    render(<Harness />);
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /Second/ })).toHaveTextContent('3');
  });

  it('moves with the arrow keys, wrapping around', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    screen.getByRole('tab', { name: 'First' }).focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /Second/ })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Third' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
  });
});
