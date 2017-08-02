const github = require('./lib/github')
const co = require('co')
const email = require('./lib/email')

// let repo_data = {
//   username: 'wodog'
// }
// repo_data = Buffer.from(JSON.stringify(data))
// require('./services/github-repos').handler(repo_data, null, console.log)
//
// require('./services/github-user').handler(null, null, console.log)

let crawler_data = {
  user: 'wodog',
  repo: 'fcli'
}
crawler_data = Buffer.from(JSON.stringify(crawler_data))
require('./services/github-crawler').handler(crawler_data, null , console.log)
