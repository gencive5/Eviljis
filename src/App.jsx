import './App.css';
import { useState } from 'react'; // IMPORTANT: Add this import
import CircleGrid from './CircleGrid';
import Contact from './Contact';
import Score from './Score'; // Add this import

function App() {
  // State to track touched emojis
  const [touchedEmojis, setTouchedEmojis] = useState(new Set());
  
  // State to track if game is complete
  const [gameComplete, setGameComplete] = useState(false);
  
  // This function receives the activeIds from CircleGrid
  const handleScoreUpdate = (activeIds) => {
    setTouchedEmojis(activeIds);
  };
  
  // This function is called when all emojis are touched
  const handleGameComplete = () => {
    setGameComplete(true);
    console.log('🎉 GAME COMPLETE! All 164 emojis touched! 🎉');
  };
  
  // Optional: Reset function (if you want a "Play Again" button)
  const handleReset = () => {
    setTouchedEmojis(new Set());
    setGameComplete(false);
  };
  
  return (
    <div>
      {/* Add Score component at the top so it's always visible */}
      <Score 
        activeIds={touchedEmojis}
        totalEmojis={164}
        onComplete={handleGameComplete}
        onReset={handleReset} // Optional: pass this if you add reset button
      />
      
      {/* Pass game state to CircleGrid */}
      <CircleGrid 
        lingerMs={30000}      // 30 second delay normally
        isComplete={gameComplete}  // When true, no more delay
        onScoreUpdate={handleScoreUpdate}  // Gets updates when emojis are touched
      />
      
      <br />
      <Contact />
    </div>
  );
}

export default App;