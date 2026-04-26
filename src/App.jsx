// App.jsx - Updated version
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
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Day/Night detection with favicon swapping
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      const night = hour >= 20 || hour < 6;
      setIsNight(night);
      
      // Apply class to html element immediately
      if (night) {
        document.documentElement.classList.add('night-mode');
        document.documentElement.classList.remove('day-mode');
      } else {
        document.documentElement.classList.add('day-mode');
        document.documentElement.classList.remove('night-mode');
      }
      
      const favicon = document.getElementById('favicon');
      if (night) {
        if (favicon) favicon.href = '/faviconight.ico';
      } else {
        if (favicon) favicon.href = '/favicon.ico';
      }
      
      setIsInitialized(true);
    };

    checkTime();
    
    const interval = setInterval(checkTime, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Don't render anything until we know if it's day or night
  if (!isInitialized) {
    return null;
  }
  
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

  const downloadBothVersions = async (id) => {
    const emojiNumber = id.substring(1); // Remove 'c' prefix
    
    // Download both versions simultaneously
    await Promise.all([
      downloadOriginalVersion(emojiNumber),
      downloadEvilVersion(emojiNumber)
    ]);
  };

  const downloadOriginalVersion = (emojiNumber) => {
    return new Promise((resolve) => {
      // Choose folder based on day/night
      const folder = isNight ? '/nightmojis/' : '/emojis/';
      const svgPath = `${folder}jiji${emojiNumber}.svg`;
      
      console.log('Downloading original from:', svgPath);
      
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
          link.download = `jiji${emojiNumber}-${isNight ? 'night' : 'day'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve();
        }, 'image/png');
      };
      
      img.onerror = (error) => {
        console.error(`Failed to load original emoji: ${svgPath}`, error);
        resolve(); // Resolve anyway to not block the evil download
      };
    });
  };

  const downloadEvilVersion = (emojiNumber) => {
    return new Promise((resolve) => {
      // Choose evil folder based on day/night - these are PNG files
      const evilFolder = isNight ? '/evilnightmojis/' : '/evildaymojis/';
      const evilPath = `${evilFolder}evilji${emojiNumber}.png`;
      
      console.log('Downloading evil from:', evilPath);
      
      // Since it's a PNG, we can download it directly
      const link = document.createElement('a');
      link.href = evilPath;
      link.download = `evilji${emojiNumber}-${isNight ? 'evilnight' : 'evilday'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Small delay to ensure the download starts
      setTimeout(resolve, 100);
    });
  };
  
  return (
    <div className={`main-container ${isNight ? 'night-mode' : 'day-mode'}`}>
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
          isNight={isNight}  
        />
      )}
      
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
        isNight={isNight} 
      />
      
      <Contact />
    </div>
  );
}

export default App;