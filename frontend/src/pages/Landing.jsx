import { ArrowRight, Bug, Check, CircleAlert, Code, FlaskConical, GitCompare, ScanSearch, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import LandingDemo from '../components/landing/LandingDemo';

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

const LIMITS = [
  { icon: Code, title: 'Python code only', text: 'Analyses are not stored, so there is no history or statistics yet.' },
  { icon: CircleAlert, title: 'The AI can be wrong', text: 'Only the issues from static analysis are rule-based findings.' },
  { icon: FlaskConical, title: 'Generated tests are not run', text: 'The backend does not execute them, so no pass or fail result is shown.' },
];

const HIGHLIGHTS = [
  'Rule-based findings with line number and severity',
  'AI explanation kept separate from the rule-based findings',
  'Nothing is applied to your code automatically',
];

function LogoMark({ size = 34, icon = 19 }) {
  return (
    <span className="lp-logo" style={{ width: size, height: size }} aria-hidden="true">
      <Bug size={icon} />
    </span>
  );
}

export default function Landing() {
  return (
    <div className="lp">
      <a href="#demo" className="skip-link">
        Skip to content
      </a>

      <header className="lp-nav">
        <div className="lp-container lp-nav__inner">
          <Link to="/" className="lp-brand">
            <LogoMark />
            <span>BugHunter AI</span>
          </Link>
          <nav aria-label="Page sections" className="lp-nav__links">
            <a href="#demo">Live demo</a>
            <a href="#how">How it works</a>
            <a href="#features">The report</a>
            <a href="#limits">Good to know</a>
          </nav>
          <Link to="/analysis" className="btn btn--primary">
            Open the app
          </Link>
        </div>
      </header>

      <main>
        <section id="demo" className="lp-hero" aria-labelledby="hero-title">
          <div className="lp-container lp-hero__inner">
            <div className="lp-hero__copy">
              <span className="lp-eyebrow">
                <span aria-hidden="true" />
                Static analysis + AI review for Python
              </span>
              <h1 id="hero-title" className="lp-hero__title">
                Find the bug. Understand why. <em>Check the fix.</em>
              </h1>
              <p className="lp-hero__text">
                BugHunter AI combines static analysis of your Python code with an AI assistant, then lays out the
                findings, the reasoning, a corrected version and test code in one report.
              </p>
              <div className="lp-hero__actions">
                <Link to="/analysis" className="btn btn--primary btn--large lp-cta">
                  <span>Analyze your code</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a href="#how" className="btn btn--large">
                  See how it works
                </a>
              </div>
              <ul className="lp-checks">
                {HIGHLIGHTS.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">
                      <Check size={13} strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <LandingDemo />
          </div>
        </section>

        <section id="how" className="lp-section lp-section--white" aria-labelledby="how-title">
          <div className="lp-container">
            <p className="lp-kicker">How it works</p>
            <h2 id="how-title" className="lp-h2">
              From pasted code to a reviewed fix, in four steps.
            </h2>
            <ol className="lp-steps">
              {STEPS.map((step, index) => (
                <li key={step.title} className="lp-card">
                  <span className="lp-steps__number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="features" className="lp-section" aria-labelledby="features-title">
          <div className="lp-container">
            <p className="lp-kicker">The report</p>
            <h2 id="features-title" className="lp-h2">
              Everything you need to trust a fix, in one place.
            </h2>
            <ul className="lp-features">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="lp-card lp-card--row">
                  <span className="lp-icon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="limits" className="lp-section lp-section--white" aria-labelledby="limits-title">
          <div className="lp-container lp-limits">
            <div className="lp-limits__intro">
              <p className="lp-kicker">Good to know</p>
              <h2 id="limits-title" className="lp-h2">
                Honest about its limits.
              </h2>
              <p>A review tool is only useful if you know what it does and what it does not. Here is what to keep in mind.</p>
            </div>
            <ul className="lp-limits__list">
              {LIMITS.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <span className="lp-icon lp-icon--neutral">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="lp-section" aria-labelledby="cta-title">
          <div className="lp-container">
            <div className="lp-banner">
              <div>
                <h2 id="cta-title">Paste some code and read the report.</h2>
                <p>Start with your own function, or load the example in the editor and see every section of the report.</p>
              </div>
              <Link to="/analysis" className="btn btn--primary btn--large lp-cta">
                <span>Open the app</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-container lp-footer__inner">
          <div className="lp-footer__brand">
            <LogoMark size={28} icon={16} />
            <strong>BugHunter AI</strong>
            <span>AI-Powered Code Analysis &amp; Debugging Assistant</span>
          </div>
          <nav aria-label="App pages" className="lp-footer__links">
            <Link to="/analysis">Code Analysis</Link>
            <Link to="/results">Analysis Results</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
