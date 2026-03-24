import { createClient } from '@supabase/supabase-js'

// 替换成你的配置
const supabaseUrl = 'https://oszjjgzcukgvtsmberdb.supabase.co'
const supabaseKey = 'sb_publishable_HJyAfHjg3TTw-kH0c0P5EQ_9d1XMfBI'

export const supabase = createClient(supabaseUrl, supabaseKey)

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