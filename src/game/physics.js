/**
 * 物理引擎 - 负责所有物理计算
 * 不依赖 Vue，纯数学计算
 */

export class PhysicsEngine {
  constructor(config) {
    this.tableWidth = config.tableWidth
    this.tableHeight = config.tableHeight
    this.ballRadius = config.ballRadius
    this.pocketRadius = config.pocketRadius
    this.friction = config.friction || 0.985
    this.ballMass = config.ballMass || 1
    this.cushionRestitution = config.cushionRestitution || 0.8
    this.ballRestitution = config.ballRestitution || 0.95

    // 袋口位置
    this.pockets = [
      { x: this.pocketRadius, y: this.pocketRadius },
      { x: this.tableWidth / 2, y: this.pocketRadius - 5 },
      { x: this.tableWidth - this.pocketRadius, y: this.pocketRadius },
      { x: this.pocketRadius, y: this.tableHeight - this.pocketRadius },
      { x: this.tableWidth / 2, y: this.tableHeight - this.pocketRadius + 5 },
      { x: this.tableWidth - this.pocketRadius, y: this.tableHeight - this.pocketRadius }
    ]

    // 边界（桌面内边距）
    this.boundary = {
      left: 25,
      right: this.tableWidth - 25,
      top: 25,
      bottom: this.tableHeight - 25
    }
  }

  /**
   * 更新所有球的物理状态
   * @param {Array} balls - 球数组（普通对象，非响应式）
   * @returns {boolean} - 是否还有球在运动
   */
  update(balls) {
    let hasMoving = false
    const movingBalls = balls.filter(b => !b.pocketed)

    // 1. 更新位置和摩擦力
    for (const ball of movingBalls) {
      if (Math.abs(ball.vx) > 0.001 || Math.abs(ball.vy) > 0.001) {
        // 应用摩擦力
        ball.vx *= this.friction
        ball.vy *= this.friction

        // 更新位置
        ball.x += ball.vx
        ball.y += ball.vy

        // 检查是否应该停止
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy)
        if (speed < 0.01) {
          ball.vx = 0
          ball.vy = 0
        } else {
          hasMoving = true
        }
      }
    }

    // 2. 边界碰撞
    for (const ball of movingBalls) {
      this.handleBoundaryCollision(ball)
    }

    // 3. 球与球碰撞
    this.handleBallCollisions(movingBalls)

    // 4. 检测进袋
    for (const ball of movingBalls) {
      const pocketed = this.checkPocket(ball)
      if (pocketed) {
        ball.pocketed = true
        ball.vx = 0
        ball.vy = 0
      }
    }

    return hasMoving
  }

  /**
   * 边界碰撞处理
   */
  handleBoundaryCollision(ball) {
    const { left, right, top, bottom } = this.boundary
    const r = ball.radius

    // 左边界
    if (ball.x - r < left) {
      ball.x = left + r
      ball.vx = -ball.vx * this.cushionRestitution
    }
    // 右边界
    if (ball.x + r > right) {
      ball.x = right - r
      ball.vx = -ball.vx * this.cushionRestitution
    }
    // 上边界
    if (ball.y - r < top) {
      ball.y = top + r
      ball.vy = -ball.vy * this.cushionRestitution
    }
    // 下边界
    if (ball.y + r > bottom) {
      ball.y = bottom - r
      ball.vy = -ball.vy * this.cushionRestitution
    }
  }

  /**
   * 球与球碰撞处理（防止穿模和抖动）
   */
  handleBallCollisions(balls) {
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const b1 = balls[i]
        const b2 = balls[j]

        const dx = b2.x - b1.x
        const dy = b2.y - b1.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const minDist = b1.radius + b2.radius

        // 碰撞检测
        if (dist < minDist && dist > 0.001) {
          // 碰撞法向量
          const nx = dx / dist
          const ny = dy / dist

          // 相对速度
          const dvx = b1.vx - b2.vx
          const dvy = b1.vy - b2.vy
          const dvn = dvx * nx + dvy * ny

          // 只有球相向运动时才处理碰撞
          if (dvn > 0) {
            // 弹性碰撞公式（质量相同）
            const impulse = dvn * this.ballRestitution

            b1.vx -= impulse * nx
            b1.vy -= impulse * ny
            b2.vx += impulse * nx
            b2.vy += impulse * ny
          }

          // 分离重叠的球（防止穿模）
          const overlap = (minDist - dist) / 2
          b1.x -= overlap * nx
          b1.y -= overlap * ny
          b2.x += overlap * nx
          b2.y += overlap * ny
        }
      }
    }
  }

  /**
   * 检测球是否进袋
   */
  checkPocket(ball) {
    for (const pocket of this.pockets) {
      const dx = ball.x - pocket.x
      const dy = ball.y - pocket.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      // 袋口有吸引力范围
      if (dist < this.pocketRadius - ball.radius * 0.3) {
        return true
      }
    }
    return false
  }

  /**
   * 击球
   * @param {Object} cueBall - 白球
   * @param {number} angle - 击球角度（弧度）
   * @param {number} power - 力度（0-100）
   * @param {number} maxSpeed - 最大速度
   */
  shoot(cueBall, angle, power, maxSpeed = 18) {
    const speed = (power / 100) * maxSpeed
    cueBall.vx = Math.cos(angle) * speed
    cueBall.vy = Math.sin(angle) * speed
  }

  /**
   * 检测所有球是否静止
   */
  areAllBallsStopped(balls) {
    return balls.every(ball =>
      ball.pocketed || (Math.abs(ball.vx) < 0.01 && Math.abs(ball.vy) < 0.01)
    )
  }
}
