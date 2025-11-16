import React, { useState, useEffect } from 'react'
import './StepInput.css'

const StepInput = ({ 
  currentStep, 
  totalSteps, 
  algorithm, 
  onSubmit, 
  feedback,
  gameState,
  availableNodes,
  getHeuristic
}) => {
  const [currentNode, setCurrentNode] = useState('')
  const [queueInput, setQueueInput] = useState('')

  useEffect(() => {
    // Reset inputs when step changes
    setCurrentNode('')
    setQueueInput('')
  }, [currentStep])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (gameState !== 'in-progress') return

    const queueNodes = queueInput.split(',').map(n => n.trim()).filter(n => n)
    onSubmit(currentNode, queueNodes)
  }

  const handleQueueAdd = (node) => {
    const currentQueue = queueInput.split(',').map(n => n.trim()).filter(n => n)
    if (!currentQueue.includes(node)) {
      setQueueInput([...currentQueue, node].join(', '))
    }
  }

  const handleQueueRemove = (node) => {
    const currentQueue = queueInput.split(',').map(n => n.trim()).filter(n => n)
    setQueueInput(currentQueue.filter(n => n !== node).join(', '))
  }

  if (gameState === 'not-started') {
    return (
      <div className="step-input">
        <h2>Step Input</h2>
        <div className="waiting-message">
          <p>Please start the game to begin entering steps.</p>
        </div>
      </div>
    )
  }

  if (gameState === 'completed') {
    return (
      <div className="step-input">
        <h2>Step Input</h2>
        <div className="completed-message">
          <p>🎉 Game Completed!</p>
          <p>You've successfully completed all steps.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="step-input">
      <h2>Step {currentStep + 1} of {totalSteps}</h2>
      
      <form onSubmit={handleSubmit} className="step-form">
        <div className="input-group">
          <label htmlFor="currentNode">Current Node Being Visited:</label>
          <div className="node-selector">
            <input
              type="text"
              id="currentNode"
              value={currentNode}
              onChange={(e) => setCurrentNode(e.target.value.toUpperCase())}
              placeholder="Enter node (e.g., A)"
              className="node-input"
              maxLength="1"
              autoFocus
            />
            <div className="quick-select">
              {availableNodes.map(node => (
                <button
                  key={node}
                  type="button"
                  onClick={() => setCurrentNode(node)}
                  className={`quick-btn ${currentNode === node ? 'active' : ''}`}
                >
                  {node}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="queueInput">
            {algorithm === 'BFS' ? 'Queue' : 
             algorithm === 'DFS' ? 'Stack' : 
             'Priority Queue'} (comma-separated):
          </label>
          {(algorithm === 'Greedy' || algorithm === 'A*') && getHeuristic && (
            <div className="heuristic-info">
              <div className="heuristic-title">Heuristic Values (h):</div>
              <div className="heuristic-values">
                {availableNodes.map(node => (
                  <div key={node} className="heuristic-item">
                    <span className="heuristic-node">{node}:</span>
                    <span className="heuristic-value">h({node}) = {getHeuristic(node)}</span>
                  </div>
                ))}
              </div>
              <div className="heuristic-note">
                {algorithm === 'Greedy' 
                  ? 'Priority queue is sorted by heuristic value (distance to goal F, lowest first)'
                  : 'Priority queue is sorted by f(n) = g(n) + h(n), where g(n) is cost from start and h(n) is distance to goal F'}
              </div>
            </div>
          )}
          <input
            type="text"
            id="queueInput"
            value={queueInput}
            onChange={(e) => setQueueInput(e.target.value.toUpperCase())}
            placeholder="Enter nodes (e.g., B, C, D)"
            className="queue-input"
          />
          <div className="queue-helper">
            <div className="helper-label">Quick add/remove:</div>
            <div className="queue-buttons">
              {availableNodes.map(node => {
                const inQueue = queueInput.split(',').map(n => n.trim()).includes(node)
                return (
                  <button
                    key={node}
                    type="button"
                    onClick={() => inQueue ? handleQueueRemove(node) : handleQueueAdd(node)}
                    className={`queue-btn ${inQueue ? 'in-queue' : ''}`}
                  >
                    {node} {inQueue ? '✓' : '+'}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Submit Step
        </button>
      </form>

      {feedback && (
        <div className={`feedback ${feedback.includes('✓') ? 'success' : 'error'}`}>
          {feedback}
        </div>
      )}
    </div>
  )
}

export default StepInput

