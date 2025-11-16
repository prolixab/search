import React, { useState, useEffect, useRef } from 'react'
import GraphVisualization from './components/GraphVisualization'
import GameControls from './components/GameControls'
import StepInput from './components/StepInput'
import SplashScreen from './components/SplashScreen'
import Countdown from './components/Countdown'
import DebugPanel from './components/DebugPanel'
import CongratulationsScreen from './components/CongratulationsScreen'
import './App.css'

// Tree structure with root at top
// Tree: Root A, children B and C, B has children D and E, C has children F and G
const defaultGraph = {
  root: 'A',
  nodes: [
    { id: 'A', x: 250, y: 50 },   // Root at top
    { id: 'B', x: 150, y: 150 },  // Level 1 left
    { id: 'C', x: 350, y: 150 },  // Level 1 right
    { id: 'D', x: 100, y: 250 },  // Level 2
    { id: 'E', x: 200, y: 250 },  // Level 2
    { id: 'F', x: 300, y: 250 },  // Level 2
    { id: 'G', x: 400, y: 250 },  // Level 2
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'F' },
    { from: 'C', to: 'G' },
  ],
  // Tree adjacency (parent-child relationships)
  adjacencyList: {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F', 'G'],
    'D': ['B'],
    'E': ['B'],
    'F': ['C'],
    'G': ['C'],
  }
}

function App() {
  // Check if debug mode is enabled via URL
  const isDebugMode = window.location.pathname.includes('/debug')
  
  const [showSplash, setShowSplash] = useState(!isDebugMode) // Skip splash in debug mode
  const [showCountdown, setShowCountdown] = useState(false)
  const [level, setLevel] = useState(1) // Level 1: Greedy, Level 2: BFS, Level 3: DFS, Level 4: A*
  const [currentStep, setCurrentStep] = useState(0)
  const [gameState, setGameState] = useState(isDebugMode ? 'in-progress' : 'not-started') // Start in progress in debug mode
  const [correctSequence, setCorrectSequence] = useState([])
  const [studentAnswers, setStudentAnswers] = useState([])
  const [feedback, setFeedback] = useState('')
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [totalTime, setTotalTime] = useState(0) // Cumulative time across all levels
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const audioRef = useRef(null)

  // Music control effect
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = 0.3 // Set volume to 30%
    }

    const audio = audioRef.current

    // Play music when game is in progress and not showing countdown
    if (gameState === 'in-progress' && !showCountdown) {
      audio.play().catch(err => {
        console.log('Audio play failed:', err)
        // Some browsers require user interaction before playing audio
      })
    } else {
      // Stop music when countdown is showing or game is not in progress
      audio.pause()
      audio.currentTime = 0 // Reset to beginning
    }

    // Cleanup on unmount
    return () => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [gameState, showCountdown])

  // Calculate shortest path distance from a node to goal (F) in the tree
  const calculateDistanceToGoal = (startNode, goalNode, adjList) => {
    if (startNode === goalNode) return 0
    
    const visited = new Set()
    const queue = [{ node: startNode, distance: 0 }]
    
    while (queue.length > 0) {
      const { node, distance } = queue.shift()
      
      if (node === goalNode) {
        return distance
      }
      
      if (visited.has(node)) continue
      visited.add(node)
      
      const neighbors = adjList[node] || []
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push({ node: neighbor, distance: distance + 1 })
        }
      }
    }
    
    return Infinity // Goal not reachable
  }

  // Heuristic function: distance to goal (F) for both Greedy and A*
  const getHeuristic = (node, algorithm = 'Greedy') => {
    // Both Greedy and A* use distance to goal F as heuristic
    // This is an admissible heuristic (never overestimates)
    return calculateDistanceToGoal(node, 'F', defaultGraph.adjacencyList)
  }

  // Calculate correct sequence when level changes
  useEffect(() => {
    if (gameState === 'not-started' || isDebugMode) {
      let algorithm = 'BFS'
      let sequence = []
      
      if (level === 1) {
        algorithm = 'BFS'
        sequence = calculateBFS(defaultGraph.adjacencyList, defaultGraph.root)
      } else if (level === 2) {
        algorithm = 'DFS'
        sequence = calculateDFS(defaultGraph.adjacencyList, defaultGraph.root)
      } else if (level === 3) {
        algorithm = 'Greedy'
        sequence = calculateGreedyBestFirst(defaultGraph.adjacencyList, defaultGraph.root)
      } else if (level === 4) {
        algorithm = 'A*'
        sequence = calculateAStar(defaultGraph.adjacencyList, defaultGraph.root)
      }
      
      setCorrectSequence(sequence)
      setStudentAnswers([])
      setCurrentStep(0)
      setFeedback('')
      setTimeElapsed(0)
      // Don't reset wrong answers or total time between levels - keep cumulative count
    }
  }, [level, gameState])

  // Timer effect
  useEffect(() => {
    let interval = null
    if (gameState === 'in-progress') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [gameState])

  const calculateBFS = (adjList, start) => {
    const visited = new Set()
    const queue = [start]
    const sequence = []
    
    while (queue.length > 0) {
      const current = queue.shift()
      if (visited.has(current)) continue
      
      visited.add(current)
      
      // Add unvisited neighbors to queue
      const neighbors = adjList[current] || []
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor)
        }
      }
      
      // Show queue state after processing current node and adding neighbors
      sequence.push({
        currentNode: current,
        queue: [...queue],
        visited: new Set(visited)
      })
    }
    
    return sequence
  }

  const calculateDFS = (adjList, start) => {
    const visited = new Set()
    const stack = [start]
    const sequence = []
    
    while (stack.length > 0) {
      const current = stack.pop()
      if (visited.has(current)) continue
      
      visited.add(current)
      
      // Add unvisited neighbors to stack (in reverse order for left-to-right traversal)
      const neighbors = adjList[current] || []
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i]
        if (!visited.has(neighbor) && !stack.includes(neighbor)) {
          stack.push(neighbor)
        }
      }
      
      // Show stack state after processing current node and adding neighbors
      // Display as array (top of stack is at the end)
      sequence.push({
        currentNode: current,
        queue: [...stack], // Stack shown as array (top is last element)
        visited: new Set(visited)
      })
    }
    
    return sequence
  }

  const calculateGreedyBestFirst = (adjList, start) => {
    const visited = new Set()
    const goal = 'F' // Goal node
    // Priority queue: array sorted by heuristic value (distance to goal F)
    const priorityQueue = [{ node: start, heuristic: getHeuristic(start, 'Greedy') }]
    const sequence = []
    
    while (priorityQueue.length > 0) {
      // Sort by heuristic (lowest first) and take first element
      priorityQueue.sort((a, b) => a.heuristic - b.heuristic)
      const { node: current } = priorityQueue.shift()
      
      if (visited.has(current)) continue
      
      visited.add(current)
      
      // Stop if we've reached the goal (check before adding neighbors)
      if (current === goal) {
        // Show final step with goal reached
        sequence.push({
          currentNode: current,
          queue: [],
          visited: new Set(visited)
        })
        break
      }
      
      // Add unvisited neighbors to priority queue
      const neighbors = adjList[current] || []
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !priorityQueue.find(item => item.node === neighbor)) {
          priorityQueue.push({ node: neighbor, heuristic: getHeuristic(neighbor, 'Greedy') })
        }
      }
      
      // Show priority queue state after adding neighbors (sorted by heuristic)
      priorityQueue.sort((a, b) => a.heuristic - b.heuristic)
      const queueNodes = priorityQueue.map(item => item.node)
      sequence.push({
        currentNode: current,
        queue: queueNodes,
        visited: new Set(visited)
      })
    }
    
    return sequence
  }

  const calculateAStar = (adjList, start) => {
    const visited = new Set()
    const goal = 'F' // Goal node
    // Priority queue: array with f(n) = g(n) + h(n)
    const gCost = { [start]: 0 } // g(n) = actual cost from start
    const priorityQueue = [{ 
      node: start, 
      f: gCost[start] + getHeuristic(start, 'A*') 
    }]
    const sequence = []
    
    while (priorityQueue.length > 0) {
      // Sort by f(n) (lowest first) and take first element
      priorityQueue.sort((a, b) => a.f - b.f)
      const { node: current } = priorityQueue.shift()
      
      if (visited.has(current)) continue
      
      visited.add(current)
      
      // Stop if we've reached the goal
      if (current === goal) {
        sequence.push({
          currentNode: current,
          queue: [],
          visited: new Set(visited)
        })
        break
      }
      
      // Add unvisited neighbors to priority queue
      const neighbors = adjList[current] || []
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          // Calculate g(n) = actual cost from start (path length)
          const newGCost = gCost[current] + 1
          if (!gCost[neighbor] || newGCost < gCost[neighbor]) {
            gCost[neighbor] = newGCost
            // h(n) = heuristic estimate to goal F
            const h = getHeuristic(neighbor, 'A*')
            // f(n) = g(n) + h(n)
            const f = newGCost + h
            
            // Remove if already in queue
            const existingIndex = priorityQueue.findIndex(item => item.node === neighbor)
            if (existingIndex !== -1) {
              priorityQueue.splice(existingIndex, 1)
            }
            
            priorityQueue.push({ node: neighbor, f: f })
          }
        }
      }
      
      // Show priority queue state after adding neighbors (sorted by f(n))
      priorityQueue.sort((a, b) => a.f - b.f)
      const queueNodes = priorityQueue.map(item => item.node)
      sequence.push({
        currentNode: current,
        queue: queueNodes,
        visited: new Set(visited)
      })
    }
    
    return sequence
  }

  const handleSplashStart = () => {
    setShowSplash(false)
    setShowCountdown(true)
    setWrongAnswers(0) // Reset wrong answers when starting game
    setTotalTime(0) // Reset total time when starting new game
  }

  const handleCountdownComplete = () => {
    setShowCountdown(false)
    setGameState('in-progress')
    setCurrentStep(0)
    setStudentAnswers([])
    setFeedback('')
    setTimeElapsed(0)
  }

  const handleStartGame = () => {
    setShowCountdown(true)
  }

  const handleReset = () => {
    setGameState('not-started')
    setCurrentStep(0)
    setStudentAnswers([])
    setFeedback('')
    setTimeElapsed(0)
    setTotalTime(0)
    setWrongAnswers(0)
  }

  const handleLevelComplete = () => {
    if (level < 4) {
      // Add current level time to total before moving to next level
      setTotalTime(prev => prev + timeElapsed)
      // Move to next level
      setLevel(level + 1)
      setGameState('not-started')
      setCurrentStep(0)
      setStudentAnswers([])
      setFeedback('')
      setTimeElapsed(0)
      // Show countdown for next level
      setTimeout(() => {
        setShowCountdown(true)
      }, 500)
    } else {
      // Game completed - add final level time to total
      setTotalTime(prev => prev + timeElapsed)
      setGameState('completed')
    }
  }

  const handleSubmitStep = (currentNode, queueNodes) => {
    if (currentStep >= correctSequence.length) {
      setFeedback('Game completed!')
      return
    }

    const correct = correctSequence[currentStep]
    const studentQueue = queueNodes.map(n => n.trim().toUpperCase()).filter(n => n)
    const correctQueue = correct.queue.map(n => n.toUpperCase())
    
    // Determine current algorithm based on level
    let currentAlgorithm = 'BFS'
    if (level === 1) currentAlgorithm = 'BFS'
    else if (level === 2) currentAlgorithm = 'DFS'
    else if (level === 3) currentAlgorithm = 'Greedy'
    else if (level === 4) currentAlgorithm = 'A*'

    // Check if current node is correct
    const currentNodeCorrect = currentNode.trim().toUpperCase() === correct.currentNode.toUpperCase()
    
    // Check if queue/stack matches
    // For BFS and DFS: order is critical
    // For Greedy and A*: order matters but we can be slightly more lenient
    const queueExactMatch = JSON.stringify(studentQueue) === JSON.stringify(correctQueue)
    const queueSetMatch = JSON.stringify([...studentQueue].sort()) === JSON.stringify([...correctQueue].sort())
    
    let queueCorrect = false
    let orderFeedback = ''
    
    if (queueExactMatch) {
      queueCorrect = true
    } else if (queueSetMatch && (currentAlgorithm === 'Greedy' || currentAlgorithm === 'A*')) {
      // For Greedy and A*, accept if nodes match (order should be correct but be lenient)
      queueCorrect = true
    } else if (queueSetMatch && (currentAlgorithm === 'BFS' || currentAlgorithm === 'DFS')) {
      // For BFS and DFS, nodes are correct but order is wrong
      queueCorrect = false
      orderFeedback = ` The nodes are correct, but the order is wrong.`
    } else {
      queueCorrect = false
    }

    const isCorrect = currentNodeCorrect && queueCorrect

    const newAnswer = {
      step: currentStep,
      studentCurrentNode: currentNode.trim().toUpperCase(),
      studentQueue: studentQueue,
      correctCurrentNode: correct.currentNode,
      correctQueue: correctQueue,
      isCorrect: isCorrect
    }

    setStudentAnswers([...studentAnswers, newAnswer])
    
    if (isCorrect) {
      setFeedback(`✓ Correct! Moving to next step...`)
      setTimeout(() => {
        if (currentStep + 1 < correctSequence.length) {
          setCurrentStep(currentStep + 1)
          setFeedback('')
        } else {
          // Level completed
          if (level < 4) {
            const algorithmNames = { 1: 'BFS', 2: 'DFS', 3: 'Greedy Best First', 4: 'A*' }
            const nextLevel = level + 1
            setFeedback(`🎉 Level ${level} (${algorithmNames[level]}) Completed! Moving to Level ${nextLevel} (${algorithmNames[nextLevel]})...`)
            setTimeout(() => {
              handleLevelComplete()
            }, 2000)
          } else {
            // Add final level time to total
            setTotalTime(prev => prev + timeElapsed)
            setGameState('completed')
            setFeedback(`🎉 Congratulations! You completed all 4 levels!`)
          }
        }
      }, 1500)
    } else {
      setWrongAnswers(prev => prev + 1)
      if (orderFeedback) {
        setFeedback(`✗ Incorrect.${orderFeedback}`)
      } else {
        setFeedback(`✗ Incorrect. Try again!`)
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getAlgorithm = () => {
    if (level === 1) return 'BFS'
    if (level === 2) return 'DFS'
    if (level === 3) return 'Greedy'
    if (level === 4) return 'A*'
    return 'BFS'
  }
  
  const algorithm = getAlgorithm()

  // Show splash screen (skip in debug mode)
  if (showSplash && !isDebugMode) {
    return <SplashScreen onStart={handleSplashStart} />
  }

  // Show countdown (skip in debug mode)
  if (showCountdown && !isDebugMode) {
    return <Countdown key={`${level}-${showCountdown}`} onComplete={handleCountdownComplete} level={level} algorithm={algorithm} />
  }

  // Show congratulations screen when game is completed
  if (gameState === 'completed' && !isDebugMode) {
    return (
      <CongratulationsScreen
        totalTime={totalTime}
        wrongAnswers={wrongAnswers}
        onRestart={() => {
          setLevel(1)
          setGameState('not-started')
          setCurrentStep(0)
          setStudentAnswers([])
          setFeedback('')
          setTimeElapsed(0)
          setTotalTime(0)
          setWrongAnswers(0)
          setShowSplash(true)
        }}
      />
    )
  }

  // Show main game
  return (
    <div className="app">
      <header className="app-header">
        <h1>BFS & DFS Quiz Game</h1>
        <div className="header-info">
          <div className="level-badge">Level {level}: {algorithm}</div>
          {gameState === 'in-progress' && (
            <>
              <div className="timer">Time: {formatTime(timeElapsed)}</div>
              <div className="wrong-answers">Wrong Answers: {wrongAnswers}</div>
            </>
          )}
        </div>
      </header>

      {isDebugMode && (
        <div className="debug-panel-container">
          <DebugPanel
            level={level}
            setLevel={setLevel}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            correctSequence={correctSequence}
            algorithm={algorithm}
          />
        </div>
      )}

      <div className="game-container">
        <div className="left-panel">
          <GraphVisualization 
            graph={defaultGraph}
            currentStep={currentStep}
            correctSequence={correctSequence}
            gameState={gameState}
          />
          
          <GameControls
            level={level}
            algorithm={algorithm}
            gameState={gameState}
            onStart={handleStartGame}
            onReset={handleReset}
            timeElapsed={timeElapsed}
          />
        </div>

        <div className="right-panel">
          <StepInput
            currentStep={currentStep}
            totalSteps={correctSequence.length}
            algorithm={algorithm}
            onSubmit={handleSubmitStep}
            feedback={feedback}
            gameState={gameState}
            availableNodes={defaultGraph.nodes.map(n => n.id)}
            getHeuristic={algorithm === 'Greedy' || algorithm === 'A*' ? (node) => getHeuristic(node, algorithm) : null}
          />

          {studentAnswers.length > 0 && (
            <div className="answer-history">
              <h3>Answer History</h3>
              <div className="history-list">
                {[...studentAnswers].reverse().map((answer, idx) => (
                  <div key={studentAnswers.length - 1 - idx} className={`history-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="history-step">Step {answer.step + 1}</div>
                    <div className="history-details">
                      <div>Your Answer: Node = {answer.studentCurrentNode}, Queue = [{answer.studentQueue.join(', ')}]</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

