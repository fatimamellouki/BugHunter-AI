import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { copyToClipboard } from '../../utils/clipboard';
import Button from './Button';

export default function CopyButton({ text, label = 'Copy', ariaLabel }) {
  const [state, setState] = useState('idle');

  useEffect(() => {
    if (state === 'idle') return undefined;
    const timer = setTimeout(() => setState('idle'), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const handleCopy = async () => {
    setState((await copyToClipboard(text)) ? 'copied' : 'failed');
  };

  const buttonLabel = { idle: label, copied: 'Copied', failed: 'Copy failed' }[state];
  return (
    <Button icon={state === 'copied' ? Check : Copy} onClick={handleCopy} aria-label={ariaLabel} aria-live="polite">
      {buttonLabel}
    </Button>
  );
}
