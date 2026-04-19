// App.jsx
import './App.css';
import { useState } from 'react';
import CircleGrid from './CircleGrid';
import Contact from './Contact';
import Score from './Score';
import Timer from './Timer';

function App() {
  const [touchedEmojis, setTouchedEmojis] = useState(new Set());
  const [totalCircles, setTotalCircles] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedJiji, setSelectedJiji] = useState(null);
  const [downloadedJiji, setDownloadedJiji] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  
  const handleGameComplete = () => {
    setGameComplete(true);
    setTimerActive(false); // Stop timer when game completes
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
    setTimerActive(false); // Reset timer state
  };

  const handleTimerStart = () => {
    setTimerActive(true);
  };

  const handleJijiSelect = (id, svgPath) => {
    if (!downloadedJiji) {
      setSelectedJiji({ id, svgPath });
    }
  };

  const handleJijiDownload = () => {
    if (selectedJiji && !downloadedJiji) {
      downloadBothVersions(selectedJiji.id);
      setDownloadedJiji(selectedJiji.id);
      setSelectedJiji(null);
    }
  };

  const downloadBothVersions = (id) => {
    // Extract the emoji number from the id (e.g., "c42" -> "42")
    const emojiNumber = id.substring(1);
    
    // Download original SVG as PNG
    downloadOriginalVersion(id, emojiNumber);
    
    // Small delay then download pre-made filtered PNG
    setTimeout(() => {
      downloadFilteredVersion(id, emojiNumber);
    }, 200);
  };

  const downloadOriginalVersion = (id, emojiNumber) => {
    // Create canvas from the original SVG
    const svgPath = `/emojis/jiji${emojiNumber}.svg`;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = svgPath;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 1024;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Circular clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 0, 0, size, size);
      ctx.restore();
      
      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `jiji-${id}-original.png`;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
  };

  const downloadFilteredVersion = (id, emojiNumber) => {
    // Direct download of pre-made filtered PNG
    const filteredPngPath = `/emojis-filtered/jiji${emojiNumber}-hologram.png`;
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = filteredPngPath;
    link.download = `jiji-${id}-hologram.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      
      {/* Timer Component */}
      <Timer 
        lingerMs={150000}
        isActive={timerActive}
        isComplete={gameComplete}
      />
      
      <CircleGrid 
        lingerMs={150000}
        isComplete={gameComplete}
        onScoreUpdate={handleScoreUpdate}
        onJijiSelect={handleJijiSelect}
        downloadedJiji={downloadedJiji}
        selectedJiji={selectedJiji}
        onTimerStart={handleTimerStart}
      />
      
      <Contact />
    </div>
  );
}

export default App;