import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './CliMetaPanel.module.css';

function useTyping(text, deps = [], speed = 24) {
  const [output, setOutput] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setOutput('');
    setDone(false);
    if (!text) {
      setDone(true);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOutput(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { output, done };
}

export default function CliMetaPanel({ description, keywords }) {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('desc'); // 'desc' | 'keys'

  const descCmd = 'cat DESCRIPTION';
  const keysCmd = 'ls KEYWORDS';

  const command = active === 'desc' ? descCmd : keysCmd;
  const { output: typed, done } = useTyping(command, [active], 18);

  const normalizedKeywords = useMemo(() => {
    if (Array.isArray(keywords)) return keywords;
    if (typeof keywords === 'string') {
      return keywords
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, [keywords]);

  const showDescOutput = active === 'desc' && done;
  const showKeysOutput = active === 'keys' && done;

  return (
    <div className={`${styles.window} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <div className={styles.title}>bash - Terminal</div>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.ctrlBtn}
            aria-label={collapsed ? 'Restore' : 'Minimize'}
            title={collapsed ? 'Restore' : 'Minimize'}
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? '▢' : '—'}
          </button>
        </div>
      </div>

      <div className={collapsed ? styles.hiddenBody : ''}>
        <div className={styles.tabs} role="tablist" aria-label="Meta Tabs">
          <button
            role="tab"
            aria-selected={active === 'desc'}
            className={`${styles.tab} ${active === 'desc' ? styles.tabActive : ''}`}
            onClick={() => setActive('desc')}
          >
            DESCRIPTION
          </button>
          <button
            role="tab"
            aria-selected={active === 'keys'}
            className={`${styles.tab} ${active === 'keys' ? styles.tabActive : ''}`}
            onClick={() => setActive('keys')}
          >
            KEYWORDS
          </button>
        </div>

        <div className={styles.content} role="tabpanel">
          <div className={styles.line}>
            <span className={styles.prompt}>$ </span>
            <span className={styles.cmd}>{typed}</span>
            {!done && <span className={styles.caret} />}
          </div>

          {showDescOutput && (
            <div className={styles.output}>
              {description ? (
                <span>{description}</span>
              ) : (
                <span className={styles.srOnly}>No description</span>
              )}
            </div>
          )}

          {showKeysOutput && (
            <div className={`${styles.output} ${styles.chipGroup}`}>
              {normalizedKeywords.length > 0 ? (
                normalizedKeywords.map((k, i) => (
                  <span key={`${k}-${i}`} className={styles.chip}>{k}</span>
                ))
              ) : (
                <span className={styles.srOnly}>No keywords</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
