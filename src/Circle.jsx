// components/Circle.jsx
import React, { useState } from 'react';

const Circle = ({ 
  id, 
  isActive, 
  circleSize, 
  circleStyle, 
  customStyle, 
  svgPath,
  onMouseEnter,
  onMouseLeave
}) => {
  const [svgFailed, setSvgFailed] = useState(false);
  const showSvg = svgPath && !svgFailed;
  
  // Choose which filter to apply when active
  // Option 1: Single filter for all
  const activeFilter = 'url(#soft-glow)';
  
  // Option 2: Random filters for variety (uncomment to use)
  // const filters = ['#neon-glow', '#chromatic-split', '#glitch', '#hologram', '#electric', '#water-ripple'];
  // const [filter] = useState(() => filters[Math.floor(Math.random() * filters.length)]);
  // const activeFilter = `url(${filter})`;
  
  // Option 3: Different filter based on circle ID (uncomment to use)
  // const getFilterByIndex = (circleId) => {
  //   const num = parseInt(circleId.substring(1));
  //   const filters = ['#neon-glow', '#chromatic-split', '#glitch', '#hologram', '#electric'];
  //   return filters[num % filters.length];
  // };
  // const activeFilter = `url(${getFilterByIndex(id)})`;
  
  const getBackgroundColor = () => {
    if (showSvg) return 'transparent';
    if (svgFailed) return '#cccccc';
    return undefined;
  };

  const backgroundColor = getBackgroundColor();

  return (
    <div
      id={id}
      className={`circle ${isActive ? 'active' : ''}`}
      style={{
        width: `${circleSize}px`,
        height: `${circleSize}px`,
        ...circleStyle,
        ...customStyle,
        cursor: 'pointer',
        ...(backgroundColor && { backgroundColor }),
        ...(!svgPath && !backgroundColor && { backgroundColor: 'rgb(48, 219, 156)' }),
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showSvg ? (
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
            // Add filter transition
            transition: 'filter 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            // Apply filter when active
            filter: isActive ? activeFilter : 'none'
          }}
          onError={() => setSvgFailed(true)}
        />
      ) : null}
    </div>
  );
};

export default Circle;