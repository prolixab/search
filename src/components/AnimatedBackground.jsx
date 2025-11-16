import React, { useEffect, useRef } from 'react'
import './AnimatedBackground.css'

const AnimatedBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Node data
    const nodes = [
      { id: 'A', x: 0, y: 0, vx: 0.3, vy: 0.2, radius: 15 },
      { id: 'B', x: 0, y: 0, vx: -0.25, vy: 0.3, radius: 12 },
      { id: 'C', x: 0, y: 0, vx: 0.2, vy: -0.25, radius: 12 },
      { id: 'D', x: 0, y: 0, vx: -0.3, vy: -0.2, radius: 10 },
      { id: 'E', x: 0, y: 0, vx: 0.25, vy: 0.25, radius: 10 },
      { id: 'F', x: 0, y: 0, vx: -0.2, vy: 0.2, radius: 10 },
      { id: 'G', x: 0, y: 0, vx: 0.3, vy: -0.3, radius: 10 },
    ]

    // Initialize node positions
    nodes.forEach((node, i) => {
      node.x = (canvas.width / (nodes.length + 1)) * (i + 1)
      node.y = (canvas.height / (nodes.length + 1)) * (i + 1)
    })

    // Edges (connections between nodes)
    const edges = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
    ]

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update node positions
      nodes.forEach(node => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off walls
        if (node.x <= node.radius || node.x >= canvas.width - node.radius) {
          node.vx = -node.vx
        }
        if (node.y <= node.radius || node.y >= canvas.height - node.radius) {
          node.vy = -node.vy
        }

        // Keep nodes within bounds
        node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x))
        node.y = Math.max(node.radius, Math.min(canvas.height - node.radius, node.y))
      })

      // Draw edges
      ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)'
      ctx.lineWidth = 2
      edges.forEach(edge => {
        const from = nodes[edge.from]
        const to = nodes[edge.to]
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
      })

      // Draw nodes
      nodes.forEach(node => {
        // Node circle
        ctx.fillStyle = 'rgba(102, 126, 234, 0.4)'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()

        // Node border
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.6)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Node label
        ctx.fillStyle = 'rgba(102, 126, 234, 0.8)'
        ctx.font = 'bold 12px Roboto'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(node.id, node.x, node.y)
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="animated-background" />
}

export default AnimatedBackground

