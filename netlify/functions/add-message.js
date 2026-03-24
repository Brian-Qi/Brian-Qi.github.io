const { Octokit } = require('@octokit/rest')

exports.handler = async (event) => {
  const { content, author } = JSON.parse(event.body)
  
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN  // 环境变量，安全！
  })

  try {
    const { data } = await octokit.issues.create({
      owner: '你的用户名',
      repo: '你的仓库名',
      title: content,
      body: `留言者：${author}`,
      labels: ['留言']
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}