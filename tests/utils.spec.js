import { describe, it, expect, beforeEach } from 'vitest'
import { simpleHash, isValidEmail, getSafe, deepClone, formatDate } from '../src/utils/helpers.js'
import { getItem, setItem, removeItem, hasItem, STORAGE_KEYS } from '../src/utils/storage.js'

describe('helpers', () => {
  it('simpleHash 稳定且非负', () => {
    expect(simpleHash('briandolph')).toBe(simpleHash('briandolph'))
    expect(simpleHash('briandolph')).toBeGreaterThanOrEqual(0)
    expect(simpleHash('a')).not.toBe(simpleHash('b'))
  })

  it('isValidEmail', () => {
    expect(isValidEmail('a@b.co')).toBe(true)
    expect(isValidEmail('not-an-email')).toBe(false)
  })

  it('getSafe 取嵌套属性 / 兜底', () => {
    const o = { a: { b: { c: 1 } } }
    expect(getSafe(o, 'a.b.c')).toBe(1)
    expect(getSafe(o, 'a.x.y', 'd')).toBe('d')
  })

  it('deepClone 深拷贝互不影响', () => {
    const o = { a: [1, 2], d: new Date(0) }
    const c = deepClone(o)
    c.a.push(3)
    expect(o.a.length).toBe(2)
    expect(c.d.getTime()).toBe(0)
  })

  it('formatDate 支持自定义格式', () => {
    const d = new Date(2026, 0, 2, 3, 4, 5)
    expect(formatDate(d, 'YYYY-MM-DD')).toBe('2026-01-02')
    expect(formatDate(d, 'HH:mm:ss')).toBe('03:04:05')
  })
})

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('存取删 + hasItem', () => {
    setItem('k', { a: 1 })
    expect(getItem('k')).toEqual({ a: 1 })
    expect(hasItem('k')).toBe(true)
    removeItem('k')
    expect(getItem('k', 'def')).toBe('def')
  })

  it('损坏的 JSON 回退默认值而不抛错', () => {
    localStorage.setItem('bad', '{oops')
    expect(getItem('bad', [])).toEqual([])
  })

  it('STORAGE_KEYS 键名唯一', () => {
    const all = Object.values(STORAGE_KEYS).flatMap((g) => Object.values(g))
    expect(new Set(all).size).toBe(all.length)
  })
})
