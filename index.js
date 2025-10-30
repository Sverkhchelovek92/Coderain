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

// stream class
class Stream {
  constructor(x) {
    this.x = x
    this.reset()
  }

  reset() {
    this.length = Math.floor(10 + Math.random() * 20)
    this.y = Math.random() * -canvas.height
    this.trail = []
    this.speed = 80 + Math.random() * 100
  }

  step() {
    // add new char to the top
    this.trail.unshift({ char: randomChar(), alpha: 1.0 })

    // regulate transparency of old chars
    for (const item of this.trail) item.alpha *= 0.85

    // delete old chars
    if (this.trail.length > this.length) this.trail.pop()

    this.y += fontSize

    if (this.y > canvas.height + this.length * fontSize) {
      this.x = Math.random() * canvas.width
      this.reset()
    }
  }

  draw() {
    for (let i = 0; i < this.trail.length; i++) {
      const item = this.trail[i]
      const y = this.y - i * fontSize

      if (y < -fontSize || y > canvas.height) continue

      if (i === 0) {
        // steam head
        ctx.fillStyle = '#ccffcc'
        ctx.shadowColor = '#aaffaa'
        ctx.shadowBlur = 12
        ctx.fillText(item.char, this.x, y)
        ctx.shadowBlur = 0
      } else {
        // steam trail
        ctx.fillStyle = `rgba(0, 255, 0, ${item.alpha.toFixed(2)})`
        ctx.fillText(item.char, this.x, y)
      }
    }
  }
}

const streamCount = Math.floor(window.innerWidth / 30)
let streams = Array.from(
  { length: streamCount },
  () => new Stream(Math.random() * canvas.width)
)

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (const stream of streams) {
    stream.step()
    stream.draw()
  }

  setTimeout(() => requestAnimationFrame(draw), speed)
}

draw()
