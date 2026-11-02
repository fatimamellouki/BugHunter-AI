import { useRef } from 'react';

export const tabId = (id) => `tab-${id}`;
export const panelId = (id) => `panel-${id}`;

/** Accessible tab list: arrow keys, Home and End move between tabs. */
export default function Tabs({ tabs, activeId, onChange, label }) {
  const refs = useRef({});

  const handleKeyDown = (event, index) => {
    const lastIndex = tabs.length - 1;
    const targets = {
      ArrowRight: index === lastIndex ? 0 : index + 1,
      ArrowLeft: index === 0 ? lastIndex : index - 1,
      Home: 0,
      End: lastIndex,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    const next = tabs[targets[event.key]];
    onChange(next.id);
    refs.current[next.id]?.focus();
  };

  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(node) => {
            refs.current[tab.id] = node;
          }}
          id={tabId(tab.id)}
          type="button"
          role="tab"
          aria-selected={tab.id === activeId}
          aria-controls={panelId(tab.id)}
          tabIndex={tab.id === activeId ? 0 : -1}
          className="tabs__tab"
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {tab.label}
          {tab.count !== undefined && <span className="tabs__count">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}
