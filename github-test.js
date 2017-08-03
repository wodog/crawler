const github = require('./lib/github')
const co = require('co')
const email = require('./lib/email')

// require('./services/github-users').handler(null)
//
let repo_data = {
  user: 'wodog'
}
repo_data = Buffer.from(JSON.stringify(repo_data))
require('./services/github-repo').handler(repo_data)


// let crawler_data = {
//   url: 'https://github.com/wodog/crawler'
// }
// require('./services/github-crawler').handler(Buffer.from(JSON.stringify(crawler_data)))

// require('./services/github-repos').handler(null)
