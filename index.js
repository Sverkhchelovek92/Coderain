const canvas = document.getElementById('matrix')
const ctx = canvas.getContext('2d')

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

resizeCanvas()
window.addEventListener('resize', resizeCanvas)

const fontSize = 20
const symbols =
  'アァイィウヴエェオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const columnX = canvas.width / 2 // center column
const trailLength = 25 // trail height
const speed = 100

ctx.font = `${fontSize}px monospace`
ctx.textAlign = 'center'
ctx.textBaseline = 'top'

let trail = []
let headY = 0

function randomChar() {
  return symbols.charAt(Math.floor(Math.random() * symbols.length))
}

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Adding new char
  trail.unshift({ char: randomChar(), alpha: 1.0 })

  // Draw every char
  for (let i = 0; i < trail.length; i++) {
    const item = trail[i]
    const y = headY - i * fontSize

    // Ignore symbols out of the borders
    if (y < -fontSize) continue
    if (y > canvas.height) break

    // Trail style
    if (i === 0) {
      ctx.fillStyle = '#ccffcc'
      ctx.shadowColor = '#0f0'
      ctx.shadowBlur = 12 // glow effect
      ctx.fillText(item.char, columnX, y)
      ctx.shadowBlur = 0
    } else {
      // other symbols
      const brightness = Math.max(item.alpha, 0.1)
      ctx.fillStyle = `rgba(0, 255, 0, ${brightness})`
      ctx.fillText(item.char, columnX, y)
    }

    item.alpha *= 0.85
  }

  // Deleting old symbols
  trail = trail.filter((item) => item.alpha > 0.05)

  // Moving head
  headY += fontSize

  // Restart if at the bottom
  if (headY > canvas.height + fontSize * 2) {
    headY = 0
    trail = []
  }

  setTimeout(() => requestAnimationFrame(draw), speed)
}

draw()
