import { Check, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { tokenizePython } from '../../utils/highlight';
import SeverityBadge from '../analysis/SeverityBadge';
import { DEMO_FINDINGS, DEMO_FIX, DEMO_FIX_CHANGED, DEMO_SOURCE, DEMO_STEPS } from './landingData';

function CodeLine({ number, text, tone, ring }) {
  const className = ['lp-code__line', tone && `lp-code__line--${tone}`, ring && 'lp-code__line--ring'].filter(Boolean).join(' ');
  return (
    <div className={className}>
      <span className="lp-code__num">{number}</span>
      <span className="lp-code__dot" aria-hidden="true" />
      <span className="lp-code__text">
        {tokenizePython(text).map((token, index) => (
          <span key={index} className={`tok tok--${token.kind}`}>
            {token.text}
          </span>
        ))}
      </span>
    </div>
  );
}

/**
 * Illustrative simulation of an analysis on the example code. It never calls the backend:
 * the findings below are static sample data.
 */
export default function LandingDemo() {
  const [phase, setPhase] = useState('done'); // 'running' | 'done'
  const [step, setStep] = useState(2);
  const [tab, setTab] = useState('issues');
  const [selected, setSelected] = useState(1);
  const timers = useRef([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const run = () => {
    timers.current.forEach(clearTimeout);
    setPhase('running');
    setStep(0);
    setSelected(-1);
    setTab('issues');
    timers.current = [
      setTimeout(() => setStep(1), 1000),
      setTimeout(() => {
        setStep(2);
        setPhase('done');
        setSelected(1);
      }, 2100),
    ];
  };

  const running = phase === 'running';
  const progress = ['18%', '62%', '100%'][step];

  return (
    <figure className="lp-demo">
      <div className="lp-demo__card">
        <div className="lp-demo__bar">
          <div className="lp-demo__file">
            <span className="lp-demo__filename">calculate_average.py</span>
            <span className="lp-tag">Python</span>
          </div>
          <button type="button" className="btn btn--primary lp-demo__run" onClick={run} disabled={running}>
            <Play size={15} aria-hidden="true" />
            <span>{running ? 'Analyzing…' : 'Run again'}</span>
          </button>
        </div>

        <div className="lp-code" role="img" aria-label="Example Python function with findings highlighted">
          {DEMO_SOURCE.map((text, index) => {
            const number = index + 1;
            const findingIndex = DEMO_FINDINGS.findIndex((finding) => finding.line === number);
            const finding = findingIndex >= 0 && !running ? DEMO_FINDINGS[findingIndex] : null;
            return (
              <CodeLine
                key={number}
                number={number}
                text={text}
                tone={finding?.severity}
                ring={finding && findingIndex === selected}
              />
            );
          })}
        </div>

        <div className="lp-demo__panel" aria-live="polite">
          {running ? (
            <div className="lp-demo__running">
              <p className="lp-demo__running-title">Analyzing your code</p>
              <p className="lp-demo__muted">Static analysis and the AI review are running.</p>
              <div className="lp-progress" aria-hidden="true">
                <span style={{ width: progress }} />
              </div>
              <ul className="lp-stages">
                {DEMO_STEPS.map((item, index) => (
                  <li key={item.label} className="lp-stages__item">
                    <span className="lp-stages__icon" aria-hidden="true">
                      {step > index && (
                        <span className="lp-stages__done">
                          <Check size={13} strokeWidth={3} />
                        </span>
                      )}
                      {step === index && <span className="lp-stages__spin" />}
                      {step < index && <span className="lp-stages__wait" />}
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <span className="lp-demo__muted">{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="lp-demo__done">
              <div className="lp-chips">
                <span className="lp-chip lp-chip--ok">Completed</span>
                <span className="lp-chip">{DEMO_FINDINGS.length} issues detected</span>
                <span className="lp-chip">AI explanation ready</span>
              </div>

              <div className="lp-tabs">
                <button type="button" aria-pressed={tab === 'issues'} onClick={() => setTab('issues')}>
                  Issues
                </button>
                <button type="button" aria-pressed={tab === 'fix'} onClick={() => setTab('fix')}>
                  Corrected code
                </button>
              </div>

              {tab === 'issues' ? (
                <ul className="lp-issues">
                  {DEMO_FINDINGS.map((finding, index) => (
                    <li key={finding.rule}>
                      <button
                        type="button"
                        className={`lp-issue${index === selected ? ' lp-issue--selected' : ''}`}
                        onClick={() => setSelected(index)}
                        aria-pressed={index === selected}
                      >
                        <SeverityBadge severity={finding.severity} />
                        <span className="lp-issue__body">
                          <strong>{finding.type}</strong>
                          <span className="lp-demo__muted">{finding.message}</span>
                          <code>
                            Line {finding.line} · {finding.rule}
                          </code>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="lp-fix">
                  <p className="lp-fix__title">AI explanation</p>
                  <p className="lp-demo__muted">
                    The function divides by zero and compares values with <code>is</code>. Below is a proposed fix.
                    Nothing is applied automatically.
                  </p>
                  <div className="lp-code lp-code--boxed" role="img" aria-label="Proposed corrected code">
                    {DEMO_FIX.map((text, index) => (
                      <CodeLine
                        key={index}
                        number={index + 1}
                        text={text}
                        tone={DEMO_FIX_CHANGED.includes(index + 1) ? 'changed' : undefined}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <figcaption className="lp-demo__caption">
        Simulation on the example code shipped with the app. Click a finding to locate it, or run the analysis again.
      </figcaption>
    </figure>
  );
}
