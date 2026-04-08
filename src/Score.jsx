// components/Score.jsx
import React, { useEffect } from 'react'; // FIXED: Added useEffect import
import './App.css';

const Score = ({ 
    activeIds,
    totalEmojis = 164,
    onComplete,
    lingerMs = 30000
}) => {

    const currentScore = activeIds.size;
    const isComplete = currentScore === totalEmojis;

    useEffect(() => { 
        if (isComplete && onComplete) {
            onComplete();
        }
    }, [isComplete, onComplete]);

    return (
        <div className="score-container">
            {/* Score display */}
            <div className="score-display">
                <span className="score-label">Emojis Touched:</span>
                <span className="score-value">
                    {currentScore} / {totalEmojis}
                </span>
            </div>

            {/* Progress bar - Adding this back makes it nicer */}
            <div className="progress-bar-container">
                <div 
                    className="progress-bar-fill"
                    style={{ width: `${(currentScore / totalEmojis) * 100}%` }}
                />
            </div>

            {/* Completion message */}
            {isComplete && (
                <div className="completion-message">
                    🎉 PERFECT! You touched all 164 emojis! 🎉
                </div>
            )}
            
            {/* Show remaining count */}
            {!isComplete && (
                <div className="remaining-count">
                    {totalEmojis - currentScore} more to go!
                </div>
            )}
        </div>
    );
};

export default Score;