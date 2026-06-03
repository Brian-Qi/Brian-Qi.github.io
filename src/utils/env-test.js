/**
 * 环境变量测试工具
 * 用于验证环境变量是否正确加载
 */

export function testEnvironmentVariables() {
  const envInfo = {
    supabaseUrl: process.env.VUE_APP_SUPABASE_URL,
    supabaseKey: !!process.env.VUE_APP_SUPABASE_ANON_KEY,
    adminPassword: !!process.env.VUE_APP_ADMIN_PASSWORD,
    secretKey: !!process.env.VUE_APP_SECRET_KEY,
    debugMode: process.env.VUE_APP_DEBUG_MODE === 'true',
    version: process.env.VUE_APP_VERSION,
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.startsWith('VUE_APP_'))
  }
  

  
  // 检查是否有默认值（可能未正确配置）
  const warnings = []
  
  if (envInfo.supabaseUrl === 'your_supabase_url_here') {
    warnings.push('Supabase URL 使用默认值，请配置 .env 文件')
  }
  
  if (!envInfo.supabaseKey || envInfo.supabaseKey === 'your_supabase_anon_key_here') {
    warnings.push('Supabase Key 使用默认值，请配置 .env 文件')
  }
  
  if (envInfo.adminPassword === 'dev_password_only') {
    warnings.push('管理员密码使用开发默认值，生产环境请修改')
  }
  
  if (envInfo.secretKey === 'dev_secret_key_only') {
    warnings.push('密钥使用开发默认值，生产环境请修改')
  }
  

  
  return envInfo
}

// 自动运行测试（开发环境）
if (process.env.NODE_ENV === 'development') {
  testEnvironmentVariables()
}