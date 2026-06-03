/**
 * 球工厂 - 创建和管理球
 */

import { BALL_COLORS } from './gameState.js'

export const BALL_RADIUS = 12

/**
 * 创建白球
 */
export function createCueBall(x, y) {
  return {
    id: 'cue',
    x,
    y,
    vx: 0,
    vy: 0,
    radius: BALL_RADIUS,
    color: '#FFFFFF',
    number: 0,
    isCue: true,
    isStripe: false,
    pocketed: false
  }
}

/**
 * 创建彩球
 */
export function createBall(number, x, y) {
  return {
    id: `ball_${number}`,
    x,
    y,
    vx: 0,
    vy: 0,
    radius: BALL_RADIUS,
    color: BALL_COLORS[number] || '#888888',
    number,
    isCue: false,
    isStripe: number > 8, // 9-15是花色球
    pocketed: false
  }
}

/**
 * 初始化8球台球摆放
 * 标准摆放：黑8在中间，三角形排列
 */
export function initializeBalls(tableWidth, tableHeight) {
  const balls = []

  // 白球位置
  const cueX = 200
  const cueY = tableHeight / 2
  balls.push(createCueBall(cueX, cueY))

  // 彩球三角形起始位置
  const startX = tableWidth * 0.65
  const startY = tableHeight / 2
  const spacing = BALL_RADIUS * 2.3

  // 标准8球摆放顺序（随机但黑8必须在中间）
  // 这里用一个固定的摆放顺序
  const rackOrder = [
    [1],
    [9, 2],
    [3, 8, 10],   // 黑8在中间
    [11, 4, 5, 12],
    [6, 13, 14, 7, 15]
  ]

  // 实际只摆放7个全色 + 1个黑8 + 7个花色 = 15个球
  // 简化版：使用标准顺序
  const simpleOrder = [1, 9, 2, 10, 8, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15]

  let ballIndex = 0
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= row; col++) {
      if (ballIndex >= 15) break

      const x = startX + row * spacing
      const y = startY + (col - row / 2) * spacing

      balls.push(createBall(simpleOrder[ballIndex], x, y))
      ballIndex++
    }
  }

  return balls
}

/**
 * 重置球的物理属性（保留位置）
 */
export function resetBallPhysics(ball) {
  ball.vx = 0
  ball.vy = 0
  ball.pocketed = false
}

/**
 * 检查球是否重叠
 */
export function checkBallOverlap(ball1, ball2) {
  const dx = ball2.x - ball1.x
  const dy = ball2.y - ball1.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  return dist < ball1.radius + ball2.radius
}

/**
 * 检查白球是否与其他球重叠
 */
export function findValidCueBallPosition(cueBall, otherBalls, tableWidth, tableHeight) {
  const validPositions = []
  const step = BALL_RADIUS * 4

  // 在开球区附近寻找有效位置
  for (let x = 50; x < 350; x += step) {
    for (let y = tableHeight * 0.25; y < tableHeight * 0.75; y += step) {
      cueBall.x = x
      cueBall.y = y

      let valid = true
      for (const other of otherBalls) {
        if (!other.pocketed && checkBallOverlap(cueBall, other)) {
          valid = false
          break
        }
      }

      if (valid) {
        validPositions.push({ x, y })
      }
    }
  }

  // 返回找到的第一个有效位置
  if (validPositions.length > 0) {
    return validPositions[0]
  }

  // 如果找不到，返回默认位置
  return { x: 150, y: tableHeight / 2 }
}
