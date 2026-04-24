// App.jsx
import './App.css';
import { useState, useEffect } from 'react';
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
  const [isNight, setIsNight] = useState(false);
  
  // Day/Night detection with favicon swapping
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      const night = hour >= 20 || hour < 6;
      setIsNight(night);
      
      // Change favicon based on time of day
      const favicon = document.getElementById('favicon');
      
      if (night) {
        if (favicon) favicon.href = '/faviconight.ico';
      } else {
        if (favicon) favicon.href = '/favicon.ico';
      }
    };

    checkTime();
    
    const interval = setInterval(checkTime, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleGameComplete = () => {
    setGameComplete(true);
    setTimerActive(false);
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
    setTimerActive(false);
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
    const emojiNumber = id.substring(1);
    
    downloadOriginalVersion(id, emojiNumber);
    
    setTimeout(() => {
      downloadFilteredVersion(id, emojiNumber);
    }, 200);
  };

  const downloadOriginalVersion = (id, emojiNumber) => {
    const folder = isNight ? '/nightmojis/' : '/emojis/';
    const svgPath = `${folder}jiji${emojiNumber}.svg`;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = svgPath;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 1024;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 0, 0, size, size);
      ctx.restore();
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `jiji-${id}-${isNight ? 'night' : 'original'}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
  };

  const downloadFilteredVersion = (id, emojiNumber) => {
    const filteredPngPath = `/emojis-filtered/jiji${emojiNumber}-hologram.png`;
    
    const link = document.createElement('a');
    link.href = filteredPngPath;
    link.download = `jiji-${id}-hologram.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className={`main-container ${isNight ? 'night-mode' : 'day-mode'}`}>
      {/* Top bar with icon and score */}
      <div className="top-bar">
        <div className="mode-icon">
          <img 
            src={isNight ? '/nightcon.svg' : '/daycon.svg'} 
            alt={isNight ? 'Night mode' : 'Day mode'}
            className="mode-icon-svg"
          />
        </div>
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
      </div>
      
      <Timer 
        activeIds={touchedEmojis}
        lingerMs={150000}
        isComplete={gameComplete}
        currentScore={touchedEmojis.size}
        totalEmojis={totalCircles}
      />
      
      <CircleGrid 
        lingerMs={150000}
        isComplete={gameComplete}
        onScoreUpdate={handleScoreUpdate}
        onJijiSelect={handleJijiSelect}
        downloadedJiji={downloadedJiji}
        selectedJiji={selectedJiji}
        onTimerStart={handleTimerStart}
        svgFolder={isNight ? '/nightmojis/' : '/emojis/'}
      />
      
      <Contact />
    </div>
  );
}

export default App;