const canvas = document.getElementById('matrix')
const ctx = canvas.getContext('2d')

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

resizeCanvas()
window.addEventListener('resize', resizeCanvas)

const symbols =
  'アァイィウヴエェオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const trailLength = 25 // trail height
const speed = 100

ctx.textAlign = 'center'
ctx.textBaseline = 'top'

function randomChar() {
  return symbols.charAt(Math.floor(Math.random() * symbols.length))
}

// font
let currentFont = 'monospace'

// stream class
class Stream {
  constructor(x) {
    this.x = x
    this.reset()
  }

  reset() {
    this.fontSize = 12 + Math.random() * 16

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

    this.y += this.fontSize

    if (this.y > canvas.height + this.length * this.fontSize) {
      this.x = Math.random() * canvas.width
      this.reset()
    }
  }

  draw() {
    ctx.font = `${this.fontSize}px ${currentFont}`

    for (let i = 0; i < this.trail.length; i++) {
      const item = this.trail[i]
      const y = this.y - i * this.fontSize

      if (y < -this.fontSize || y > canvas.height) continue

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

// Settings Pop-up

const settingsBtn = document.getElementById('settings-btn')
const settingsPopup = document.getElementById('settings-popup')

settingsBtn.addEventListener('click', (event) => {
  event.stopPropagation()
  settingsPopup.classList.toggle('visible')
})

document.addEventListener('click', (event) => {
  const isClickInside =
    settingsPopup.contains(event.target) || settingsBtn.contains(event.target)
  if (!isClickInside) {
    settingsPopup.classList.remove('visible')
  }
})

const fontSelect = document.getElementById('font-select')

fontSelect.addEventListener('change', (event) => {
  currentFont = event.target.value
})
