/**
 * 游戏状态管理器 - 管理游戏状态和8球规则
 */

// 球的类型
export const BALL_TYPE = {
  CUE: 'cue',           // 白球
  SOLID: 'solid',       // 全色球（1-7）
  EIGHT: 'eight',       // 黑8（8号）
  STRIPE: 'stripe'      // 花色球（9-15）
}

// 游戏阶段
export const GAME_PHASE = {
  BREAK: 'break',           // 开球
  SHOOTING: 'shooting',     // 击球中
  EVALUATING: 'evaluating', // 评估结果
  GAME_OVER: 'game_over'     // 游戏结束
}

// 犯规类型
export const FOUL_TYPE = {
  NONE: 'none',
  SCRATCH: 'scratch',           // 白球落袋
  NO_HIT: 'no_hit',             // 未碰到任何球
  WRONG_HIT: 'wrong_hit',       // 先碰到黑8（未清球时）
  BLACK_EARLY: 'black_early',   // 黑8进袋太早
  EIGHT_BALL_FOUL: 'eight_ball_foul' // 打黑8时犯规
}

// 球的颜色映射
export const BALL_COLORS = {
  1: '#FFD700',  // 黄色 全色
  2: '#1E90FF',  // 蓝色 全色
  3: '#FF4500',  // 红色 全色
  4: '#8B0000',  // 深红 全色
  5: '#4B0082',  // 紫色 全色
  6: '#228B22',  // 绿色 全色
  7: '#8B4513',  // 棕色 全色
  8: '#000000',  // 黑色 黑8
  9: '#FFD700',  // 黄色 花色（条纹）
  10: '#1E90FF', // 蓝色 花色
  11: '#FF4500', // 红色 花色
  12: '#8B0000', // 深红 花色
  13: '#4B0082', // 紫色 花色
  14: '#228B22', // 绿色 花色
  15: '#8B4513'  // 棕色 花色
}

export class GameStateManager {
  constructor() {
    this.reset()
  }

  reset() {
    // 球数组（在外部管理，这里只存引用）
    this.balls = []

    // 游戏阶段
    this.phase = GAME_PHASE.BREAK

    // 当前玩家（单人模式为 null）
    this.currentPlayer = 'player'

    // 玩家分配的类型（null = 未分配）
    this.playerType = null

    // 回合信息
    this.turnInfo = {
      firstHitBall: null,      // 本回合第一个碰到的球
      ballsPottedThisTurn: [],  // 本回合进袋的球
      isBreak: true,            // 是否是开球
      continueTurn: false       // 是否继续回合
    }

    // 犯规
    this.foul = FOUL_TYPE.NONE

    // 游戏结果
    this.winner = null

    // 开球标记
    this.isBreakShot = true
  }

  /**
   * 初始化球数组
   */
  setBalls(balls) {
    this.balls = balls
  }

  /**
   * 获取白球
   */
  getCueBall() {
    return this.balls.find(b => b.isCue)
  }

  /**
   * 获取所有未进袋的非白球
   */
  getActiveBalls() {
    return this.balls.filter(b => !b.pocketed && !b.isCue)
  }

  /**
   * 获取所有未进袋的目标球
   */
  getRemainingBalls() {
    return this.balls.filter(b => !b.pocketed && !b.isCue && b.number !== 8)
  }

  /**
   * 获取黑8球
   */
  getEightBall() {
    return this.balls.find(b => b.number === 8)
  }

  /**
   * 开始击球
   */
  startShooting() {
    this.phase = GAME_PHASE.SHOOTING
    this.turnInfo.firstHitBall = null
    this.turnInfo.ballsPottedThisTurn = []
    this.foul = FOUL_TYPE.NONE
  }

  /**
   * 记录击球后第一个碰到的球
   */
  recordFirstHit(ball) {
    if (!this.turnInfo.firstHitBall && !ball.isCue) {
      this.turnInfo.firstHitBall = ball
    }
  }

  /**
   * 记录进袋的球
   */
  recordPottedBall(ball) {
    if (!ball.isCue && !this.turnInfo.ballsPottedThisTurn.includes(ball)) {
      this.turnInfo.ballsPottedThisTurn.push(ball)
    }
  }

  /**
   * 评估回合结果
   */
  evaluateTurn() {
    this.phase = GAME_PHASE.EVALUATING

    // 1. 检查白球落袋（犯规）
    const cueBallPocketed = this.getCueBall()?.pocketed
    if (cueBallPocketed) {
      this.foul = FOUL_TYPE.SCRATCH
    }

    // 2. 检查是否未碰到任何球
    if (!this.turnInfo.firstHitBall && !cueBallPocketed) {
      this.foul = FOUL_TYPE.NO_HIT
    }

    // 3. 检查黑8相关犯规
    const eightBall = this.getEightBall()
    const remainingBalls = this.getRemainingBalls()

    if (this.turnInfo.firstHitBall?.number === 8) {
      // 先碰到黑8
      if (remainingBalls.length > 0) {
        // 还有目标球时碰到黑8
        this.foul = FOUL_TYPE.WRONG_HIT
      } else if (this.foul !== FOUL_TYPE.NONE) {
        // 有其他犯规时打黑8
        this.foul = FOUL_TYPE.EIGHT_BALL_FOUL
      }
    }

    if (eightBall?.pocketed) {
      if (remainingBalls.length > 0) {
        // 黑8进袋但还有目标球
        this.winner = this.currentPlayer === 'player' ? 'opponent' : 'player'
        this.phase = GAME_PHASE.GAME_OVER
        return
      } else if (this.foul !== FOUL_TYPE.NONE) {
        // 打黑8时犯规
        this.winner = this.currentPlayer === 'player' ? 'opponent' : 'player'
        this.phase = GAME_PHASE.GAME_OVER
        return
      }
    }

    // 4. 检查是否清空目标球（获胜）
    if (remainingBalls.length === 0 && !eightBall?.pocketed) {
      // 需要把黑8打进
      this.winner = this.currentPlayer
      this.phase = GAME_PHASE.GAME_OVER
      return
    }

    // 5. 判断是否继续回合
    if (this.foul === FOUL_TYPE.NONE && this.turnInfo.ballsPottedThisTurn.length > 0) {
      // 没有犯规且有进袋，继续回合
      const pottedTypes = this.turnInfo.ballsPottedThisTurn.map(b => this.getBallType(b))
      const currentType = this.playerType

      if (currentType === null) {
        // 开球后第一次进袋，分配类型
        this.playerType = pottedTypes[0]
        this.continueTurn = true
      } else if (pottedTypes.includes(currentType) || pottedTypes.includes(BALL_TYPE.SOLID) || pottedTypes.includes(BALL_TYPE.STRIPE)) {
        this.continueTurn = true
      } else {
        this.continueTurn = false
      }
    } else {
      this.continueTurn = false
    }

    // 开球后标记
    this.isBreakShot = false
  }

  /**
   * 获取球的类型
   */
  getBallType(ball) {
    if (ball.isCue) return BALL_TYPE.CUE
    if (ball.number === 8) return BALL_TYPE.EIGHT
    if (ball.number <= 7) return BALL_TYPE.SOLID
    return BALL_TYPE.STRIPE
  }

  /**
   * 获取当前玩家需要进的球类型
   */
  getRequiredBallType() {
    return this.playerType
  }

  /**
   * 重置白球位置
   */
  resetCueBall() {
    const cueBall = this.getCueBall()
    if (cueBall) {
      cueBall.pocketed = false
      cueBall.x = 200
      cueBall.y = 225
      cueBall.vx = 0
      cueBall.vy = 0
    }
  }

  /**
   * 获取回合信息文本
   */
  getTurnInfoText() {
    if (this.phase === GAME_PHASE.BREAK) {
      return '🎱 开球回合'
    }
    if (this.phase === GAME_PHASE.GAME_OVER) {
      return this.winner === 'player' ? '🏆 你赢了！' : '😢 你输了'
    }
    if (this.foul !== FOUL_TYPE.NONE) {
      return '⚠️ 犯规！'
    }
    if (this.continueTurn) {
      return '✨ 继续击球！'
    }
    return '⏳ 等待对手...'
  }

  /**
   * 获取犯规描述
   */
  getFoulDescription() {
    switch (this.foul) {
      case FOUL_TYPE.SCRATCH:
        return '白球落袋！对手获得自由球'
      case FOUL_TYPE.NO_HIT:
        return '未击中任何球！对手获得自由球'
      case FOUL_TYPE.WRONG_HIT:
        return '先击中黑8！犯规'
      case FOUL_TYPE.EIGHT_BALL_FOUL:
        return '打黑8时犯规！'
      default:
        return ''
    }
  }
}
