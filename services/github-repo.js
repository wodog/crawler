/**
 *  查找一个用户下的所有仓库， 并调用
 */
const co = require('co')
const config = require('../config')
const Api = require('../lib/api')
const github = require('../lib/github')

function * getRepos (data, user, page) {
  const per_page = 100
  const { data: repos } = yield github.repos.getForUser({
    username: user,
    page: page,
    per_page
  })
  data = data.concat(repos)
  if (data.length === per_page) {
    data = yield getRepos(data, ++page)
  }
  return data
}

exports.handler = function (event, context, callback) {
  co(function * () {
    console.log('repo')
    event = JSON.parse(event.toString())
    const user = event.user
    if (!user) {
      throw('参数不正确')
    }
    let result = []
    let repos = yield getRepos([], user, 1)

    // 过滤fork
    repos = repos.filter(repo => !repo.fork).map(repo => repo.html_url)
    for (const url of repos) {
      const data = {
        url: url
      }
      if (config.debug) {
        require('./github-crawler').handler(Buffer.from(JSON.stringify(data)), null, console.log)
      } else {
        Api.invoke('github-crawler', data)
      }
    }

    console.log(`总共 ${repos.length} 个repo, 分别是 ${repos}`)

    if (config.debug) return
    callback(null, `总共 ${repos.length} 个repo, 分别是 ${repos}`)
  }).catch(callback)
}
