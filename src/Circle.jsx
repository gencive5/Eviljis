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
          }}
          onError={() => setSvgFailed(true)}
        />
      ) : null}
    </div>
  );
};

export default Circle;