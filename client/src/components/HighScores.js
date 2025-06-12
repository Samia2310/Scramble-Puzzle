import React from 'react';
import './HighScores.css';

function HighScores({ highScores }) {
  const getOverallBestMoves = (levelKey) => {
    const levelData = highScores[levelKey]; 
    if (!levelData) {
      return 'N/A';
    }

    let minMoves = Infinity;
    let foundScore = false;
    for (const imageName in levelData) {
      if (levelData.hasOwnProperty(imageName) && levelData[imageName]?.moves > 0) {
        minMoves = Math.min(minMoves, levelData[imageName].moves);
        foundScore = true;
      }
    }
    return foundScore ? minMoves : 'N/A';
  };

  return (
    <div className="high-scores-container">
      <h2 className="high-scores-title">High Scores (Lowest Moves)</h2>
      <ul className="high-scores-list">
        <li className="high-scores-item">
          <span className="high-scores-level">Very Easy (2x2):</span>
          <span className="high-scores-moves">
            {getOverallBestMoves('veryEasy')}
          </span>
        </li>
        <li className="high-scores-item">
          <span className="high-scores-level">Easy (3x3):</span>
          <span className="high-scores-moves">
            {getOverallBestMoves('easy')}
          </span>
        </li>
        <li className="high-scores-item">
          <span className="high-scores-level">Medium (4x4):</span>
          <span className="high-scores-moves">
            {getOverallBestMoves('medium')}
          </span>
        </li>
        <li className="high-scores-item">
          <span className="high-scores-level">Hard (5x5):</span>
          <span className="high-scores-moves">
            {getOverallBestMoves('hard')}
          </span>
        </li>
      </ul>
    </div>
  );
}

export default HighScores;