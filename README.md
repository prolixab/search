# BFS & DFS Quiz Game

A React-based interactive game to test students' knowledge of Breadth-First Search (BFS) and Depth-First Search (DFS) graph traversal algorithms.

## Features

- **Interactive Graph Visualization**: Visual representation of nodes and edges with color-coded states
- **Step-by-Step Input**: Students input the current node being visited and the queue/stack at each step
- **Real-time Feedback**: Immediate validation and feedback on student answers
- **Algorithm Selection**: Switch between BFS and DFS algorithms
- **Customizable Start Node**: Choose any node as the starting point
- **Answer History**: Track all submitted answers with correct/incorrect indicators

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## How to Play

1. **Select Algorithm**: Choose between BFS (Breadth-First Search) or DFS (Depth-First Search)
2. **Choose Start Node**: Select the starting node for the traversal
3. **Start Game**: Click "Start Game" to begin
4. **Enter Steps**: For each step:
   - Enter the current node being visited
   - Enter all nodes in the queue (BFS) or stack (DFS), separated by commas
   - Click "Submit Step"
5. **Get Feedback**: Receive immediate feedback on whether your answer is correct
6. **Complete**: Continue until all nodes are visited

## Project Structure

```
src/
├── components/
│   ├── GraphVisualization.jsx    # Graph display component
│   ├── GameControls.jsx           # Algorithm and start node selection
│   └── StepInput.jsx              # Step input form
├── App.jsx                        # Main application component
├── App.css                        # Application styles
├── index.css                      # Global styles
└── main.jsx                       # Entry point
```

## Technologies Used

- React 18
- Vite (build tool)
- CSS3 (styling)

## License

MIT

