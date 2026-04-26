// components/Score.jsx
import React, { useEffect, useState } from 'react';
import './App.css';

const Score = ({ 
    activeIds,
    totalEmojis,
    onComplete,
    isComplete,
    selectedJiji,
    downloadedJiji,
    onDownload,
    isNight  
}) => {
    const currentScore = activeIds.size;
    const gameIsComplete = currentScore === totalEmojis;
    
    // Mobile detection
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => { 
        if (gameIsComplete && onComplete) {
            onComplete();
        }
    }, [gameIsComplete, onComplete]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getDisplayId = (id) => {
        return id?.startsWith('c') ? id.substring(1) : id;
    };

    // Desktop layout: single row with icon left, download center/right, score right
    if (!isMobile) {
        return (
            <div className="score-container desktop">
                <div className="left-section">
                    <div className="mode-icon">
                        <img 
                            src={isNight ? '/nightcon.svg' : '/daycon.svg'} 
                            alt={isNight ? 'Night mode' : 'Day mode'}
                            className="mode-icon-svg"
                        />
                    </div>
                    <div className="desktop-download-wrapper">
                        {isComplete && !downloadedJiji && (
                            <div className="download-prompt">
                                <p className="download-message">
                                    {selectedJiji 
                                        ? `jiji${getDisplayId(selectedJiji.id)} selected,` 
                                        : 'Choose a jiji to download'}
                                </p>
                                {selectedJiji && (
                                    <button 
                                        className="download-button"
                                        onClick={onDownload}
                                    >
                                        Download ⟨evil⟩jiji
                                    </button>
                                )}
                            </div>
                        )}
                        {downloadedJiji && (
                            <div className="download-complete">
                                <p>Jiji downloaded!</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="score-display">
                    <span className="score-value">
                        {currentScore} / {totalEmojis}
                    </span>
                </div>
            </div>
        );
    }

    // Mobile layout: everything in a compact view
    // Mobile layout: everything in a compact view
return (
    <div className="score-container mobile">
        {/* Top row: Icon left, Score right */}
        <div className="mobile-row-1">
            <div className="mode-icon">
                <img 
                    src={isNight ? '/nightcon.svg' : '/daycon.svg'} 
                    alt={isNight ? 'Night mode' : 'Day mode'}
                    className="mode-icon-svg"
                />
            </div>
            <div className="score-display">
                <span className="score-value">
                    {currentScore} / {totalEmojis}
                </span>
            </div>
        </div>  {/* ← CLOSE mobile-row-1 HERE */}
        
        {/* Bottom row: Download content - NOW SEPARATE */}
        {isComplete && (
            <div className="mobile-row-2">
                {!downloadedJiji ? (
                    <div className="download-prompt">
                        <p className="download-message">
                            {selectedJiji 
                                ? `jiji${getDisplayId(selectedJiji.id)} selected,` 
                                : 'Choose a jiji to download'}
                        </p>
                        {selectedJiji && (
                            <button 
                                className="download-button"
                                onClick={onDownload}
                            >
                                Download ⟨evil⟩jiji
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="download-prompt download-complete-state">
                        <p className="download-message complete-message">
                            Jiji downloaded!
                        </p>
                        <button className="download-button invisible-button" disabled>
                        </button>
                    </div>
                )}
            </div>
        )}
    </div>
);
};

export default Score;