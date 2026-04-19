// components/Timer.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const Timer = ({ 
  lingerMs = 150000, 
  isActive = false,
  isComplete = false,
  onTimerComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState(lingerMs);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerEndRef = useRef(null);

  // Start timer when first emoji is touched
  useEffect(() => {
    if (isActive && !isRunning && !isComplete) {
      setIsRunning(true);
      startTimeRef.current = Date.now();
      timerEndRef.current = Date.now() + lingerMs;
    }
  }, [isActive, isRunning, isComplete, lingerMs]);

  // Reset timer if game is reset
  useEffect(() => {
    if (!isActive) {
      setIsRunning(false);
      setTimeLeft(lingerMs);
      startTimeRef.current = null;
      timerEndRef.current = null;
    }
  }, [isActive, lingerMs]);

  // Animation loop for smooth countdown
  useEffect(() => {
    if (!isRunning || isComplete) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, timerEndRef.current - now);
      
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        setIsRunning(false);
        onTimerComplete?.();
      } else {
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, isComplete, onTimerComplete]);

  // Format time as MM:SS
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Don't render if timer hasn't started or game is complete
  if (!isRunning && !isComplete) return null;
  if (isComplete) return null;

  return (
    <div className="timer-container">
      <div className="timer-display">
        <span className="timer-text">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

export default Timer;