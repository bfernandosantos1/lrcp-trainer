import { useState, useEffect, useRef } from 'react';
import { TRIVIA_FACTS } from '../../data/triviaFacts';

interface Props {
  onComplete: () => void;
}

const DURATION = 4000; // 4 seconds
const SKIP_DELAY = 1500; // Show skip button after 1.5s

export function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const recentRef = useRef<number[]>([]);

  // Pick a random trivia fact, avoiding recent repeats
  const [factIndex] = useState(() => {
    const recent = recentRef.current;
    const available = TRIVIA_FACTS.map((_, i) => i).filter(i => !recent.includes(i));
    const pool = available.length > 0 ? available : TRIVIA_FACTS.map((_, i) => i);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    recent.push(picked);
    if (recent.length > 5) recent.shift();
    return picked;
  });

  const fact = TRIVIA_FACTS[factIndex];

  // Progress bar animation
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / DURATION) * 100);
      setProgress(pct);
      if (elapsed >= DURATION) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  // Show skip button after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), SKIP_DELAY);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 fade-in">
      {/* EKG line */}
      <div className="w-full max-w-xl mb-10">
        <div className="ekg-line" />
      </div>

      {/* Trivia fact */}
      <div className="max-w-lg text-center mb-8">
        <p className="text-xs text-vital-cyan uppercase tracking-widest mb-3 font-clinical">Did You Know?</p>
        <p className="text-monitor-text text-sm leading-relaxed trivia-pulse">{fact}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-6">
        <div className="w-full h-1 bg-monitor-panel rounded-full overflow-hidden border border-monitor-border/30">
          <div
            className="h-full bg-vital-cyan rounded-full transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-xs text-monitor-text/40 mt-2 font-clinical">Preparing case...</p>
      </div>

      {/* Skip button */}
      {showSkip && (
        <button
          onClick={onComplete}
          className="text-xs text-monitor-text/30 hover:text-vital-cyan transition-colors fade-in"
        >
          Ready — skip
        </button>
      )}
    </div>
  );
}
