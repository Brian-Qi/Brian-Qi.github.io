/**
 * 球杆系统（Cue System）
 *
 * 功能：
 * - 瞄准线显示
 * - 球杆跟随鼠标方向
 * - 按下后蓄力，球杆后拉
 * - 释放后击球
 *
 * 使用方式：
 * const cue = new Cue()
 * cue.update(mouseX, mouseY, isMouseDown, cueBallX, cueBallY)
 * cue.draw(ctx)
 * cue.getShootParams() // 获取击球参数
 */

export class Cue {
  constructor(config = {}) {
    // 球杆配置
    this.cueLength = config.cueLength || 250
    this.cueWidth = config.cueWidth || 8
    this.tipOffset = config.tipOffset || 15
    this.maxPullBack = config.maxPullBack || 100

    // 状态
    this.isVisible = false
    this.isCharging = false
    this.isActive = false

    // 瞄准参数
    this.aimAngle = 0
    this.power = 0
    this.maxPower = 100

    // 鼠标位置
    this.mouseX = 0
    this.mouseY = 0

    // 白球位置
    this.cueBallX = 0
    this.cueBallY = 0

    // 视觉配置
    this.colors = {
      cueMain: '#8B4513',
      cueLight: '#A0522D',
      cueDark: '#5D3A1A',
      tip: '#DEB887',
      aimLine: 'rgba(255, 255, 255, 0.4)',
      ghostBall: 'rgba(255, 255, 255, 0.2)'
    }
  }

  activate(cueBallX, cueBallY) {
    this.isVisible = true
    this.isActive = true
    this.cueBallX = cueBallX
    this.cueBallY = cueBallY
    this.power = 0
    this.isCharging = false
  }

  deactivate() {
    this.isVisible = false
    this.isActive = false
    this.isCharging = false
  }

  update(mouseX, mouseY, isMouseDown, cueBallX, cueBallY) {
    if (!this.isActive) return

    this.mouseX = mouseX
    this.mouseY = mouseY
    this.cueBallX = cueBallX
    this.cueBallY = cueBallY

    const dx = mouseX - cueBallX
    const dy = mouseY - cueBallY
    this.aimAngle = Math.atan2(dy, dx)

    if (isMouseDown && !this.isCharging) {
      this.isCharging = true
      this.power = 0
    }

    if (this.isCharging) {
      const distance = Math.sqrt(dx * dx + dy * dy)
      this.power = Math.min(100, Math.max(0, distance * 0.4))
    }
  }

  release() {
    if (!this.isCharging) return null
    const result = { angle: this.aimAngle, power: this.power }
    this.isCharging = false
    this.power = 0
    return result
  }

  cancel() {
    this.isCharging = false
    this.power = 0
  }

  draw(ctx) {
    if (!this.isVisible) return

    const { cueBallX, cueBallY, aimAngle, power, isCharging } = this
    const pullBack = isCharging ? (power / 100) * this.maxPullBack : 0

    const startX = cueBallX - Math.cos(aimAngle) * (this.tipOffset + pullBack)
    const startY = cueBallY - Math.sin(aimAngle) * (this.tipOffset + pullBack)
    const endX = cueBallX - Math.cos(aimAngle) * (this.tipOffset + pullBack + this.cueLength)
    const endY = cueBallY - Math.sin(aimAngle) * (this.tipOffset + pullBack + this.cueLength)

    // 瞄准线
    ctx.beginPath()
    ctx.moveTo(cueBallX, cueBallY)
    ctx.lineTo(cueBallX + Math.cos(aimAngle) * 500, cueBallY + Math.sin(aimAngle) * 500)
    ctx.strokeStyle = this.colors.aimLine
    ctx.lineWidth = 1.5
    ctx.setLineDash([10, 8])
    ctx.stroke()
    ctx.setLineDash([])

    // 球杆主体渐变
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
    gradient.addColorStop(0, this.colors.tip)
    gradient.addColorStop(0.05, this.colors.cueLight)
    gradient.addColorStop(0.5, this.colors.cueMain)
    gradient.addColorStop(1, this.colors.cueDark)

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = gradient
    ctx.lineWidth = this.cueWidth
    ctx.lineCap = 'round'
    ctx.stroke()

    // 高光
    ctx.beginPath()
    ctx.moveTo(startX, startY - 2)
    ctx.lineTo(endX, endY - 2)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 2
    ctx.stroke()

    // 皮头
    const tipX = cueBallX - Math.cos(aimAngle) * this.tipOffset
    const tipY = cueBallY - Math.sin(aimAngle) * this.tipOffset
    ctx.beginPath()
    ctx.moveTo(tipX, tipY)
    ctx.lineTo(tipX - Math.cos(aimAngle) * 12, tipY - Math.sin(aimAngle) * 12)
    ctx.strokeStyle = this.colors.tip
    ctx.lineWidth = 6
    ctx.stroke()

    // 预测球（蓄力时）
    if (isCharging && power > 10) {
      const distance = power * 1.5
      const ghostX = cueBallX + Math.cos(aimAngle) * distance
      const ghostY = cueBallY + Math.sin(aimAngle) * distance
      ctx.beginPath()
      ctx.arc(ghostX, ghostY, 12, 0, Math.PI * 2)
      ctx.strokeStyle = this.colors.ghostBall
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      ctx.stroke()
      ctx.setLineDash([])
    }
  }
}
