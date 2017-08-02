const github = require('./lib/github')
const co = require('co')

// github.repos.getContent({
//   owner: 'wodog',
//   repo: 'nodoc',
//   path: ''
// }).then(data => {
//   console.log(data)
// })

co(function * () {
  let members = yield github.orgs.getMembers({
    org: 'eleme',
    page: 1,
    per_page: 10
  })
  console.log(members)
})
// const config = require('./services/user')
// config.handler()

// const config = require('./services/repo')
// config.handler()
