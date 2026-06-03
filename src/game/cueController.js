/**
 * 球杆控制器 - 管理瞄准和击球
 */

export class CueController {
  constructor() {
    // 瞄准状态
    this.isAiming = false
    this.isDragging = false

    // 瞄准参数
    this.aimAngle = 0
    this.power = 50

    // 鼠标位置
    this.mouseX = 0
    this.mouseY = 0

    // 回调函数
    this.onAngleChange = null
    this.onPowerChange = null
  }

  /**
   * 开始瞄准
   */
  startAim(x, y) {
    this.isDragging = true
    this.isAiming = true
    this.mouseX = x
    this.mouseY = y
  }

  /**
   * 更新瞄准
   */
  updateAim(cueBallX, cueBallY, x, y) {
    if (!this.isDragging) return

    this.mouseX = x
    this.mouseY = y

    // 计算角度：球杆指向鼠标，击球方向就是鼠标方向
    this.aimAngle = Math.atan2(y - cueBallY, x - cueBallX)

    // 计算力度：鼠标离白球越远力度越大
    const dx = x - cueBallX
    const dy = y - cueBallY
    const distance = Math.sqrt(dx * dx + dy * dy)
    this.power = Math.min(100, Math.max(0, distance * 0.5))

    if (this.onAngleChange) {
      this.onAngleChange(this.aimAngle)
    }
    if (this.onPowerChange) {
      this.onPowerChange(this.power)
    }
  }

  /**
   * 结束瞄准并返回击球参数
   */
  release() {
    this.isDragging = false
    this.isAiming = false

    const result = {
      angle: this.aimAngle,
      power: this.power,
      canShoot: this.power > 5
    }

    return result
  }

  /**
   * 重置
   */
  reset() {
    this.isAiming = false
    this.isDragging = false
    this.power = 50
  }
}

/**
 * 渲染器 - 负责Canvas绘制
 */
export class GameRenderer {
  constructor(ctx, config) {
    this.ctx = ctx
    this.tableWidth = config.tableWidth
    this.tableHeight = config.tableHeight
    this.pocketRadius = config.pocketRadius
    this.ballRadius = config.ballRadius
    this.cueLength = 220
  }

  /**
   * 清空并绘制桌面
   */
  drawTable() {
    const c = this.ctx

    // 桌面背景
    c.fillStyle = '#1a5f2a'
    c.fillRect(0, 0, this.tableWidth, this.tableHeight)

    // 台面纹理（微妙的效果）
    c.fillStyle = '#1d6630'
    for (let i = 0; i < this.tableWidth; i += 30) {
      c.globalAlpha = 0.1
      c.fillRect(i, 0, 15, this.tableHeight)
    }
    c.globalAlpha = 1

    // 边框
    c.strokeStyle = '#8B4513'
    c.lineWidth = 20
    c.strokeRect(10, 10, this.tableWidth - 20, this.tableHeight - 20)

    // 内边线
    c.strokeStyle = '#0d4a1c'
    c.lineWidth = 3
    c.strokeRect(25, 25, this.tableWidth - 50, this.tableHeight - 50)

    // 开球线
    c.beginPath()
    c.moveTo(200, 25)
    c.lineTo(200, this.tableHeight - 25)
    c.strokeStyle = 'rgba(255,255,255,0.1)'
    c.lineWidth = 1
    c.stroke()
  }

  /**
   * 绘制袋口
   */
  drawPockets() {
    const c = this.ctx
    const pockets = [
      { x: this.pocketRadius, y: this.pocketRadius },
      { x: this.tableWidth / 2, y: this.pocketRadius - 5 },
      { x: this.tableWidth - this.pocketRadius, y: this.pocketRadius },
      { x: this.pocketRadius, y: this.tableHeight - this.pocketRadius },
      { x: this.tableWidth / 2, y: this.tableHeight - this.pocketRadius + 5 },
      { x: this.tableWidth - this.pocketRadius, y: this.tableHeight - this.pocketRadius }
    ]

    for (const pocket of pockets) {
      // 袋口阴影
      c.beginPath()
      c.arc(pocket.x, pocket.y, this.pocketRadius + 2, 0, Math.PI * 2)
      c.fillStyle = '#5c3317'
      c.fill()

      // 袋口
      c.beginPath()
      c.arc(pocket.x, pocket.y, this.pocketRadius, 0, Math.PI * 2)
      c.fillStyle = '#000000'
      c.fill()
    }
  }

  /**
   * 绘制单个球
   */
  drawBall(ball) {
    if (ball.pocketed) return

    const c = this.ctx
    const r = ball.radius

    // 阴影
    c.beginPath()
    c.arc(ball.x + 2, ball.y + 2, r, 0, Math.PI * 2)
    c.fillStyle = 'rgba(0, 0, 0, 0.25)'
    c.fill()

    // 球体渐变
    const gradient = c.createRadialGradient(
      ball.x - r * 0.3, ball.y - r * 0.3, r * 0.1,
      ball.x, ball.y, r
    )

    if (ball.isCue) {
      // 白球
      gradient.addColorStop(0, '#FFFFFF')
      gradient.addColorStop(0.8, '#F0F0F0')
      gradient.addColorStop(1, '#D0D0D0')
    } else {
      // 彩球
      const baseColor = ball.color
      gradient.addColorStop(0, this.lightenColor(baseColor, 50))
      gradient.addColorStop(0.5, baseColor)
      gradient.addColorStop(1, this.darkenColor(baseColor, 30))
    }

    c.beginPath()
    c.arc(ball.x, ball.y, r, 0, Math.PI * 2)
    c.fillStyle = gradient
    c.fill()

    // 球边框
    c.strokeStyle = this.darkenColor(ball.color || '#FFFFFF', 20)
    c.lineWidth = 1
    c.stroke()

    // 花色球的白色条纹
    if (ball.isStripe) {
      c.save()
      c.beginPath()
      c.arc(ball.x, ball.y, r, 0, Math.PI * 2)
      c.clip()

      c.fillStyle = '#FFFFFF'
      c.fillRect(ball.x - r, ball.y - r * 0.35, r * 2, r * 0.7)
      c.restore()
    }

    // 数字（对于非白球）
    if (ball.number && !ball.isCue) {
      // 数字背景圆
      c.beginPath()
      c.arc(ball.x, ball.y, r * 0.5, 0, Math.PI * 2)
      c.fillStyle = '#FFFFFF'
      c.fill()

      // 数字
      c.fillStyle = '#000000'
      c.font = `bold ${r * 0.65}px Arial`
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillText(ball.number.toString(), ball.x, ball.y + 1)
    }
  }

  /**
   * 绘制球杆
   */
  drawCue(cueBall, angle, power, isVisible) {
    if (!isVisible || cueBall.pocketed) return

    const c = this.ctx
    const r = this.ballRadius

    // 后拉距离（力度越大，后拉越远）
    const pullBack = (power / 100) * 80

    // 球杆起点（在白球后方）
    const startX = cueBall.x - Math.cos(angle) * (r + 8 + pullBack)
    const startY = cueBall.y - Math.sin(angle) * (r + 8 + pullBack)

    // 球杆终点
    const endX = cueBall.x - Math.cos(angle) * (r + 8 + pullBack + this.cueLength)
    const endY = cueBall.y - Math.sin(angle) * (r + 8 + pullBack + this.cueLength)

    // 球杆主体
    c.beginPath()
    c.moveTo(startX, startY)
    c.lineTo(endX, endY)

    // 木质渐变
    const cueGradient = c.createLinearGradient(startX, startY, endX, endY)
    cueGradient.addColorStop(0, '#D2691E')
    cueGradient.addColorStop(0.3, '#8B4513')
    cueGradient.addColorStop(0.7, '#A0522D')
    cueGradient.addColorStop(1, '#8B4513')

    c.strokeStyle = cueGradient
    c.lineWidth = 7
    c.lineCap = 'round'
    c.stroke()

    // 球杆皮头
    const tipX = cueBall.x - Math.cos(angle) * (r + 8)
    const tipY = cueBall.y - Math.sin(angle) * (r + 8)
    c.beginPath()
    c.moveTo(tipX, tipY)
    c.lineTo(tipX - Math.cos(angle) * 10, tipY - Math.sin(angle) * 10)
    c.strokeStyle = '#DEB887'
    c.lineWidth = 5
    c.stroke()

    // 瞄准线（虚线）
    c.beginPath()
    c.moveTo(cueBall.x, cueBall.y)
    c.lineTo(
      cueBall.x + Math.cos(angle) * 400,
      cueBall.y + Math.sin(angle) * 400
    )
    c.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    c.lineWidth = 1
    c.setLineDash([6, 6])
    c.stroke()
    c.setLineDash([])
  }

  /**
   * 绘制所有球
   */
  drawBalls(balls) {
    for (const ball of balls) {
      this.drawBall(ball)
    }
  }

  /**
   * 清空画布
   */
  clear() {
    this.ctx.clearRect(0, 0, this.tableWidth, this.tableHeight)
  }

  /**
   * 绘制完整画面
   */
  render(balls, cueBall, cueController) {
    this.clear()
    this.drawTable()
    this.drawPockets()
    this.drawBalls(balls)
    this.drawCue(cueBall, cueController.aimAngle, cueController.power, cueController.isAiming)
  }

  // 颜色处理工具
  lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.min(255, (num >> 16) + amt)
    const G = Math.min(255, ((num >> 8) & 0xFF) + amt)
    const B = Math.min(255, (num & 0xFF) + amt)
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
  }

  darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.max(0, (num >> 16) - amt)
    const G = Math.max(0, ((num >> 8) & 0xFF) - amt)
    const B = Math.max(0, (num & 0xFF) - amt)
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
  }
}
