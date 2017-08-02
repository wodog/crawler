const github = require('./lib/github')
const co = require('co')
const email = require('./lib/email')

// require('./services/github-users').handler(null, null, console.log)

let repo_data = {
  user: 'wodog'
}
repo_data = Buffer.from(JSON.stringify(repo_data))
require('./services/github-repo').handler(repo_data, null, console.log)


// let crawler_data = {
//   user: 'wodog',
//   repo: 'fcli'
// }
// crawler_data = Buffer.from(JSON.stringify(crawler_data))
// require('./services/github-crawler').handler(crawler_data, null , console.log)

// require('./services/github-repos').handler(null, null, console.log)
