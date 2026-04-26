// App.jsx
import './App.css';
import { useState, useEffect } from 'react';
import CircleGrid from './CircleGrid';
import Contact from './Contact';
import Score from './Score';
import Timer from './Timer';
import JSZip from 'jszip';

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

  const handleJijiDownload = async () => {
    if (selectedJiji && !downloadedJiji) {
      await downloadBothVersionsAsZip(selectedJiji.id);
      setDownloadedJiji(selectedJiji.id);
      setSelectedJiji(null);
    }
  };

  const downloadBothVersionsAsZip = async (id) => {
    const emojiNumber = id.substring(1); // Remove 'c' prefix
    const zip = new JSZip();
    
    // Show downloading indicator in console (optional)
    console.log('Creating your Jiji duo pack...');
    
    try {
      // Get both emojis as blobs
      const originalBlob = await getOriginalEmojiBlob(emojiNumber);
      const evilBlob = await getEvilEmojiBlob(emojiNumber);
      
      // Add to zip with nice filenames
      zip.file(`jiji${emojiNumber}.png`, originalBlob);
      zip.file(`evilji${emojiNumber}.png`, evilBlob);
      
      // Generate and download the zip
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `jiji-duo-${emojiNumber}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Download complete!');
    } catch (error) {
      console.error('Failed to create duo pack:', error);
    }
  };

  const getOriginalEmojiBlob = (emojiNumber) => {
    return new Promise((resolve, reject) => {
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
          resolve(blob);
        }, 'image/png');
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load: ${svgPath}`));
      };
    });
  };

  const getEvilEmojiBlob = (emojiNumber) => {
    return new Promise((resolve, reject) => {
      const evilFolder = isNight ? '/evilnightmojis/' : '/evildaymojis/';
      const evilPath = `${evilFolder}evilji${emojiNumber}.png`;
      
      fetch(evilPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          resolve(blob);
        })
        .catch(error => {
          reject(new Error(`Failed to load evil emoji: ${evilPath}`));
        });
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