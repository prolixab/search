import React from 'react'
import './GraphVisualization.css'

const GraphVisualization = ({ graph, currentStep, correctSequence, gameState }) => {
  const getNodeState = (nodeId) => {
    if (gameState === 'not-started') return 'default'
    
    if (currentStep < correctSequence.length) {
      const step = correctSequence[currentStep]
      if (step.currentNode === nodeId) return 'current'
      if (step.visited.has(nodeId)) return 'visited'
      if (step.queue.includes(nodeId)) return 'in-queue'
    }
    
    return 'default'
  }

  return (
    <div className="graph-visualization">
      <h2>Graph Visualization</h2>
      <div className="graph-legend">
        <div className="legend-item">
          <span className="legend-color default"></span>
          <span>Unvisited</span>
        </div>
        <div className="legend-item">
          <span className="legend-color current"></span>
          <span>Current Node</span>
        </div>
        <div className="legend-item">
          <span className="legend-color in-queue"></span>
          <span>In Queue</span>
        </div>
        <div className="legend-item">
          <span className="legend-color visited"></span>
          <span>Visited</span>
        </div>
      </div>
      
      <svg className="graph-svg" viewBox="0 0 500 300">
        {/* Draw edges */}
        {graph.edges.map((edge, idx) => {
          const fromNode = graph.nodes.find(n => n.id === edge.from)
          const toNode = graph.nodes.find(n => n.id === edge.to)
          
          if (!fromNode || !toNode) return null
          
          return (
            <line
              key={idx}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              className="edge"
            />
          )
        })}
        
        {/* Draw nodes */}
        {graph.nodes.map((node) => {
          const state = getNodeState(node.id)
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="25"
                className={`node node-${state}`}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="node-label"
              >
                {node.id}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default GraphVisualization

