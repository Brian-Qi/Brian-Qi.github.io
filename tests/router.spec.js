import { describe, it, expect } from 'vitest'
import router from '../src/router/index.js'

// 说明：router.resolve() 不会真正执行跳转，命中重定向记录时 name 为 undefined，
// 因此重定向的断言直接读取 matched[0].redirect（静态为字符串，动态为函数）。

describe('路由', () => {
  it('公司站路径能匹配到具名路由', () => {
    expect(router.resolve('/index').name).toBe('index')
    expect(router.resolve('/index/about').name).toBe('company-about')
    expect(router.resolve('/index/services').name).toBe('company-services')
    expect(router.resolve('/index/works').name).toBe('company-works')
    expect(router.resolve('/index/contact').name).toBe('company-contact')
  })

  it('公司站路由带 meta.company（导航栏据此切换）', () => {
    expect(router.resolve('/index').meta.company).toBe(true)
    expect(router.resolve('/index/about').meta.company).toBe(true)
  })

  it('个人站路径能匹配到具名路由', () => {
    expect(router.resolve('/self').name).toBe('self-home')
    expect(router.resolve('/self/who_i_am').name).toBe('WhoIAm')
    expect(router.resolve('/self/guestbook').name).toBe('Guestbook')
    expect(router.resolve('/self/moyu').name).toBe('Moyu')
    expect(router.resolve('/self/achievements').name).toBe('AchievementsStats')
    expect(router.resolve('/self/moyu/run_game/the_lost_realm').name).toBe('TheLostRealm')
  })

  it('旧个人路径重定向到 /self', () => {
    expect(router.resolve('/guestbook').matched[0].redirect).toBe('/self/guestbook')
    expect(router.resolve('/achievements').matched[0].redirect).toBe('/self/achievements')
    expect(router.resolve('/achieve_slacking').matched[0].redirect).toBe('/self/achieve_slacking')
    expect(router.resolve('/index_01').matched[0].redirect).toBe('/index')

    // 动态重定向：整体前移 /self
    const whoFn = router.resolve('/who_i_am/fortune').matched[0].redirect
    expect(whoFn({ path: '/who_i_am/fortune' })).toBe('/self/who_i_am/fortune')

    const moyuFn = router.resolve('/moyu/run_game').matched[0].redirect
    expect(moyuFn({ path: '/moyu/run_game' })).toBe('/self/moyu/run_game')
  })

  it('未知路径命中 404 兜底（此前缺失会白屏）', () => {
    const r = router.resolve('/this-path-does-not-exist-123')
    expect(r.matched.length).toBe(1)
    expect(r.name).toBe('NotFound')
  })

  it('深层未知路径同样命中 404', () => {
    expect(router.resolve('/a/b/c/d').name).toBe('NotFound')
  })

  it('旧「秘密空间」路径重定向到 /self/moyu', () => {
    expect(router.resolve('/who_i_am/secret_quiz/secret_room').matched[0].redirect).toBe('/self/moyu')
    expect(router.resolve('/who_i_am/secret_quiz/secret_room/run_game').matched[0].redirect).toBe(
      '/self/moyu/run_game'
    )
    expect(router.resolve('/who_i_am/secret_quiz/secret_room/run_game/the_lost_realm').matched[0].redirect).toBe(
      '/self/moyu/run_game/the_lost_realm'
    )
  })
})
