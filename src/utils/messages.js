/**
 * 留言墙数据层 —— 自建服务器 API 版
 * 后端：/opt/guestbook-api (Express + MySQL)，Nginx 反代 /api
 * 管理员 token 存 sessionStorage（关标签页即失效，安全性优于 localStorage）
 */

import { getItem, setItem } from './storage'

const BASE = '/api'
const LIKED_KEY = 'guestbook_liked_ids'
const ADMIN_TOKEN_KEY = 'guestbook_admin_token'

// ========== 内部工具 ==========

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  let data = null
  try {
    data = await res.json()
  } catch (e) {
    /* 非 JSON 响应 */
  }
  if (!res.ok) {
    const err = new Error((data && data.error) || `请求失败 (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

// ========== 点赞状态（本地防重复） ==========

function getLikedIds() {
  return getItem(LIKED_KEY, [])
}

export function hasLiked(id) {
  return getLikedIds().includes(id)
}

// ========== 管理员 ==========

export function getAdminToken() {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY)
  } catch (e) {
    return null
  }
}

export function adminLogin(username, password) {
  return request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }).then(data => {
    try {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token)
    } catch (e) { /* ignore */ }
    return data // { token, username, weight }
  })
}

export function adminLogout() {
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY)
  } catch (e) { /* ignore */ }
}

// 带鉴权头的内部请求
function authedRequest(path, options = {}) {
  const token = getAdminToken()
  if (!token) {
    return Promise.reject(Object.assign(new Error('未登录管理员'), { status: 401 }))
  }
  return request(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  })
}

// 当前登录管理员信息（校验 token 是否仍有效）
export function adminMe() {
  return authedRequest('/admin/me')
}

// 管理员列表
export function adminList() {
  return authedRequest('/admin/list')
}

/**
 * 添加管理员（仅最高权重可用）
 * @param {string} username - 账号名
 * @param {string} password - 密码（6~64 位）
 * @param {number} [weight=1] - 权重，低权重默认 1
 */
export function adminCreate(username, password, weight = 1) {
  return authedRequest('/admin/create', {
    method: 'POST',
    body: JSON.stringify({ username, password, weight })
  })
}

// 删除管理员（仅最高权重可用）
export function adminDelete(id) {
  return authedRequest(`/admin/${id}`, { method: 'DELETE' })
}

export function adminChangePassword(oldPassword, newPassword) {
  return authedRequest('/admin/change-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword })
  })
}

/**
 * 管理员发布留言（带 token，后端自动设置署名）
 * @param {string} content - 留言内容（≤200 字）
 * @returns {Promise<{id, author, content, likes, date}>}
 */
export function adminAddMessage(content) {
  return authedRequest('/messages', {
    method: 'POST',
    body: JSON.stringify({ content })
  })
}

// ========== 留言 CRUD ==========

/**
 * 分页获取留言（倒序）
 * @param {Object} params
 * @param {number} params.page - 页码，从 1 开始
 * @param {number} params.pageSize - 每页条数，默认 10
 * @returns {Promise<{list: Array, total: number, hasMore: boolean}>}
 */
export async function getMessages({ page = 1, pageSize = 10 } = {}) {
  return request(`/messages?page=${page}&pageSize=${pageSize}`)
}

/**
 * 发布留言
 * @param {string} content - 留言内容（≤200 字）
 * @param {string} author - 署名，空则服务端默认「匿名摸鱼人」
 * @returns {Promise<{id, author, content, likes, date}>}
 */
export function addMessage(content, author = '') {
  return request('/messages', {
    method: 'POST',
    body: JSON.stringify({ content, author })
  })
}

/**
 * 点赞（本地记录已赞 id，防重复点击）
 * @param {number} id - 留言 id
 * @returns {Promise<{id, likes}>}
 */
export async function likeMessage(id) {
  const data = await request(`/messages/${id}/like`, { method: 'POST' })
  const liked = getLikedIds()
  if (!liked.includes(id)) {
    liked.push(id)
    setItem(LIKED_KEY, liked)
  }
  return data
}

/**
 * 删除留言（仅管理员）
 * @param {number} id - 留言 id
 * @param {string} [token] - 不传则自动取 sessionStorage 里的 token
 */
export function deleteMessage(id, token) {
  const t = token || getAdminToken()
  if (!t) {
    return Promise.reject(new Error('未登录管理员'))
  }
  return request(`/messages/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${t}`
    }
  })
}
