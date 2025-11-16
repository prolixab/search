import React, { useState, useEffect } from 'react'
import './Countdown.css'

const Countdown = ({ onComplete, level, algorithm }) => {
  const [count, setCount] = useState(3)

  useEffect(() => {
    // Start countdown when component mounts
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (count === 0) {
      const timer = setTimeout(() => {
        onComplete()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [count, onComplete])

  return (
    <div className="countdown-overlay">
      <div className="countdown-content">
        <div className="countdown-level">Level {level}: {algorithm}</div>
        {count > 0 ? (
          <div className="countdown-number">{count}</div>
        ) : (
          <div className="countdown-go">GO!</div>
        )}
      </div>
    </div>
  )
}

export default Countdown

