import React from 'react'
import AnimatedBackground from './AnimatedBackground'
import './SplashScreen.css'

const SplashScreen = ({ onStart }) => {
  return (
    <div className="splash-screen">
      <AnimatedBackground />
      <div className="splash-content">
        <h1 className="splash-title">BFS & DFS Quiz Game</h1>
        <p className="splash-subtitle">Test your knowledge of graph traversal algorithms</p>
        <div className="splash-description">
          <p>You will complete four levels:</p>
          <ul>
            <li><strong>Level 1:</strong> Breadth-First Search (BFS)</li>
            <li><strong>Level 2:</strong> Depth-First Search (DFS)</li>
            <li><strong>Level 3:</strong> Greedy Best-First Search</li>
            <li><strong>Level 4:</strong> A* (A-Star) Algorithm</li>
          </ul>
          <p className="splash-instructions">
            For each step, enter the current node being visited and the nodes in the queue/stack/priority queue.
          </p>
        </div>
        <button onClick={onStart} className="splash-button">
          Start Game
        </button>
      </div>
    </div>
  )
}

export default SplashScreen

