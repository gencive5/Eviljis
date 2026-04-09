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
  onMouseLeave,
  forceActive = false 
}) => {
  const [svgFailed, setSvgFailed] = useState(false);
  const showSvg = svgPath && !svgFailed;
  
  // Choose which filter to apply when active
  const activeFilter = 'url(#water-ripple)';
  
  
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
             filter: (isActive || forceActive) ? activeFilter : 'none'
          }}
          onError={() => setSvgFailed(true)}
        />
      ) : null}
    </div>
  );
};

export default Circle;