// clients/src/components/PuzzleBoard.js
import React from 'react';
import './PuzzleBoard.css';

function PuzzleBoard({ puzzle, level, image, onTileClick }) {
    return (
        <div
            className="puzzle-board-container"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${level}, 1fr)`,
                gridTemplateRows: `repeat(${level}, 1fr)`,
                gap: '0px', 
            }}
        >
            {puzzle.map((tileValue, index) => {
                const originalRow = Math.floor(tileValue / level);
                const originalCol = tileValue % level;
                const isEmptyTile = tileValue === level * level - 1; 

                return (
                    <div
                        key={index} 
                        className={`puzzle-tile ${isEmptyTile ? 'empty-tile' : 'filled-tile'}`}
                        style={{
                            backgroundImage: isEmptyTile ? 'none' : `url(${image})`,
                            backgroundSize: `${level * 100}% ${level * 100}%`, 
                            backgroundPosition: `${(originalCol * 100) / (level - 1)}% ${(originalRow * 100) / (level - 1)}%`,
                        }}
                        onClick={() => onTileClick(index)}
                    >
                        {!isEmptyTile && (
                            <span className="tile-number">
                                {tileValue + 1} 
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default PuzzleBoard;