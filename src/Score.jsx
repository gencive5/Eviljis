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
    isNight  // NEW: accept isNight prop
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

    // Render download content (reused in both layouts)
    const renderDownloadContent = () => {
        if (isComplete && !downloadedJiji) {
            return (
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
            );
        }
        
        if (downloadedJiji) {
            return (
                <div className="download-complete">
                    <p>✓ Jiji downloaded! ✓</p>
                </div>
            );
        }
        
        return null;
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
                        {renderDownloadContent()}
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

    // Mobile layout: two rows
    return (
        <div className="score-container mobile">
            {/* Row 1: Icon left, Score right */}
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
            </div>
            
            {/* Row 2: Download prompt */}
            {renderDownloadContent() && (
                <div className="mobile-row-2">
                    {renderDownloadContent()}
                </div>
            )}
        </div>
    );
};

export default Score;