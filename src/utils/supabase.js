import { createClient } from '@supabase/supabase-js'

// 从环境变量读取配置
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY

// 验证配置
const isValidUrl = (url) => {
  return url && url.startsWith('http') && !url.includes('your_supabase_url_here')
}

let supabase = null

if (isValidUrl(supabaseUrl) && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey)
  } catch (e) {
    console.warn('Supabase 初始化失败:', e.message)
  }
} else {
  console.warn('警告: Supabase 配置无效，请检查 .env 文件中的 VUE_APP_SUPABASE_URL 和 VUE_APP_SUPABASE_ANON_KEY')
}

// 如果 supabase 未初始化，创建一个空实现
if (!supabase) {
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ error: { message: 'Supabase 未配置' } }),
      delete: () => Promise.resolve({ error: { message: 'Supabase 未配置' } })
    })
  }
}

export { supabase }

// console.log('Supabase URL:', supabaseUrl)
// console.log('Supabase Key:', supabaseKey ? '已设置' : '未设置')

// 获取留言
export const getMessages = async () => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('id', { ascending: false })
  
    if (error) {
      console.error('Supabase查询错误:', error)
      throw error
    }
    
    // console.log('Supabase原始返回:', data)
    // console.log('data类型:', typeof data)
    // console.log('是数组吗:', Array.isArray(data))
    
    // 确保返回数组
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('读取留言失败:', error)
    return []
  }
}

// 添加留言
export const addMessage = async (content, author) => {
  const newMessage = {
    id: Date.now(),
    content,
    author: author || '匿名摸鱼人',
    date: new Date().toLocaleDateString()
  }
  
  const { error } = await supabase
    .from('messages')
    .insert([newMessage])
  
  if (error) throw error
  return newMessage
}

export const deleteMessage = async (id) => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}