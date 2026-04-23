// Circle.jsx - NO GLOW VERSION
import React, { useState } from 'react';
import './App.css'; 

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
  const [isHovered, setIsHovered] = useState(false);
  const showSvg = svgPath && !svgFailed;
  
  const activeFilter = 'url(#h2l2gram)';
  const selectFilter = 'url(#expandDeformIntense)';
  
  const getBackgroundColor = () => {
    if (showSvg) return 'transparent';
    if (svgFailed) return '#cccccc';
    return undefined;
  };

  const backgroundColor = getBackgroundColor();

  // Determine which filter to apply
  const getFilter = () => {
    // Selected state takes priority
    if (isSelected) return selectFilter;
    // Hover state when selectable (game complete) gets the filter too
    if (isSelectable && isHovered) return selectFilter;
    // Active state for normal gameplay
    if (isActive || forceActive) return activeFilter;
    return 'none';
  };

  // Determine scale transform
  const getScale = () => {
    // Selected state scales up
    if (isSelected) return 'scale(1.15)';
    // Hover state when selectable scales up slightly
    if (isSelectable && isHovered) return 'scale(1.08)';
    return 'scale(1)';
  };

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave(e);
  };

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Indicator badge */}
      {isSelectable && (
        <div className={`circle-indicator ${isSelected ? 'selected-indicator' : ''}`}>
          <span className="indicator-text">
            {isSelected ? '!' : '?'}
          </span>
        </div>
      )}
      
      {showSvg ? (
        <img 
          src={svgPath} 
          alt=""
          className="circle-svg"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            borderRadius: '50%',
            transition: 'transform 0.25s cubic-bezier(0.34, 1.2, 0.64, 1), filter 0.2s ease',
            filter: getFilter(),
            transform: getScale(),
            // NO boxShadow - removed completely!
          }}
          onError={() => setSvgFailed(true)}
        />
      ) : null}
    </div>
  );
};

export default Circle;