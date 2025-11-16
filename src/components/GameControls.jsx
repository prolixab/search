import React from 'react'
import './GameControls.css'

const GameControls = ({ 
  level,
  algorithm,
  gameState,
  onStart,
  onReset,
  timeElapsed
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="game-controls">
      <h2>Level {level}: {algorithm}</h2>
      
      <div className="control-buttons">
        <button
          onClick={onStart}
          disabled={gameState === 'in-progress' || gameState === 'completed'}
          className="btn btn-primary"
        >
          Start Level {level}
        </button>
        <button
          onClick={onReset}
          className="btn btn-secondary"
        >
          Reset
        </button>
      </div>

    </div>
  )
}

export default GameControls
