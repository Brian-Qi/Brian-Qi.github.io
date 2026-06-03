<template>
  <div class="pool-game">
    <header class="game-header">
      <router-link to="/who_i_am" class="back-btn">← 返回</router-link>
      <h1>🎱 8球台球</h1>
      <div class="game-info">
        <span :class="['status-badge', gamePhaseClass]">{{ phaseText }}</span>
      </div>
    </header>

    <div class="game-container">
      <canvas ref="gameCanvas"></canvas>
    </div>

    <div class="game-controls">
      <div class="power-indicator" v-if="cueController?.isAiming">
        <span>力度:</span>
        <div class="power-bar">
          <div class="power-fill" :style="{ width: cueController.power + '%' }"></div>
        </div>
        <span>{{ Math.round(cueController.power) }}%</span>
      </div>
      <div class="ball-info" v-if="gameState?.playerType">
        <span>你的球:</span>
        <span :class="['ball-type', gameState.playerType]">
          {{ gameState.playerType === 'solid' ? '全色 (1-7)' : '花色 (9-15)' }}
        </span>
      </div>
      <button class="reset-btn" @click="resetGame">重新开始</button>
    </div>

    <div class="game-tip">
      <p>{{ gameState?.getTurnInfoText() || '🎱 8球台球' }}</p>
      <p v-if="gameState?.foul !== 'none'" class="foul-text">{{ gameState?.getFoulDescription() }}</p>
      <p v-else-if="gameState?.phase === 'break'" class="hint-text">🎯 点击并拖动瞄准，松开击球</p>
      <p v-else-if="gameState?.phase === 'shooting'" class="hint-text">⏳ 等待球停止...</p>
      <p v-else-if="gameState?.continueTurn" class="hint-text">✨ 继续击球！</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  PhysicsEngine,
  GameStateManager,
  CueController,
  GameRenderer,
  Cue,
  PowerBar,
  TurnManager,
  initializeBalls,
  findValidCueBallPosition,
  GAME_PHASE
} from '../game/index.js'

export default {
  name: 'PoolGame',
  setup() {
    // ============ DOM 引用 ============
    const gameCanvas = ref(null)

    // ============ 游戏配置 ============
    const config = {
      tableWidth: 800,
      tableHeight: 450,
      ballRadius: 12,
      pocketRadius: 22
    }

    // ============ 核心模块（普通JS对象，不使用ref）============
    let physics = null
    let gameState = new GameStateManager()  // 直接初始化，避免模板访问 null
    let cueController = null
    let renderer = null
    let cue = null          // 新球杆系统
    let powerBar = null     // 新蓄力条系统
    let turnManager = null // 回合管理器
    let balls = []          // 纯数据数组，不使用ref
    let animationId = null
    let mouseDown = false   // 鼠标状态（不放入ref）

    // ============ Vue 响应式状态（仅用于UI）============
    // canShoot 现在由 TurnManager 管理，不再需要单独的 ref

    // ============ 计算属性 ============
    const phaseText = computed(() => {
      switch (gameState.phase) {
        case GAME_PHASE.BREAK: return '🎱 开球'
        case GAME_PHASE.SHOOTING: return '⏳ 击球中'
        case GAME_PHASE.EVALUATING: return '📋 评估中'
        case GAME_PHASE.GAME_OVER: return gameState.winner === 'player' ? '🏆 胜利' : '😢 失败'
        default: return '🎱 8球'
      }
    })

    const gamePhaseClass = computed(() => {
      return gameState.phase?.replace('_', '-') || 'break'
    })

    // ============ 初始化游戏 ============
    const initGame = () => {
      // 创建物理引擎
      physics = new PhysicsEngine({
        tableWidth: config.tableWidth,
        tableHeight: config.tableHeight,
        ballRadius: config.ballRadius,
        pocketRadius: config.pocketRadius,
        friction: 0.984,
        ballRestitution: 0.92,
        cushionRestitution: 0.75
      })

      // 重置游戏状态管理器
      gameState.reset()

      // 创建球杆控制器
      cueController = new CueController()
      cueController.onAngleChange = () => {}
      cueController.onPowerChange = () => {}

      // 创建新的球杆系统
      cue = new Cue({
        cueLength: 250,
        maxPullBack: 80
      })

      // 创建蓄力条（固定在画布下方）
      powerBar = new PowerBar({
        width: 200,
        height: 24,
        positionMode: 'fixed',
        fixedX: config.tableWidth / 2 - 100,
        fixedY: config.tableHeight - 50
      })

      // 创建回合管理器
      turnManager = new TurnManager({
        physics,
        gameState,
        cue,
        powerBar,
        onStateChange: () => {
          // 状态变化时的回调
        },
        onBallsStopped: () => {
          // 球停止时的回调
        }
      })

      // 初始化球
      balls = initializeBalls(config.tableWidth, config.tableHeight)
      gameState.setBalls(balls)

      // 创建渲染器
      const ctx = gameCanvas.value.getContext('2d')
      renderer = new GameRenderer(ctx, config)

      // 初始绘制
      render()

      // 启动游戏循环（确保 TurnManager 能检测状态）
      animationId = requestAnimationFrame(gameLoop)
    }

    // ============ 游戏循环 ============
    const gameLoop = () => {
      // 如果在击球中，更新物理
      if (gameState.phase === GAME_PHASE.SHOOTING) {
        // 物理更新
        physics.update(balls)

        // 检测碰撞（记录第一个碰到的球）
        const cueBall = gameState.getCueBall()
        for (const ball of balls) {
          if (ball.pocketed || ball.isCue) continue
          const dx = ball.x - cueBall.x
          const dy = ball.y - cueBall.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < config.ballRadius * 2) {
            gameState.recordFirstHit(ball)
          }
        }

        // 检测进袋
        for (const ball of balls) {
          if (ball.pocketed) continue
          const pocketed = physics.checkPocket(ball)
          if (pocketed) {
            ball.pocketed = true
            ball.vx = 0
            ball.vy = 0
            gameState.recordPottedBall(ball)
          }
        }
      }

      // ========== TurnManager 核心逻辑 ==========
      // 更新回合状态（检测球是否停止）
      turnManager.update()

      // 检测球停止后的状态切换
      if (gameState.phase === GAME_PHASE.SHOOTING && !turnManager.ballsAreMoving) {
        onBallsStopped()
        // 球停止后，继续循环以保持渲染
      }

      // ========== 渲染 ==========
      render()

      // 继续循环（始终保持循环，直到游戏结束）
      if (gameState.phase !== GAME_PHASE.GAME_OVER) {
        animationId = requestAnimationFrame(gameLoop)
      }
    }

    /**
     * 所有球停止后的处理
     */
    const onBallsStopped = () => {
      // 重置白球（如果有犯规）
      const cueBall = gameState.getCueBall()
      if (cueBall.pocketed) {
        const otherBalls = balls.filter(b => b !== cueBall)
        const pos = findValidCueBallPosition(cueBall, otherBalls, config.tableWidth, config.tableHeight)
        cueBall.x = pos.x
        cueBall.y = pos.y
        cueBall.vx = 0
        cueBall.vy = 0
        cueBall.pocketed = false
      }

      // 评估回合
      gameState.evaluateTurn()

      // 检查游戏是否结束
      if (gameState.phase === GAME_PHASE.GAME_OVER) {
        // 禁用球杆和蓄力条
        turnManager.disableCueAndPowerBar()
        render()
        return
      }

      // 继续游戏 - 切换到 BREAK 阶段
      gameState.phase = GAME_PHASE.BREAK
      cueController.reset()

      // TurnManager 会自动检测状态并启用球杆
      // 不需要手动调用，因为 turnManager.update() 会处理

      render()
    }

    /**
     * 渲染画面
     */
    const render = () => {
      const cueBall = gameState?.getCueBall()
      if (renderer && cueBall) {
        renderer.render(balls, cueBall, cueController)
      }

      // 绘制新的球杆系统
      if (cue && cue.isVisible) {
        const ctx = gameCanvas.value.getContext('2d')
        cue.draw(ctx)
      }

      // 绘制蓄力条
      if (powerBar && powerBar.isVisible) {
        const ctx = gameCanvas.value.getContext('2d')
        powerBar.draw(ctx)
      }
    }

    // ============ 鼠标事件处理 ============
    const getMousePos = (e) => {
      const rect = gameCanvas.value.getBoundingClientRect()
      const scaleX = config.tableWidth / rect.width
      const scaleY = config.tableHeight / rect.height
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      }
    }

    const handleMouseDown = (e) => {
      // ========== TurnManager 核心检查 ==========
      // 只有 TurnManager 允许击球时才能开始瞄准
      if (!turnManager.canStartAim()) {
        return
      }

      const pos = getMousePos(e)
      const cueBall = gameState.getCueBall()

      // 开始蓄力
      if (!turnManager.startCharging()) return

      // 激活新球杆系统
      cue.activate(cueBall.x, cueBall.y)
      cue.update(pos.x, pos.y, true, cueBall.x, cueBall.y)

      // 显示蓄力条
      powerBar.show(pos.x, pos.y)
      powerBar.update(0)

      // 使用旧控制器（保持兼容性）
      cueController.startAim(pos.x, pos.y)
      gameState.startShooting()

      mouseDown = true
      render()
    }

    const handleMouseMove = (e) => {
      // 如果球在运动，禁止更新瞄准
      if (turnManager.ballsAreMoving) return

      const pos = getMousePos(e)
      const cueBall = gameState.getCueBall()

      // 更新新球杆系统
      if (cue.isActive) {
        cue.update(pos.x, pos.y, mouseDown, cueBall.x, cueBall.y)
        powerBar.update(cue.power)
        powerBar.followMouse(pos.x, pos.y)
      }

      // 使用旧控制器（保持兼容性）
      if (cueController.isDragging) {
        cueController.updateAim(cueBall.x, cueBall.y, pos.x, pos.y)
      }

      // 持续渲染
      if (mouseDown) {
        render()
      }
    }

    const handleMouseUp = () => {
      if (!mouseDown) return

      mouseDown = false

      // 球在运动时禁止释放击球
      if (turnManager.ballsAreMoving) {
        turnManager.cancelCharging()
        return
      }

      // 释放新球杆系统
      const result = turnManager.releaseShot()

      if (result && result.power > 5) {
        const cueBall = gameState.getCueBall()
        physics.shoot(cueBall, result.angle, result.power)

        // 通知 TurnManager 球已击出
        turnManager.onShotFired()

        // 开始游戏循环
        animationId = requestAnimationFrame(gameLoop)
      }

      // 使用旧控制器
      cueController.release()
    }

    const handleMouseLeave = () => {
      if (cueController.isDragging || mouseDown) {
        turnManager.cancelCharging()
        handleMouseUp({})
      }
    }

    // ============ 游戏控制 ============
    const resetGame = () => {
      // 停止动画
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
      }

      // 重置球
      balls = initializeBalls(config.tableWidth, config.tableHeight)
      gameState.reset()
      gameState.setBalls(balls)

      cueController.reset()
      turnManager.disableCueAndPowerBar()
      mouseDown = false

      // 重启游戏循环
      render()
      animationId = requestAnimationFrame(gameLoop)
    }

    // ============ 生命周期 ============
    onMounted(() => {
      // 设置Canvas尺寸
      gameCanvas.value.width = config.tableWidth
      gameCanvas.value.height = config.tableHeight

      // 初始化游戏
      initGame()

      // 绑定事件
      gameCanvas.value.addEventListener('mousedown', handleMouseDown)
      gameCanvas.value.addEventListener('mousemove', handleMouseMove)
      gameCanvas.value.addEventListener('mouseup', handleMouseUp)
      gameCanvas.value.addEventListener('mouseleave', handleMouseLeave)
    })

    onUnmounted(() => {
      // 清理事件监听
      if (gameCanvas.value) {
        gameCanvas.value.removeEventListener('mousedown', handleMouseDown)
        gameCanvas.value.removeEventListener('mousemove', handleMouseMove)
        gameCanvas.value.removeEventListener('mouseup', handleMouseUp)
        gameCanvas.value.removeEventListener('mouseleave', handleMouseLeave)
      }

      // 停止动画
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    })

    return {
      gameCanvas,
      cueController,
      gameState,
      phaseText,
      gamePhaseClass,
      resetGame
    }
  }
}
</script>

<style scoped>
.pool-game {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-header {
  width: 100%;
  max-width: 840px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.game-header h1 {
  font-size: 1.5rem;
  color: var(--app-text);
  margin: 0;
  order: 1;
  width: 100%;
  text-align: center;
}

.back-btn {
  color: var(--app-accent-green-text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid var(--app-accent-green-text);
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.2s;
  order: 0;
}

.back-btn:hover {
  background: rgba(66, 185, 131, 0.1);
}

.game-info {
  order: 2;
}

.status-badge {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  background: rgba(66, 185, 131, 0.2);
  color: #42b983;
}

.status-badge.game-over {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
}

.game-container {
  background: #2d2d44;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

canvas {
  display: block;
  border-radius: 8px;
  cursor: crosshair;
}

.game-controls {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.power-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--app-text);
}

.power-bar {
  width: 150px;
  height: 12px;
  background: #333;
  border-radius: 6px;
  overflow: hidden;
}

.power-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #facc15, #ef4444);
  transition: width 0.05s;
}

.ball-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
}

.ball-type.solid {
  color: #ffd700;
}

.ball-type.stripe {
  color: #1e90ff;
}

.reset-btn {
  background: #42b983;
  color: #fff;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #3aa876;
  transform: scale(1.05);
}

.game-tip {
  margin-top: 1rem;
  text-align: center;
}

.game-tip p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
  color: #888;
}

.foul-text {
  color: #ef4444 !important;
}

.hint-text {
  color: #aaa !important;
}

@media (max-width: 850px) {
  canvas {
    width: 100%;
    height: auto;
  }

  .game-header {
    justify-content: center;
  }
}
</style>
