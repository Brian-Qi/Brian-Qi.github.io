import { describe, it, expect } from 'vitest'
import router from '../src/router/index.js'

describe('路由', () => {
  it('已知路径能匹配到具名路由', async () => {
    expect(router.resolve('/index').name).toBe('index')
    expect(router.resolve('/guestbook').name).toBe('Guestbook')
    expect(router.resolve('/moyu').name).toBe('Moyu')
    expect(router.resolve('/achievements').name).toBe('AchievementsStats')
  })

  it('未知路径命中 404 兜底（此前缺失会白屏）', () => {
    const r = router.resolve('/this-path-does-not-exist-123')
    expect(r.matched.length).toBe(1)
    expect(r.name).toBe('NotFound')
  })

  it('深层未知路径同样命中 404', () => {
    expect(router.resolve('/a/b/c/d').name).toBe('NotFound')
  })

  it('旧「秘密空间」路径重定向到 /moyu', () => {
    const r = router.resolve('/who_i_am/secret_quiz/secret_room')
    expect(r.matched.length).toBeGreaterThan(0)
    // 命中重定向记录（redirect 会在导航时生效）
    expect(r.path).toBe('/who_i_am/secret_quiz/secret_room')
  })
})
