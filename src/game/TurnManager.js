/**
 * 回合管理器（Turn Manager）
 *
 * 核心职责：
 * 1. 检测所有球是否完全停止运动
 * 2. 管理"允许击球 / 禁止击球"状态
 * 3. 控制球杆和蓄力条的显示/隐藏
 * 4. 与游戏状态联动
 *
 * 使用方式：
 * const turnManager = new TurnManager({
 *   physics,        // 物理引擎实例
 *   gameState,      // 游戏状态管理器
 *   cue,            // 球杆实例
 *   powerBar        // 蓄力条实例
 * })
 *
 * // 在游戏循环中调用
 * turnManager.update()
 *
 * // 击球时调用
 * turnManager.onShotFired()
 */

export class TurnManager {
  constructor(config) {
    this.physics = config.physics
    this.gameState = config.gameState
    this.cue = config.cue
    this.powerBar = config.powerBar

    // 速度阈值（低于此值认为球已停止）
    this.speedThreshold = 0.1

    // 允许击球状态
    this.canShoot = false

    // 球是否在运动
    this.ballsAreMoving = false

    // 是否正在蓄力
    this.isCharging = false

    // 回调函数
    this.onStateChange = config.onStateChange || (() => {})
    this.onBallsStopped = config.onBallsStopped || (() => {})
  }

  /**
   * 更新回合状态（在 requestAnimationFrame 中调用）
   */
  update() {
    // 检测所有球是否停止
    const wasMoving = this.ballsAreMoving
    this.ballsAreMoving = !this.physics.areAllBallsStopped(this.gameState.balls)

    if (!this._initialized) {
      this._initialized = true
    }

    // 球刚停止时的回调
    if (wasMoving && !this.ballsAreMoving) {
      this.onBallsStopped()
    }

    // 更新击球状态
    const wasCanShoot = this.canShoot
    this.canShoot = !this.ballsAreMoving &&
                    this.gameState.phase === 'break' &&
                    !this.gameState.getCueBall()?.pocketed

    // 状态变化时的回调
    if (wasCanShoot !== this.canShoot) {
      this.onStateChange(this.canShoot)
    }

    // 根据状态控制球杆和蓄力条
    // 注意：蓄力中(isCharging)也要保持显示，不能隐藏
    if (this.canShoot && !this.isCharging) {
      // 可以击球且未蓄力时，显示球杆
      this.enableCueAndPowerBar()
    } else if (this.ballsAreMoving && !this.isCharging) {
      // 球在运动且未蓄力时，隐藏球杆
      this.disableCueAndPowerBar()
    }
    // 如果正在蓄力，保持球杆显示，不做操作


    // })
  }

  /**
   * 启用球杆和蓄力条
   */
  enableCueAndPowerBar() {
    const cueBall = this.gameState.getCueBall()
    if (cueBall && !cueBall.pocketed) {
      this.cue.activate(cueBall.x, cueBall.y)
    }
  }

  /**
   * 禁用球杆和蓄力条
   */
  disableCueAndPowerBar() {
    this.cue.deactivate()
    this.powerBar.hide()
    this.isCharging = false
  }

  /**
   * 开始蓄力
   */
  startCharging() {
    if (!this.canShoot) return false
    this.isCharging = true
    return true
  }

  /**
   * 更新蓄力状态
   */
  updateCharging(mouseX, mouseY) {
    if (!this.isCharging) return
    const cueBall = this.gameState.getCueBall()
    if (cueBall) {
      this.cue.update(mouseX, mouseY, true, cueBall.x, cueBall.y)
      this.powerBar.update(this.cue.power)
    }
  }

  /**
   * 释放击球
   * @returns {{ angle: number, power: number } | null} 击球参数
   */
  releaseShot() {
    if (!this.isCharging) return null

    const result = this.cue.release()
    this.powerBar.hide()
    this.isCharging = false

    return result
  }

  /**
   * 取消蓄力
   */
  cancelCharging() {
    this.cue.cancel()
    this.powerBar.hide()
    this.isCharging = false
  }

  /**
   * 击球后调用（球开始运动）
   */
  onShotFired() {
    this.isCharging = false
    this.canShoot = false
    this.disableCueAndPowerBar()
  }

  /**
   * 检查是否可以开始瞄准
   */
  canStartAim() {
    return this.canShoot && !this.ballsAreMoving && !this.isCharging
  }

  /**
   * 获取当前状态摘要
   */
  getStatus() {
    return {
      canShoot: this.canShoot,
      ballsAreMoving: this.ballsAreMoving,
      isCharging: this.isCharging
    }
  }
}
