// Monaco needs a real browser (workers, canvas). In jsdom we replace it with
// simple elements that keep the same props contract.
export default function Editor({ value, onChange, options }) {
  return (
    <textarea
      data-testid="monaco-editor"
      aria-label={options?.ariaLabel}
      readOnly={options?.readOnly}
      value={value ?? ''}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}

export function DiffEditor({ original, modified }) {
  return (
    <div data-testid="monaco-diff">
      <pre data-testid="diff-original">{original}</pre>
      <pre data-testid="diff-modified">{modified}</pre>
    </div>
  );
}
