// components/Timer.jsx - ULTRA MINIMAL
import React, { useState, useEffect } from 'react';
import './App.css';

const POSITIONS = Array.from({ length: 200 }, () => ({
  left: Math.random() * 80 + 10,
  bottom: Math.random() * 60 + 20,
  rotation: (Math.random() - 0.5) * 10
}));

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
        pos: parseInt(id.substring(1)) % 200
      });
    });
    setTimers(newTimers);
  }, [activeIds, isComplete, lingerMs]);

  // Force re-render every second
  useEffect(() => {
    if (isComplete || timers.size === 0) return;
    const interval = setInterval(() => setTimers(new Map(timers)), 1000);
    return () => clearInterval(interval);
  }, [timers, isComplete]);

  const display = isComplete ? frozen : timers;
  if (!display?.size) return null;

  const blur = Math.min(8, (currentScore / totalEmojis) * 8);

  return (
    <div className="timers-wrapper">
      {Array.from(display.values()).map(t => {
        const p = POSITIONS[t.pos];
        const left = Math.max(0, t.end - Date.now());
        const mins = Math.floor(left / 60000);
        const secs = Math.ceil((left % 60000) / 1000);
        
        return (
          <div key={t.id} className="timer-container" style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            transform: `scaleY(28) rotate(${p.rotation}deg)`,
            filter: `blur(${blur}px)`, 
            opacity: isComplete ? 0.6 : 1
          }}>
            <span className="timer-text">{mins}:{secs.toString().padStart(2, '0')}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Timer;