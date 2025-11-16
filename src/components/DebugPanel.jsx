import React from 'react'
import './DebugPanel.css'

const DebugPanel = ({ 
  level, 
  setLevel, 
  currentStep, 
  setCurrentStep, 
  correctSequence,
  algorithm 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="debug-panel">
      <div className="debug-header">
        <h3>🐛 Debug Mode</h3>
      </div>
      
      <div className="debug-controls">
        <div className="debug-control-group">
          <label>Level:</label>
          <select 
            value={level} 
            onChange={(e) => setLevel(parseInt(e.target.value))}
            className="debug-select"
          >
            <option value={1}>Level 1: BFS</option>
            <option value={2}>Level 2: DFS</option>
            <option value={3}>Level 3: Greedy</option>
            <option value={4}>Level 4: A*</option>
          </select>
        </div>

        <div className="debug-control-group">
          <label>Step:</label>
          <div className="debug-step-controls">
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="debug-btn"
            >
              ← Prev
            </button>
            <span className="debug-step-info">
              {currentStep + 1} / {correctSequence.length}
            </span>
            <button 
              onClick={() => setCurrentStep(Math.min(correctSequence.length - 1, currentStep + 1))}
              disabled={currentStep >= correctSequence.length - 1}
              className="debug-btn"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {correctSequence.length > 0 && currentStep < correctSequence.length && (
        <div className="debug-answer">
          <h4>Correct Answer for Step {currentStep + 1}:</h4>
          <div className="debug-answer-details">
            <div className="debug-answer-item">
              <strong>Current Node:</strong> {correctSequence[currentStep].currentNode}
            </div>
            <div className="debug-answer-item">
              <strong>{algorithm === 'BFS' ? 'Queue' : algorithm === 'DFS' ? 'Stack' : 'Priority Queue'}:</strong> 
              [{correctSequence[currentStep].queue.join(', ') || 'empty'}]
            </div>
            <div className="debug-answer-item">
              <strong>Visited Nodes:</strong> 
              {Array.from(correctSequence[currentStep].visited).join(', ')}
            </div>
            {(algorithm === 'A*') && (
              <>
                <div className="debug-answer-item">
                  <strong>g(n) values:</strong> g(A)=0, g(B)=1, g(C)=1, g(D)=2, g(E)=2, g(F)=2, g(G)=2
                </div>
                <div className="debug-answer-item">
                  <strong>h(n) values:</strong> h(A)=2, h(B)=3, h(C)=1, h(D)=4, h(E)=4, h(F)=0, h(G)=2
                </div>
                <div className="debug-answer-item">
                  <strong>Note:</strong> f(n) = g(n) + h(n). Queue sorted by f(n) (lowest first).
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="debug-sequence">
        <h4>Full Sequence:</h4>
        <div className="debug-sequence-list">
          {correctSequence.map((step, idx) => (
            <div 
              key={idx} 
              className={`debug-sequence-item ${idx === currentStep ? 'active' : ''}`}
              onClick={() => setCurrentStep(idx)}
            >
              <div className="sequence-step">Step {idx + 1}</div>
              <div className="sequence-details">
                Node: {step.currentNode} | 
                {algorithm === 'BFS' ? 'Queue' : algorithm === 'DFS' ? 'Stack' : 'Queue'}: [{step.queue.join(', ') || 'empty'}]
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DebugPanel

