const github = require('../lib/github')
const co = require('co')
const email = require('../lib/email')

// 更新所有用户
// require('../services/github-users').handler(null)

// // 爬单个用户
// let repo_data = {
//   user: 'wodog'
// }
// repo_data = Buffer.from(JSON.stringify(repo_data))
// require('../services/github-repo').handler(repo_data)


// 爬单个仓库
// let crawler_data = {
//   url: 'https://github.com/wodog/www'
// }
// require('../services/github-crawler').handler(Buffer.from(JSON.stringify(crawler_data)))

// 爬所有用户
// require('../services/github-repos').handler(null)

// email('http://test', 'text')

require('../services/test').handler(null, null, console.log)
