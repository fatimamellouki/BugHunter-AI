import { Bug, FlaskConical, GitCompare, ScanSearch, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  { title: 'Paste your Python code', text: 'Write or paste it into the editor on the Code Analysis page.' },
  { title: 'Static analysis runs', text: 'Rules look for known bug patterns and report each one with its line and severity.' },
  { title: 'The AI explains and proposes', text: 'A language model explains the findings, suggests root causes and drafts a fix and tests.' },
  { title: 'You review the report', text: 'Compare the corrected code with yours and copy only what you trust.' },
];

const FEATURES = [
  { icon: ScanSearch, title: 'Static analysis', text: 'Issues with rule ID, type, line and severity: critical, high, medium or low.' },
  { icon: Sparkles, title: 'AI explanation', text: 'Why the issues happen, in plain language, kept visibly separate from the rule-based findings.' },
  { icon: GitCompare, title: 'Corrected code', text: 'A proposed fix shown next to your original code. Nothing is applied automatically.' },
  { icon: FlaskConical, title: 'Generated Pytest tests', text: 'Test code you can copy. It is generated, not executed.' },
];

export default function Dashboard() {
  return (
    <div className="dashboard">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="hero__brand">
            <Bug size={16} aria-hidden="true" /> BugHunter AI
          </p>
          <h1 id="hero-title" className="hero__title">
            Find the bug. Understand why. Check the fix.
          </h1>
          <p className="hero__text">
            BugHunter AI combines static analysis of Python code with an AI assistant, then lays out the findings, the
            reasoning, a corrected version and test code in one report.
          </p>
          <Link to="/analysis" className="btn btn--primary btn--large">
            <ScanSearch className="btn__icon" size={18} aria-hidden="true" />
            <span>New Analysis</span>
          </Link>
        </div>

        <figure className="hero__illustration" aria-hidden="true">
          <pre className="mini-code">
            <span className="mini-code__line">
              <i>4</i>
              {'    total += number'}
            </span>
            <span className="mini-code__line mini-code__line--flag">
              <i>5</i>
              {'    average = total / 0'}
            </span>
            <span className="mini-code__line">
              <i>6</i>
              {'    if average is 10:'}
            </span>
          </pre>
          <figcaption>
            <strong>PotentialZeroDivision</strong> on line 5, severity high. Illustration of one finding.
          </figcaption>
        </figure>
      </section>

      <section className="section" aria-labelledby="how-title">
        <h2 id="how-title">How it works</h2>
        <ol className="steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="steps__item">
              <span className="steps__number">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="features-title">
        <h2 id="features-title">What the report contains</h2>
        <ul className="features">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="features__item">
              <Icon size={20} aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section section--note" aria-labelledby="know-title">
        <h2 id="know-title">Good to know</h2>
        <ul className="know-list">
          <li>Python code only. Analyses are not stored, so there is no history or statistics yet.</li>
          <li>The AI can be wrong. Only the issues from static analysis are rule-based findings.</li>
          <li>Generated tests are not run by the backend, so no pass or fail result is shown.</li>
        </ul>
      </section>
    </div>
  );
}
