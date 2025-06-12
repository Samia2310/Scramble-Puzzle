import React from 'react';
import './GameOverModal.css'; // Make sure you import its CSS

function GameOverModal({ image, moves, isNewHighScore, onPlayAgain, onNextLevel, onExitToHome, bestScore, onButtonClick }) {
    // Wrap original functions to include sound
    const handlePlayAgainClick = () => {
        onButtonClick();
        onPlayAgain();
    };

    const handleNextLevelClick = () => {
        onButtonClick();
        onNextLevel();
    };

    const handleExitToHomeClick = () => {
        onButtonClick();
        onExitToHome();
    };

    return (
        <div className="game-over-modal-overlay">
            <div className="game-over-modal-content">
                <h2 className="modal-title">
                    Congratulations!
                </h2>
                <p className="modal-text">You solved the puzzle!</p>

                <div className="modal-image-container">
                    <img src={image} alt="Solved Puzzle" className="modal-puzzle-image" />
                </div>

                <p className="modal-moves">Your Moves: {moves}</p>

                {isNewHighScore ? (
                    <p className="modal-new-highscore">⭐ New High Score! ⭐</p>
                ) : (
                    <p className="modal-old-highscore">
                        🏆High Score: {bestScore > 0 ? bestScore : 'N/A'}
                    </p>
                )}

                <div className="modal-actions">
                    <button
                        onClick={handleNextLevelClick} // Use wrapped function
                        className="modal-action-button next-level-button"
                    >
                        Next Level
                    </button>
                    <button
                        onClick={handlePlayAgainClick} // Use wrapped function
                        className="modal-action-button replay-button"
                    >
                        Play Again
                    </button>
                    <button
                        onClick={handleExitToHomeClick} // Use wrapped function
                        className="modal-action-button exit-button"
                    >
                        Exit to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GameOverModal;