// components/SVGFilters.jsx
import React from 'react';

const SVGFilters = () => {
  return (
    <svg style={{ position: 'absolute', height: 0, width: 0 }} aria-hidden="true">
      <defs>
        {/* Multi-layered Neon Glow */}
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur3"/>
          <feComponentTransfer in="blur3" result="neon">
            <feFuncA type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="neon"/>
            <feMergeNode in="blur2"/>
            <feMergeNode in="blur1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* RGB Split/Chromatic Aberration */}
        <filter id="chromatic-split" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset in="SourceGraphic" dx="3" dy="0" result="red-shift">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
          </feOffset>
          <feOffset in="SourceGraphic" dx="-3" dy="0" result="blue-shift">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  1 0 0 0 0  0 0 0 1 0"/>
          </feOffset>
          <feBlend mode="screen" in="red-shift" in2="blue-shift" result="chromatic"/>
          <feMerge>
            <feMergeNode in="chromatic"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Liquid/Morph Effect */}
        <filter id="liquid-morph" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
          <feGaussianBlur in="displaced" stdDeviation="1" result="blurred"/>
          <feComponentTransfer in="blurred">
            <feFuncA type="linear" slope="1.2"/>
          </feComponentTransfer>
        </filter>

        {/* Fire/Electric Effect */}
        <filter id="electric" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="turbulence" baseFrequency="0.1" numOctaves="2" seed="3" result="turbulence"/>
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
          <feGaussianBlur in="displaced" stdDeviation="1.5" result="blurred"/>
          <feComponentTransfer in="blurred" result="contrasted">
            <feFuncR type="linear" slope="2" intercept="-0.5"/>
            <feFuncG type="linear" slope="1.5" intercept="-0.3"/>
            <feFuncB type="linear" slope="0.5"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="contrasted"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Glitch Effect */}
        <filter id="glitch" x="-20%" y="-20%" width="140%" height="140%">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 1 0 0  0 1 0 0 0  0 0 0 1 0" result="color-shift"/>
          <feOffset in="color-shift" dx="4" dy="0" result="shifted1"/>
          <feOffset in="SourceGraphic" dx="-4" dy="0" result="shifted2"/>
          <feBlend mode="screen" in="shifted1" in2="shifted2" result="glitched"/>
          <feComponentTransfer in="glitched">
            <feFuncR type="linear" slope="1.5"/>
            <feFuncG type="linear" slope="1.2"/>
            <feFuncB type="linear" slope="1.8"/>
          </feComponentTransfer>
        </filter>

        {/* Holographic/Rainbow Prism */}
        <filter id="hologram" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComponentTransfer in="blur" result="rainbow">
            <feFuncR type="discrete" tableValues="0 1 0 0 1 0"/>
            <feFuncG type="discrete" tableValues="0 0 1 0 1 0"/>
            <feFuncB type="discrete" tableValues="1 0 0 1 0 0"/>
          </feComponentTransfer>
          <feBlend mode="screen" in="rainbow" in2="SourceGraphic"/>
        </filter>

        {/* Heat Distortion */}
        <filter id="heat-distort" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="1" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
          <feGaussianBlur in="displaced" stdDeviation="1"/>
        </filter>

        {/* Water Ripple */}
        <filter id="water-ripple" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="turbulence" baseFrequency="0.02 0.06" numOctaves="2" result="waves"/>
          <feDisplacementMap in="SourceGraphic" in2="waves" scale="12" xChannelSelector="R" yChannelSelector="G" result="rippled"/>
          <feGaussianBlur in="rippled" stdDeviation="0.5"/>
        </filter>

        {/* Drop Shadow with Color - FIXED: camelCase attributes */}
        <filter id="color-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="3" dy="3" stdDeviation="4" floodColor="#ff00ff" floodOpacity="1" result="shadow1"/>
          <feDropShadow dx="-3" dy="-3" stdDeviation="4" floodColor="#00ffff" floodOpacity="1" result="shadow2"/>
          <feMerge>
            <feMergeNode in="shadow1"/>
            <feMergeNode in="shadow2"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Soft Glow */}
        <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feComponentTransfer in="blur">
            <feFuncA type="linear" slope="0.6"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
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

        {/* Pulsing Glow (for animation) */}
        <filter id="pulse-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur">
            <animate attributeName="stdDeviation" values="3;10;3" dur="1s" repeatCount="indefinite"/>
          </feGaussianBlur>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export default SVGFilters;