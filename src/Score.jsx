// components/Score.jsx
import React, { useEffect } from 'react';
import './App.css';

const Score = ({ 
    activeIds,
    totalEmojis,
    onComplete,
    isComplete,
    selectedJiji,
    downloadedJiji,
    onDownload
}) => {
    const currentScore = activeIds.size;
    const gameIsComplete = currentScore === totalEmojis;

    useEffect(() => { 
        if (gameIsComplete && onComplete) {
            onComplete();
        }
    }, [gameIsComplete, onComplete]);

    return (
        <div className="score-container">
            {/* Score display */}
            <div className="score-display">
                <span className="score-value">
                    {currentScore} / {totalEmojis}
                </span>
            </div>

            {/* Download prompt */}
            {isComplete && !downloadedJiji && (
                <div className="download-prompt">
                    <p className="download-message">
                        {selectedJiji 
                            ? `Jiji ${selectedJiji.id} selected,` 
                            : 'Choose a jiji to download'}
                    
                    {selectedJiji && (
                        <button 
                            className="download-button"
                            onClick={onDownload}
                        >
                            Download jiji
                        </button>
                    )}
                    </p>
                </div>
            )}

            {downloadedJiji && (
                <div className="download-complete">
                    <p>✓ Jiji downloaded! ✓</p>
                </div>
            )}
        </div>
    );
};

export default Score;