// components/Timer.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const Timer = ({ 
  activeIds = new Set(),
  lingerMs = 150000,
  isComplete = false
}) => {
  const [timers, setTimers] = useState(new Map());
  const [frozenTimers, setFrozenTimers] = useState(new Map()); // Store frozen timers
  const animationFrameRef = useRef(null);
  const wasCompleteRef = useRef(false);

  // Add new timers when emojis are activated
  useEffect(() => {
    // When game completes, freeze the current timers
    if (isComplete && !wasCompleteRef.current) {
      setFrozenTimers(new Map(timers));
      wasCompleteRef.current = true;
      return;
    }
    
    // When game is reset, clear frozen timers
    if (!isComplete) {
      wasCompleteRef.current = false;
      setFrozenTimers(new Map());
    }
    
    if (isComplete) {
      return; // Don't update timers when game is complete
    }

    setTimers(prevTimers => {
      const newTimers = new Map(prevTimers);
      
      // Add new active emojis
      activeIds.forEach(id => {
        if (!newTimers.has(id)) {
          newTimers.set(id, {
            id,
            endTime: Date.now() + lingerMs,
            timeLeft: lingerMs
          });
        }
      });
      
      // Remove deactivated emojis
      newTimers.forEach((_, id) => {
        if (!activeIds.has(id)) {
          newTimers.delete(id);
        }
      });
      
      return newTimers;
    });
  }, [activeIds, isComplete, lingerMs, timers]);

  // Animation loop for all timers
  useEffect(() => {
    if (isComplete || timers.size === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const updateTimers = () => {
      const now = Date.now();
      let hasChanges = false;
      
      setTimers(prevTimers => {
        const updatedTimers = new Map(prevTimers);
        
        updatedTimers.forEach((timer, id) => {
          const timeLeft = Math.max(0, timer.endTime - now);
          if (timeLeft !== timer.timeLeft) {
            updatedTimers.set(id, { ...timer, timeLeft });
            hasChanges = true;
          }
          
          // Remove timer if it reached 0
          if (timeLeft <= 0) {
            updatedTimers.delete(id);
            hasChanges = true;
          }
        });
        
        return hasChanges ? updatedTimers : prevTimers;
      });
      
      animationFrameRef.current = requestAnimationFrame(updateTimers);
    };

    animationFrameRef.current = requestAnimationFrame(updateTimers);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timers.size, isComplete]);

  // Format time as MM:SS
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Use frozen timers when game is complete, otherwise use active timers
  const displayTimers = isComplete ? frozenTimers : timers;
  
  // Don't render if no timers to display
  if (displayTimers.size === 0) return null;

  // Convert timers map to array for rendering
  const timerArray = Array.from(displayTimers.values());

  return (
    <div className={`timers-wrapper ${isComplete ? 'timers-frozen' : ''}`}>
      {timerArray.map((timer, index) => (
        <div 
          key={timer.id} 
          className="timer-container"
          style={{
            right: `${20 + (index * 120)}px` // Stack timers horizontally
          }}
        >
          <div className="timer-display">
            <span className="timer-text">{formatTime(timer.timeLeft)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timer;