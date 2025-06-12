// clients/src/components/Controls.js
import React from 'react';

function Controls({ moves }) {
  return (
    <div className="controls-container">
      <div className="moves-counter-group">
        <p className="moves-text">Moves: <span className="moves-count">{moves}</span></p>
      </div>
    </div>
  );
}

export default Controls;