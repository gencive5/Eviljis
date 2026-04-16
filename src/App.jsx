// App.jsx
import './App.css';
import { useState } from 'react';
import CircleGrid from './CircleGrid';
import Contact from './Contact';
import Score from './Score';

function App() {
  const [touchedEmojis, setTouchedEmojis] = useState(new Set());
  const [totalCircles, setTotalCircles] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedJiji, setSelectedJiji] = useState(null);
  const [downloadedJiji, setDownloadedJiji] = useState(null);
  
  const handleGameComplete = () => {
    setGameComplete(true);
  };
  
  const handleScoreUpdate = (scoreData) => {
    if (!gameComplete && scoreData.totalCircles > 0) {
      setTouchedEmojis(scoreData.activeIds);
      setTotalCircles(scoreData.totalCircles);
    }
  };
  
  const handleReset = () => {
    setTouchedEmojis(new Set());
    setGameComplete(false);
    setTotalCircles(0);
    setSelectedJiji(null);
    setDownloadedJiji(null);
  };

  const handleJijiSelect = (id, svgPath) => {
    if (!downloadedJiji) {
      setSelectedJiji({ id, svgPath });
    }
  };

  const handleJijiDownload = () => {
    if (selectedJiji && !downloadedJiji) {
      downloadBothVersions(selectedJiji.svgPath, selectedJiji.id);
      setDownloadedJiji(selectedJiji.id);
      setSelectedJiji(null);
    }
  };

  const downloadBothVersions = (svgPath, id) => {
    const size = 1024; // High resolution
    
    // Download original version
    downloadOriginalVersion(svgPath, id, size);
    
    // Small delay then download filtered version
    setTimeout(() => {
      downloadFilteredVersion(svgPath, id, size);
    }, 200);
  };

  const downloadOriginalVersion = (svgPath, id, size) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = svgPath;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Create circular clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      
      // Draw the image
      ctx.drawImage(img, 0, 0, size, size);
      ctx.restore();
      
      // Download original version
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `jiji-${id}-original.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
  };

  const downloadFilteredVersion = (svgPath, id, size) => {
    // Create SVG with the exact same hologram filter from your SVGFilters component
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <defs>
          <filter id="hologram" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.04 0.06" 
              numOctaves="3" 
              result="noise"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="8" 
              xChannelSelector="R" 
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="0.5" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="circle-clip">
            <circle cx="${size/2}" cy="${size/2}" r="${size/2}" />
          </clipPath>
        </defs>
        <g clip-path="url(#circle-clip)">
          <image 
            href="${svgPath}" 
            width="${size}" 
            height="${size}" 
            filter="url(#hologram)"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </svg>
    `;
    
    // Convert SVG string to blob and create image
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Draw the filtered SVG to canvas
      ctx.drawImage(img, 0, 0, size, size);
      
      // Download filtered version
      canvas.toBlob((blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `jiji-${id}-hologram.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }, 'image/png');
      
      // Clean up
      URL.revokeObjectURL(url);
    };
    
    img.onerror = () => {
      console.error('Failed to load filtered SVG');
      URL.revokeObjectURL(url);
    };
  };
  
  return (
    <div className="main-container">
      {totalCircles > 0 && (
        <Score 
          activeIds={touchedEmojis}
          totalEmojis={totalCircles}
          onComplete={handleGameComplete}
          onReset={handleReset}
          isComplete={gameComplete}
          selectedJiji={selectedJiji}
          downloadedJiji={downloadedJiji}
          onDownload={handleJijiDownload}
        />
      )}
      
      <CircleGrid 
        lingerMs={150000}
        isComplete={gameComplete}
        onScoreUpdate={handleScoreUpdate}
        onJijiSelect={handleJijiSelect}
        downloadedJiji={downloadedJiji}
        selectedJiji={selectedJiji} 
      />
      
      <Contact />
    </div>
  );
}

export default App;