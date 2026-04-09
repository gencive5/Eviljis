import './App.css';
import { useState } from 'react';
import CircleGrid from './CircleGrid';
import Contact from './Contact';
import Score from './Score';

function App() {
  const [touchedEmojis, setTouchedEmojis] = useState(new Set());
  const [totalCircles, setTotalCircles] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  
  const handleGameComplete = () => {
    setGameComplete(true);
    console.log(`🎉 GAME COMPLETE! All ${totalCircles} emojis touched! 🎉`);
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
  };
  
  return (
    <div className="main-container">
      {totalCircles > 0 && (  // Only show score when we have a valid total
        <Score 
          activeIds={touchedEmojis}
          totalEmojis={totalCircles}
          onComplete={handleGameComplete}
          onReset={handleReset}
        />
      )}
      
      <CircleGrid 
        lingerMs={90000}
        isComplete={gameComplete}
        onScoreUpdate={handleScoreUpdate}
      />
      
      <Contact />
    </div>
  );
}

export default App;