import { useState } from "react";
import type { Hint } from "./scenes";

interface HintScaffoldingProps {
  hints: Hint[];
}

const LEVEL_LABELS: Record<number, string> = {
  1: "现象定位",
  2: "原理穿透",
  3: "验证建议",
};

export function HintScaffolding({ hints }: HintScaffoldingProps) {
  const [unlocked, setUnlocked] = useState<Set<number>>(new Set([1]));

  function handleUnlock(nextLevel: number) {
    setUnlocked((prev) => new Set([...prev, nextLevel]));
  }

  return (
    <div className="cm-hints-list">
      {hints.map((hint) => {
        const isUnlocked = unlocked.has(hint.level);
        const canUnlock = hint.level === Math.max(...unlocked) + 1;

        return (
          <div
            key={hint.level}
            className={`cm-hint-item ${isUnlocked ? "unlocked" : "locked"}`}
            onClick={() => canUnlock && handleUnlock(hint.level)}
          >
            <span className={`cm-hint-level l${hint.level} ${!isUnlocked ? "locked" : ""}`}>
              L{hint.level}
            </span>
            <span style={{ color: "var(--cm-text-muted)", fontSize: "0.76rem", fontWeight: 600 }}>
              {LEVEL_LABELS[hint.level]}
            </span>
            {isUnlocked ? (
              <>
                <span className="cm-hint-text">{hint.text}</span>
                <span className="cm-hint-status">✅</span>
              </>
            ) : (
              <>
                <span className="cm-hint-text" style={{ opacity: 0.45 }}>{hint.text.slice(0, 28)}...</span>
                <span className="cm-hint-status">{canUnlock ? "🔓 点击解锁" : "🔒"}</span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
