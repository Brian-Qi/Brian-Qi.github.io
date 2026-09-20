import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'src')

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

// 守住「不用 v-html 渲染动态内容」这条线（此前 RunGame 用 v-html 拼 HTML）
describe('安全约定', () => {
  it('src 下没有 v-html 用法', () => {
    const offenders = walk(SRC)
      .filter((f) => f.endsWith('.vue'))
      .filter((f) => fs.readFileSync(f, 'utf8').includes('v-html'))
      .map((f) => f.replace(root, ''))
    expect(offenders).toEqual([])
  })

  it('src 下没有把密钥类变量写成 VUE_APP_*（前端会被打包）', () => {
    const bad = /VUE_APP_[A-Z_]*(PASSWORD|SECRET|TOKEN|KEY)[A-Z_]*\s*=/
    const offenders = walk(SRC)
      .filter((f) => /\.(js|vue)$/.test(f))
      .filter((f) => bad.test(fs.readFileSync(f, 'utf8')))
      .map((f) => f.replace(root, ''))
    expect(offenders).toEqual([])
  })
})
