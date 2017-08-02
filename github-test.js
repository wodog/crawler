const github = require('./lib/github')
const co = require('co')
const email = require('./lib/email')

// require('./services/github-users').handler(null, null, console.log)
//
// let repo_data = {
//   user: 'heanxu'
// }
// repo_data = Buffer.from(JSON.stringify(repo_data))
// require('./services/github-repo').handler(repo_data, null, console.log)


let crawler_data = {
  url: 'https://github.com/wodog/crawler'
}
require('./services/github-crawler').handler(Buffer.from(JSON.stringify(crawler_data)), null , console.log)

// require('./services/github-repos').handler(null, null, console.log)
