import React from 'react'
import './CongratulationsScreen.css'

const CongratulationsScreen = ({ totalTime, wrongAnswers, onRestart }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="congratulations-overlay">
      <div className="congratulations-content">
        <div className="congratulations-icon">🎉</div>
        <h1 className="congratulations-title">Congratulations!</h1>
        <p className="congratulations-subtitle">You've completed all 4 levels!</p>
        
        <div className="congratulations-stats">
          <div className="stat-item">
            <div className="stat-label">Total Time</div>
            <div className="stat-value">{formatTime(totalTime)}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Wrong Answers</div>
            <div className="stat-value">{wrongAnswers}</div>
          </div>
        </div>

        <button onClick={onRestart} className="congratulations-button">
          Play Again
        </button>
      </div>
    </div>
  )
}

export default CongratulationsScreen

