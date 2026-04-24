import React from 'react';

const SVGFilters = () => {
  return (
    <svg style={{ position: 'absolute', height: 0, width: 0 }} aria-hidden="true">
      <defs>
       
               {/* H2L2GRAM */}
<filter id="h2l2gram" x="-30%" y="-30%" width="160%" height="160%">
  <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
  <feGaussianBlur in="displaced" stdDeviation="1" result="blurred"/>
  
  <feComponentTransfer in="blurred" result="step1">
<feFuncR type="table" tableValues="1 0 0 1 0 1 1 1 1"/>
<feFuncG type="table" tableValues="0 1 0 0 0 1 0 0 1"/>
<feFuncB type="table" tableValues="0 1 1 0 1 0 0 0 1"/>
</feComponentTransfer>
<feColorMatrix type="saturate" values="8" in="step1" result="rainbow"/>
  
  <feBlend mode="screen" in="rainbow" in2="SourceGraphic"/>
</filter>


{/* EXPANDDDDDD */}
        <filter id="expandDeformIntense" x="-50%" y="-50%" width="200%" height="200%">

           <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.035" 
            numOctaves="4" 
            result="noise"
            seed="3"
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="35" 
            xChannelSelector="R" 
            yChannelSelector="G" 
            result="displaced"
          />
            <feGaussianBlur in="displaced" stdDeviation="1" result="blurred"/>
            <feComponentTransfer in="blurred" result="step1">
        <feFuncR type="table" tableValues="1 0 0 1 0 1 1 1 1"/>
        <feFuncG type="table" tableValues="0 1 0 0 0 1 0 0 1"/>
        <feFuncB type="table" tableValues="0 1 1 0 1 0 0 0 1"/>
          </feComponentTransfer>
          <feColorMatrix type="saturate" values="8" in="step1" result="rainbow"/>

          <feBlend mode="screen" in="rainbow" in2="SourceGraphic"/>          
         
        </filter>


       {/* NIGHT H2L2GRAM */}
         <filter id="nighth2l2gram" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
          <feGaussianBlur in="displaced" stdDeviation="1" result="blurred"/>
   <feComponentTransfer in="blurred" result="step1">
<feFuncR type="table" tableValues="1 0 0 1 0 1"/>
          <feFuncG type="table" tableValues="0 1 0 1 0 0"/>
          <feFuncB type="table" tableValues="0 0 1 0 1 0"/>
</feComponentTransfer>
<feColorMatrix type="saturate" values="8" in="step1" result="rainbow"/>
          <feBlend mode="screen" in="rainbow" in2="SourceGraphic"/>
        </filter>    


        {/* Night EXPANDDD */}

         <filter id="NightExpandDeformIntense" x="-50%" y="-50%" width="200%" height="200%">

           <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.035" 
            numOctaves="4" 
            result="noise"
            seed="3"
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="35" 
            xChannelSelector="R" 
            yChannelSelector="G" 
            result="displaced"
          />
            <feGaussianBlur in="displaced" stdDeviation="1" result="blurred"/>
            <feComponentTransfer in="blurred" result="step1">
          <feFuncR type="table" tableValues="1 0 0 1 0 1"/>
          <feFuncG type="table" tableValues="0 1 0 1 0 0"/>
          <feFuncB type="table" tableValues="0 0 1 0 1 0"/>
          </feComponentTransfer>
          <feColorMatrix type="saturate" values="8" in="step1" result="rainbow"/>

          <feBlend mode="screen" in="rainbow" in2="SourceGraphic"/>          
         
        </filter>

   
        
      </defs>
    </svg>

       
  );
};

export default SVGFilters;



