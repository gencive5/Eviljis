import React, { useEffect, useState, useRef } from 'react';
import './CircleGrid.css';

const CircleGrid = ({
  minCircleSize = 45,
  maxCircleSize = 45,
  mobileMinCircleSize = 20,
  mobileMaxCircleSize = 25,
  gapRatio = 0.2,
  circleStyle = {},
  customCircles = {},
  lingerMs = 30000,
  modalContent = "Inspired from Betelgeuse from the portfolio Cinétique III, 1959 - Victor Vasarely",
  svgFolder = '/emojis/', // Path to your SVG folder
  svgNamePattern = 'emoji', // Pattern for SVG names (emoji1.svg, emoji2.svg, etc.)
}) => {
  const gridRef = useRef(null);
  const [circleSize, setCircleSize] = useState(maxCircleSize);
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showModal, setShowModal] = useState(false);
  const [lastCircleId, setLastCircleId] = useState('');
  const [modalLetters, setModalLetters] = useState([]);
  const [failedSvgs, setFailedSvgs] = useState(new Set()); // Track failed SVG loads

  // Active ids stored as a Set so multiple circles can linger at once.
  const [activeIds, setActiveIds] = useState(() => new Set());
  const activeIdsRef = useRef(activeIds);
  useEffect(() => { activeIdsRef.current = activeIds; }, [activeIds]);

  // track the currently touched circle id (the one under the finger right now)
  const currentRef = useRef(null);

  // scheduled removal timeouts, map id -> timeoutId
  const scheduledRef = useRef({});

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
      
      const lastId = `c${calculatedCols * calculatedRows}`;
      setLastCircleId(lastId);
    };

    calculateLayout();
    const ro = new ResizeObserver(calculateLayout);
    if (gridRef.current) ro.observe(gridRef.current);

    return () => {
      ro.disconnect();
    };
  }, [minCircleSize, maxCircleSize, mobileMinCircleSize, mobileMaxCircleSize, gapRatio, isMobile]);

  // Prepare letters for modal text when modal opens
  useEffect(() => {
    if (showModal) {
      const letters = modalContent.split('').map((char, index) => ({
        char: char,
        id: index
      }));
      setModalLetters(letters);
    }
  }, [showModal, modalContent]);

  // Function to get SVG path for a circle
  const getSvgPath = (id) => {
    // Extract the number from c1, c2, etc.
    const circleNumber = parseInt(id.substring(1));
    
    // Cycle through SVGs (adjust 50 to the number of unique SVGs you have)
    const svgIndex = ((circleNumber - 1) % 155) + 1;
    return `${svgFolder}${svgNamePattern}${svgIndex}.svg`;
  };

  // --- helpers for active state & scheduling ---
  const addActive = (id) => {
    setActiveIds(prev => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
  };

  const removeActiveImmediate = (id) => {
    setActiveIds(prev => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
  };

  const clearScheduled = (id) => {
    const t = scheduledRef.current[id];
    if (t) {
      clearTimeout(t);
      delete scheduledRef.current[id];
    }
  };

  const scheduleRemove = (id, delay) => {
    clearScheduled(id);
    scheduledRef.current[id] = setTimeout(() => {
      removeActiveImmediate(id);
      delete scheduledRef.current[id];
    }, delay);
  };

  const getLinger = (id) => {
    const cfg = customCircles?.[id];
    if (cfg && typeof cfg.linger === 'number') return cfg.linger;
    return lingerMs;
  };

  // Toggle modal on last circle click
  const handleLastCircleClick = (e) => {
    e.stopPropagation();
    setShowModal(!showModal);
  };

  // --- Desktop hover handlers ---
  const handleMouseEnter = (id) => {
    if (id === lastCircleId) return;
    clearScheduled(id);
    addActive(id);
  };

  const handleMouseLeave = (id) => {
    scheduleRemove(id, getLinger(id));
  };

  // --- touch handlers ---
  const handleTouchStart = (e) => {
    const touch = e.touches && e.touches[0];
    if (!touch) return;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el && el.classList.contains('circle')) {
      const id = el.id;
      if (id === lastCircleId) return;
      clearScheduled(id);
      addActive(id);
      currentRef.current = id;
    }
  };

  const handleTouchMove = (e) => {
    const touch = e.touches && e.touches[0];
    if (!touch) return;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);

    if (el && el.classList.contains('circle')) {
      const id = el.id;
      if (id === lastCircleId) return;
      
      const prev = currentRef.current;
      if (prev && prev !== id) {
        scheduleRemove(prev, getLinger(prev));
      }
      clearScheduled(id);
      addActive(id);
      currentRef.current = id;
    } else {
      const prev = currentRef.current;
      if (prev) {
        scheduleRemove(prev, getLinger(prev));
        currentRef.current = null;
      }
    }
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches && e.changedTouches[0];
    if (!touch) return;
    
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el && el.id === lastCircleId) {
      handleLastCircleClick(e);
      return;
    }
    
    const current = currentRef.current;
    if (current) {
      scheduleRemove(current, getLinger(current));
      currentRef.current = null;
    }
  };

  const handleClick = (e) => {
    if (e.target.id === lastCircleId || e.target.closest?.('.circle')?.id === lastCircleId) {
      handleLastCircleClick(e);
    }
  };

  const handleOverlayClick = () => {
    setShowModal(false);
  };

  // cleanup scheduled timers on unmount
  useEffect(() => {
    return () => {
      Object.values(scheduledRef.current).forEach(clearTimeout);
      scheduledRef.current = {};
    };
  }, []);

  const gapSize = circleSize * gapRatio;

  // Helper function to get circle background color
  const getCircleBackgroundColor = (id, isLastCircle, hasSvg, svgFailed) => {
    if (isLastCircle) return undefined; // Last circle has its own CSS
    if (hasSvg && !svgFailed) return 'transparent';
    if (svgFailed) return '#cccccc'; // Fallback color for failed SVGs
    return undefined; // Let CSS handle default background
  };

  return (
    <>
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
        onClick={handleClick}
      >
        <div className="circle-grid">
          {Array.from({ length: rows * cols }).map((_, index) => {
            const id = `c${index + 1}`;
            const custom = customCircles[id] || {};
            const customStyle = custom.style || {};
            const isLastCircle = id === lastCircleId;
            const svgPath = !isLastCircle ? getSvgPath(id) : null;
            const svgFailed = failedSvgs.has(id);
            
            // Determine if we should show SVG (has path and not failed)
            const showSvg = svgPath && !svgFailed;
            
            // Get background color without mixing shorthand and longhand
            const backgroundColor = getCircleBackgroundColor(id, isLastCircle, !!svgPath, svgFailed);
            
            return (
              <div
                key={id}
                id={id}
                className={`circle ${activeIds.has(id) ? 'active' : ''} ${isLastCircle ? 'last-circle' : ''} ${isLastCircle && showModal ? 'modal-open' : ''}`}
                style={{
                  width: `${circleSize}px`,
                  height: `${circleSize}px`,
                  ...circleStyle,
                  ...customStyle,
                  cursor: 'pointer',
                  // Only set backgroundColor if needed, don't mix with background
                  ...(backgroundColor && { backgroundColor }),
                  // Add a default background for circles without SVGs (from your original CSS)
                  ...(!isLastCircle && !svgPath && !backgroundColor && { backgroundColor: 'rgb(48, 219, 156)' }),
                }}
                onMouseEnter={() => !isLastCircle && handleMouseEnter(id)}
                onMouseLeave={() => !isLastCircle && handleMouseLeave(id)}
              >
                {isLastCircle ? (
                  <span className="circle-letter toggle-icon">
                    {showModal ? '×' : 'i'}
                  </span>
                ) : showSvg ? (
                  <img 
                    src={svgPath} 
                    alt={`${id}`}
                    className="circle-svg"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      pointerEvents: 'none',
                      borderRadius: '50%',
                    }}
                    onError={() => {
                      // Mark this SVG as failed
                      setFailedSvgs(prev => new Set(prev).add(id));
                    }}
                  />
                ) : showModal && modalLetters[index] ? (
                  <span className="circle-letter">
                    {modalLetters[index].char}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      
      {showModal && (
        <div className="modal-overlay" onClick={handleOverlayClick} />
      )}
    </>
  );
};

export default CircleGrid;