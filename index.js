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

let y = 0
let speed = 2

function draw() {
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  //Font
  ctx.fillStyle = '#0F0'
  ctx.font = `${fontSize}px monospace`

  //Random Symbol
  const char = symbols.charAt(Math.floor(Math.random() * symbols.length))

  const x = canvas.width / 2
  ctx.fillText(char, x, y)

  y += speed

  if (y > canvas.height) {
    y = 0
  }

  requestAnimationFrame(draw)
}

draw()
