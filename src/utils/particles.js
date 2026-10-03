// 粒子墙（从 App.vue 的入场遮幕抽离，改为页面背景使用）
// 昼夜两套配色：夜晚用亮色，白天用深色，保证在各自底色上可见。

export const PARTICLE_PALETTES = {
  dark: {
    colors: ['#8b5cf6', '#a78bfa', '#60a5fa', '#22d3ee', '#c4b5fd', '#818cf8'],
    lineRgb: '139, 92, 246',
    baseOpacity: 0.15,
    opacityRange: 0.35
  },
  light: {
    colors: ['#6366f1', '#3b82f6', '#7c3aed', '#0891b2', '#4338ca', '#4f46e5'],
    lineRgb: '99, 102, 241',
    baseOpacity: 0.12,
    opacityRange: 0.22
  }
}

export function initParticles(canvas, palette = PARTICLE_PALETTES.dark) {
  const colors = palette.colors
  const lineRgb = palette.lineRgb
  const baseOpacity = palette.baseOpacity ?? 0.15
  const opacityRange = palette.opacityRange ?? 0.35

  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  function resize() {
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    ctx.scale(dpr, dpr)
  }
  resize()

  const isMobile = window.innerWidth < 768
  const particleCount = isMobile ? 45 : 100
  const particles = []
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6 - 0.06,
      size: 1.5 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: baseOpacity + Math.random() * opacityRange
    })
  }
  const CONNECTION_DIST = isMobile ? 0 : 110
  const MOUSE_RADIUS = 130

  let mouseX = -9999
  let mouseY = -9999
  let burstActive = false
  let burstProgress = 0
  let animId = null
  let destroyed = false

  function onMouseMove(e) {
    mouseX = e.clientX
    mouseY = e.clientY
  }
  function onResize() {
    resize()
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)

  function burst(cx, cy) {
    burstActive = true
    burstProgress = 0
    for (const p of particles) {
      const dx = p.x - cx
      const dy = p.y - cy
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const force = 4 + Math.random() * 6
      p.vx += (dx / dist) * force
      p.vy += (dy / dist) * force
    }
  }

  function loop() {
    if (destroyed) return
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    if (burstActive) {
      burstProgress += 0.02
      if (burstProgress >= 1) burstActive = false
    }

    if (!isMobile && !destroyed) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            const mx1 = particles[i].x - mouseX
            const my1 = particles[i].y - mouseY
            const mx2 = particles[j].x - mouseX
            const my2 = particles[j].y - mouseY
            const nearMouse =
              Math.min(Math.sqrt(mx1 * mx1 + my1 * my1), Math.sqrt(mx2 * mx2 + my2 * my2)) < MOUSE_RADIUS

            if (!nearMouse) {
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              const alpha = (1 - dist / CONNECTION_DIST) * 0.18
              ctx.strokeStyle = `rgba(${lineRgb}, ${alpha})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }
    }

    for (const p of particles) {
      const dx = p.x - mouseX
      const dy = p.y - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (1 - dist / MOUSE_RADIUS) * 1.2
        p.vx += (dx / dist) * force
        p.vy += (dy / dist) * force
      }

      p.x += p.vx
      p.y += p.vy

      if (!burstActive) {
        p.vx *= 0.995
        p.vy *= 0.995
      }

      if (p.x < -20) p.x = canvas.width / dpr + 20
      if (p.x > canvas.width / dpr + 20) p.x = -20
      if (p.y < -20) p.y = canvas.height / dpr + 20
      if (p.y > canvas.height / dpr + 20) p.y = -20

      if (!burstActive) {
        p.vx += (Math.random() - 0.5) * 0.1
        p.vy += (Math.random() - 0.5) * 0.1 - 0.004
      }

      const alpha = burstActive ? p.opacity * (1 - burstProgress) : p.opacity
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.globalAlpha = alpha
      ctx.fill()
      ctx.globalAlpha = 1
    }

    animId = requestAnimationFrame(loop)
  }

  animId = requestAnimationFrame(loop)

  return {
    burst: (cx, cy) => burst(cx, cy),
    destroy: () => {
      destroyed = true
      if (animId) cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }
}
