// components/Score.jsx
import React, { useEffect } from 'react'; // FIXED: Added useEffect import
import './App.css';

const Score = ({ 
    activeIds,
    totalEmojis,
    onComplete,
    lingerMs = 90000
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
                <span className="score-value">
                    {currentScore} / {totalEmojis}
                </span>
            </div>

        
        </div>
    );
};

export default Score;