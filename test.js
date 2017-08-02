const github = require('./lib/github')

github.repos.getContent({
  owner: 'wodog',
  repo: 'nodoc',
  path: ''
}).then(data => {
  console.log(data)
})

// const config = require('./services/user')
// config.handler()

// const config = require('./services/repo')
// config.handler()
