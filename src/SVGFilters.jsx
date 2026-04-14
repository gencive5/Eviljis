// components/SVGFilters.jsx
import React from 'react';

const SVGFilters = () => {
  return (
    <svg style={{ position: 'absolute', height: 0, width: 0 }} aria-hidden="true">
      <defs>
  

        {/* Liquid/Morph Effect */}
        <filter id="liquid-morph" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
          <feGaussianBlur in="displaced" stdDeviation="1" result="blurred"/>
          <feComponentTransfer in="blurred">
            <feFuncA type="linear" slope="1.2"/>
          </feComponentTransfer>
        </filter>




        {/* NEW Holographic/Rainbow Prism */}
        <filter id="hologram" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
          <feGaussianBlur in="displaced" stdDeviation="1" result="blurred"/>
          <feComponentTransfer in="blur" result="rainbow">
            <feFuncR type="discrete" tableValues="0 1 0 0 1 0"/>
            <feFuncG type="discrete" tableValues="5 0 1 0 1 0"/>
            <feFuncB type="discrete" tableValues="1 3 0 1 0 0"/>
          </feComponentTransfer>
          <feBlend mode="screen" in="rainbow" in2="SourceGraphic"/>
         
        </filter>



        {/* Drop Shadow with Color */}
        <filter id="color-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="3" dy="3" stdDeviation="4" floodColor="#ff00ff" floodOpacity="1" result="shadow1"/>
          <feDropShadow dx="-3" dy="-3" stdDeviation="4" floodColor="#00ffff" floodOpacity="1" result="shadow2"/>
          <feMerge>
            <feMergeNode in="shadow1"/>
            <feMergeNode in="shadow2"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Bright Glow */}
        <filter id="bright-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur3"/>
          <feMerge>
            <feMergeNode in="blur3"/>
            <feMergeNode in="blur2"/>
            <feMergeNode in="blur1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

       *

        {/* previous Holographic/Rainbow Prism */}
        {/* <filter id="h0l0gram" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComponentTransfer in="blur" result="rainbow">
            <feFuncR type="discrete" tableValues="0 1 0 0 1 0"/>
            <feFuncG type="discrete" tableValues="0 0 1 0 1 0"/>
            <feFuncB type="discrete" tableValues="1 0 0 1 0 0"/>
          </feComponentTransfer>
          <feBlend mode="screen" in="rainbow" in2="SourceGraphic"/>
        </filter> */}
        
      </defs>
    </svg>

       
  );
};

export default SVGFilters;