import React, { useEffect, useState, useRef } from 'react';
import './CircleGrid.css';
import Circle from './Circle';

const CircleGrid = ({
  minCircleSize = 65,
  maxCircleSize = 65,
  mobileMinCircleSize = 30,
  mobileMaxCircleSize = 30,
  gapRatio = 0.2,
  circleStyle = {},
  customCircles = {},
  lingerMs = 30000,
  svgFolder = '/emojis/',
  svgNamePattern = 'emoji',
}) => {
  const gridRef = useRef(null);
  const [circleSize, setCircleSize] = useState(maxCircleSize);
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeIds, setActiveIds] = useState(new Set());
  const currentRef = useRef(null);
  const timeoutsRef = useRef({});

  // Layout calculation (unchanged)
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

  const getSvgPath = (id) => {
    const circleNumber = parseInt(id.substring(1));
    const svgIndex = ((circleNumber - 1) % 164) + 1;
    return `${svgFolder}${svgNamePattern}${svgIndex}.svg`;
  };

  const getLinger = (id) => customCircles?.[id]?.linger ?? lingerMs;

  const activate = (id) => {
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

  // Desktop handlers
  const handleMouseEnter = (id) => activate(id);
  const handleMouseLeave = (id) => deactivate(id, getLinger(id));

  // Touch handlers
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
      if (currentRef.current) deactivate(currentRef.current, getLinger(currentRef.current));
      activate(newId);
      currentRef.current = newId;
    } else if (!newId && currentRef.current) {
      deactivate(currentRef.current, getLinger(currentRef.current));
      currentRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    if (currentRef.current) {
      deactivate(currentRef.current, getLinger(currentRef.current));
      currentRef.current = null;
    }
  };

  // Cleanup
  useEffect(() => {
    return () => Object.values(timeoutsRef.current).forEach(clearTimeout);
  }, []);

  const gapSize = circleSize * gapRatio;

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
      <div className="circle-grid">
        {Array.from({ length: rows * cols }).map((_, index) => {
          const id = `c${index + 1}`;
          const custom = customCircles[id] || {};
          return (
            <Circle
              key={id}
              id={id}
              isActive={activeIds.has(id)}
              circleSize={circleSize}
              circleStyle={circleStyle}
              customStyle={custom.style || {}}
              svgPath={getSvgPath(id)}
              onMouseEnter={() => handleMouseEnter(id)}
              onMouseLeave={() => handleMouseLeave(id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CircleGrid;