// CircleGrid.jsx
import React, { useEffect, useState, useRef } from 'react';
import './CircleGrid.css';
import Circle from './Circle';
import SVGFilters from './SVGFilters'; 

const CircleGrid = ({
  minCircleSize = 65,
  maxCircleSize = 65,
  mobileMinCircleSize = 50,
  mobileMaxCircleSize = 50,
  gapRatio = 0.2,
  circleStyle = {},
  customCircles = {},
  lingerMs = 150000,
  svgFolder = '/emojis/',
  svgNamePattern = 'jiji',
  onScoreUpdate,     
  isComplete = false,
  onJijiSelect,      
  downloadedJiji,
  selectedJiji,
  onTimerStart,
  isNight = false     
}) => {
  // ALL useRef hooks FIRST
  const gridRef = useRef(null);
  const currentRef = useRef(null);
  const timeoutsRef = useRef({});
  
  // THEN useState hooks
  const [circleSize, setCircleSize] = useState(maxCircleSize);
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeIds, setActiveIds] = useState(new Set());
  const [hasStarted, setHasStarted] = useState(false);
  
  // THEN useEffect hooks
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const calculateLayout = () => {
      if (!gridRef.current) return;
      
      const containerWidth = gridRef.current.clientWidth;
      const containerHeight = gridRef.current.clientHeight;
      const effectiveMin = isMobile ? mobileMinCircleSize : minCircleSize;
      const effectiveMax = isMobile ? mobileMaxCircleSize : maxCircleSize;
      
      const widthSlots = Math.max(1, Math.floor(containerWidth / (effectiveMax * (1 + gapRatio))));
      const heightSlots = Math.max(1, Math.floor(containerHeight / (effectiveMax * (1 + gapRatio))));
      
      const widthBasedSize = containerWidth / widthSlots;
      const heightBasedSize = containerHeight / heightSlots;
      const newCircleSize = Math.max(effectiveMin, Math.min(effectiveMax, widthBasedSize, heightBasedSize));
      
      setCircleSize(newCircleSize);
      
      const gapSize = newCircleSize * gapRatio;
      const calculatedCols = Math.max(0, Math.floor(containerWidth / (newCircleSize + gapSize)));
      const calculatedRows = Math.max(0, Math.floor(containerHeight / (newCircleSize + gapSize)));
      
      setCols(calculatedCols);
      setRows(calculatedRows);
    };
    
    calculateLayout();
    const ro = new ResizeObserver(calculateLayout);
    if (gridRef.current) ro.observe(gridRef.current);
    return () => ro.disconnect();
  }, [minCircleSize, maxCircleSize, mobileMinCircleSize, mobileMaxCircleSize, gapRatio, isMobile]);
  
  // THEN helper functions
  const getSvgPath = (id) => {
    const circleNumber = parseInt(id.substring(1));
    const svgIndex = ((circleNumber - 1) % 161) + 1;
    return `${svgFolder}${svgNamePattern}${svgIndex}.svg`;
  };
  
  const getLinger = (id) => {
    if (isComplete) return 0;
    return customCircles?.[id]?.linger ?? lingerMs;
  };
  
  const activate = (id) => {
    if (isComplete) return;
    
    if (!hasStarted) {
      setHasStarted(true);
      onTimerStart?.();
    }
    
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
    setActiveIds(prev => new Set(prev).add(id));
  };
  
  const deactivate = (id, delay = null) => {
    if (delay === null) {
      setActiveIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      delete timeoutsRef.current[id];
    } else {
      timeoutsRef.current[id] = setTimeout(() => deactivate(id, null), delay);
    }
  };

  const handleCircleClick = (id) => {
    if (isComplete && !downloadedJiji) {
      const svgPath = getSvgPath(id);
      onJijiSelect?.(id, svgPath);
    }
  };
  
  const handleMouseEnter = (id) => activate(id);
  
  const handleMouseLeave = (id) => {
    if (!isComplete) {
      deactivate(id, getLinger(id));
    }
  };
  
  const handleTouchStart = (e) => {
    const touch = e.touches?.[0];
    if (!touch) return;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el?.classList.contains('circle')) {
      activate(el.id);
      currentRef.current = el.id;
    }
  };
  
  const handleTouchMove = (e) => {
    const touch = e.touches?.[0];
    if (!touch) return;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const newId = el?.classList.contains('circle') ? el.id : null;
    
    if (newId && newId !== currentRef.current) {
      if (currentRef.current && !isComplete) 
        deactivate(currentRef.current, getLinger(currentRef.current));
      activate(newId);
      currentRef.current = newId;
    } else if (!newId && currentRef.current && !isComplete) {
      deactivate(currentRef.current, getLinger(currentRef.current));
      currentRef.current = null;
    }
  };
  
  const handleTouchEnd = () => {
    if (currentRef.current && !isComplete) {  
      deactivate(currentRef.current, getLinger(currentRef.current));
      currentRef.current = null;
    }
  };
  
  useEffect(() => {
    return () => Object.values(timeoutsRef.current).forEach(clearTimeout);
  }, []);
  
  const gapSize = circleSize * gapRatio;

  useEffect(() => {
    if (onScoreUpdate && !isComplete && rows > 0 && cols > 0) {
      onScoreUpdate({
        activeIds: activeIds,
        totalCircles: rows * cols
      });
    }
  }, [activeIds, onScoreUpdate, isComplete, rows, cols]);
  
  useEffect(() => {
    if (!isComplete) {
      setHasStarted(false);
    }
  }, [isComplete]);
  
  return (
    <div
      ref={gridRef}
      className="circle-grid-container"
      style={{
        '--circle-size': `${circleSize}px`,
        '--gap-size': `${gapSize}px`,
        '--rows': rows,
        '--cols': cols,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <SVGFilters />
      
      <div className="circle-grid">
        {Array.from({ length: rows * cols }).map((_, index) => {
          const id = `c${index + 1}`;
          const custom = customCircles[id] || {};
          const isSelected = selectedJiji?.id === id;
          
          return (
            <Circle
              key={id}
              id={id}
              isActive={activeIds.has(id)}
              forceActive={isComplete}
              isSelectable={isComplete && !downloadedJiji}
              isSelected={isSelected}
              circleSize={circleSize}
              circleStyle={circleStyle}
              customStyle={custom.style || {}}
              svgPath={getSvgPath(id)}
              onMouseEnter={() => handleMouseEnter(id)}
              onMouseLeave={() => handleMouseLeave(id)}
              onClick={() => handleCircleClick(id)}
              isNight={isNight}    
            />
          );
        })}
      </div>
    </div>
  );
};

export default CircleGrid;