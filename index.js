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
  ctx.fillStyle = 'black'
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
    ctx.fillStyle = `rgba(0, 255, 0, ${item.alpha.toFixed(2)})`
    ctx.fillText(item.char, columnX, y)
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
