/**
 * 蓄力条系统（Power Bar System）
 *
 * 功能：
 * - 显示/隐藏蓄力条
 * - 跟随鼠标或固定位置
 * - 填充比例显示力度
 * - 渐变色表示力度等级
 *
 * 使用方式：
 * const powerBar = new PowerBar()
 * powerBar.show(mouseX, mouseY)
 * powerBar.update(power) // 0-100
 * powerBar.hide()
 * powerBar.draw(ctx)
 */

export class PowerBar {
  constructor(config = {}) {
    // 尺寸配置
    this.width = config.width || 200
    this.height = config.height || 20
    this.borderRadius = config.borderRadius || 10

    // 位置
    this.x = 0
    this.y = 0
    this.positionMode = config.positionMode || 'follow' // 'follow' | 'fixed'

    // 固定位置（当positionMode为fixed时）
    this.fixedX = config.fixedX || null
    this.fixedY = config.fixedY || null

    // 状态
    this.isVisible = false
    this.power = 0

    // 颜色配置
    this.colors = {
      background: 'rgba(0, 0, 0, 0.7)',
      border: 'rgba(255, 255, 255, 0.3)',
      low: '#4ade80',      // 绿色 - 低力度
      medium: '#facc15',   // 黄色 - 中力度
      high: '#ef4444'      // 红色 - 高力度
    }
  }

  /**
   * 显示蓄力条
   */
  show(x, y) {
    this.isVisible = true
    if (this.positionMode === 'follow') {
      this.x = x
      this.y = y
    }
  }

  /**
   * 设置固定位置
   */
  setFixedPosition(x, y) {
    this.fixedX = x
    this.fixedY = y
    this.positionMode = 'fixed'
  }

  /**
   * 隐藏蓄力条
   */
  hide() {
    this.isVisible = false
    this.power = 0
  }

  /**
   * 更新力度值
   */
  update(power) {
    this.power = Math.max(0, Math.min(100, power))
  }

  /**
   * 跟随鼠标更新位置
   */
  followMouse(x, y) {
    if (this.positionMode === 'follow') {
      this.x = x
      this.y = y
    }
  }

  /**
   * 获取填充条颜色（根据力度渐变）
   */
  getPowerColor() {
    const p = this.power
    if (p < 33) {
      // 绿色 -> 黄色 过渡
      const t = p / 33
      return this.interpolateColor(this.colors.low, this.colors.medium, t)
    } else if (p < 66) {
      // 黄色 -> 橙色 过渡
      const t = (p - 33) / 33
      return this.interpolateColor(this.colors.medium, '#f97316', t)
    } else {
      // 橙色 -> 红色 过渡
      const t = (p - 66) / 34
      return this.interpolateColor('#f97316', this.colors.high, t)
    }
  }

  /**
   * 颜色插值
   */
  interpolateColor(color1, color2, t) {
    const c1 = this.hexToRgb(color1)
    const c2 = this.hexToRgb(color2)
    const r = Math.round(c1.r + (c2.r - c1.r) * t)
    const g = Math.round(c1.g + (c2.g - c1.g) * t)
    const b = Math.round(c1.b + (c2.b - c1.b) * t)
    return `rgb(${r}, ${g}, ${b})`
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  /**
   * 绘制蓄力条
   */
  draw(ctx) {
    if (!this.isVisible) return

    const x = this.positionMode === 'fixed' ? this.fixedX : this.x
    const y = this.positionMode === 'fixed' ? this.fixedY : this.y
    const fillWidth = (this.power / 100) * this.width

    // 保存状态
    ctx.save()

    // 外发光效果
    if (this.power > 50) {
      ctx.shadowColor = this.getPowerColor()
      ctx.shadowBlur = 15
    }

    // 背景
    this.roundRect(ctx, x, y, this.width, this.height, this.borderRadius)
    ctx.fillStyle = this.colors.background
    ctx.fill()

    // 填充条
    if (fillWidth > 0) {
      const fillGradient = ctx.createLinearGradient(x, y, x + fillWidth, y)
      fillGradient.addColorStop(0, this.getPowerColor())
      fillGradient.addColorStop(1, this.getPowerColor())

      this.roundRect(ctx, x, y, fillWidth, this.height, this.borderRadius)
      ctx.fillStyle = fillGradient
      ctx.fill()
    }

    // 边框
    ctx.shadowBlur = 0
    this.roundRect(ctx, x, y, this.width, this.height, this.borderRadius)
    ctx.strokeStyle = this.colors.border
    ctx.lineWidth = 2
    ctx.stroke()

    // 力度文字
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(Math.round(this.power) + '%', x + this.width / 2, y + this.height / 2)

    // 刻度线
    this.drawScale(ctx, x, y)

    ctx.restore()
  }

  /**
   * 绘制刻度
   */
  drawScale(ctx, x, y) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1

    for (let i = 1; i < 10; i++) {
      const tickX = x + (this.width / 10) * i
      const tickHeight = i % 5 === 0 ? 8 : 4
      ctx.beginPath()
      ctx.moveTo(tickX, y)
      ctx.lineTo(tickX, y + tickHeight)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(tickX, y + this.height)
      ctx.lineTo(tickX, y + this.height - tickHeight)
      ctx.stroke()
    }
  }

  /**
   * 绘制圆角矩形
   */
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }
}
