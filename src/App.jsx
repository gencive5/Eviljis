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
      downloadSVGAsPNG(selectedJiji.svgPath, selectedJiji.id);
      setDownloadedJiji(selectedJiji.id);
      setSelectedJiji(null);
    }
  };

  const downloadSVGAsPNG = (svgPath, id) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = svgPath;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size (you can adjust this for higher resolution)
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, size, size);
      
      // Convert to PNG and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `jiji-${id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
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