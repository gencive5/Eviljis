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
  onClick,
  forceActive = false,
  isSelectable = false,
  isSelected = false
}) => {
  const [svgFailed, setSvgFailed] = useState(false);
  const showSvg = svgPath && !svgFailed;
  
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
      className={`circle ${isActive ? 'active' : ''} ${isSelectable ? 'selectable' : ''} ${isSelected ? 'selected' : ''}`}
      style={{
        width: `${circleSize}px`,
        height: `${circleSize}px`,
        ...circleStyle,
        ...customStyle,
        cursor: isSelectable ? 'pointer' : 'pointer',
        ...(backgroundColor && { backgroundColor }),
        ...(!svgPath && !backgroundColor && { backgroundColor: 'rgb(48, 219, 156)' }),
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
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
            transition: 'filter 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease',
            filter: (isActive || forceActive) ? activeFilter : 'none',
            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
            boxShadow: isSelected ? '0 0 20px rgba(253, 238, 26, 0.8)' : 'none'
          }}
          onError={() => setSvgFailed(true)}
        />
      ) : null}
    </div>
  );
};

export default Circle;