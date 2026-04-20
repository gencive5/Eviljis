// components/Timer.jsx - Lightweight irregularity via CSS classes
import React, { useState, useEffect } from 'react';
import './App.css';

const Timer = ({ activeIds, lingerMs = 150000, isComplete, currentScore = 0, totalEmojis = 161 }) => {
  const [timers, setTimers] = useState(new Map());
  const [frozen, setFrozen] = useState(null);

  useEffect(() => {
    if (isComplete) {
      if (!frozen) setFrozen(new Map(timers));
      return;
    }
    setFrozen(null);
    
    const newTimers = new Map();
    activeIds.forEach(id => {
      newTimers.set(id, {
        id,
        end: Date.now() + lingerMs,
        offset: parseInt(id.substring(1)) % 5, // 0-4 offset class
      });
    });
    setTimers(newTimers);
  }, [activeIds, isComplete, lingerMs]);

  useEffect(() => {
    if (isComplete || timers.size === 0) return;
    const interval = setInterval(() => setTimers(new Map(timers)), 1000);
    return () => clearInterval(interval);
  }, [timers, isComplete]);

  const display = isComplete ? frozen : timers;
  if (!display?.size) return null;

  const blur = Math.min(8, (currentScore / totalEmojis) * 8);

  return (
    <div className="timers-wrapper" style={{ filter: `blur(${blur}px)` }}>
      <div className="timers-flex">
        {Array.from(display.values()).map((t) => {
          const left = Math.max(0, t.end - Date.now());
          const mins = Math.floor(left / 60000);
          const secs = Math.ceil((left % 60000) / 1000);
          
          return (
            <div 
              key={t.id} 
              className={`timer-item offset-${t.offset}`}
            >
              <span className="timer-text">{mins}:{secs.toString().padStart(2, '0')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timer;