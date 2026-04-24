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
    onDownload,
    isNight  // NEW: accept isNight prop
}) => {
    const currentScore = activeIds.size;
    const gameIsComplete = currentScore === totalEmojis;

    useEffect(() => { 
        if (gameIsComplete && onComplete) {
            onComplete();
        }
    }, [gameIsComplete, onComplete]);

    const getDisplayId = (id) => {
        return id?.startsWith('c') ? id.substring(1) : id;
    };

    return (
        <div className="score-container">
            {/* Mode icon on the left */}
            <div className="mode-icon">
                <img 
                    src={isNight ? '/nightcon.svg' : '/daycon.svg'} 
                    alt={isNight ? 'Night mode' : 'Day mode'}
                    className="mode-icon-svg"
                />
            </div>

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
                            ? `jiji${getDisplayId(selectedJiji.id)} selected,` 
                            : 'Choose a jiji to download'}
                    
                    {selectedJiji && (
                        <button 
                            className="download-button"
                            onClick={onDownload}
                        >
                            Download ⟨evil⟩jiji
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