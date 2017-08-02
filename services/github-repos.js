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
    data = yield getMembers(data, ++page)
  }
  return data
}

exports.handler = function (event, context, callback) {
  event = JSON.parse(event.toString())
  const user = event.user
  if (!user) {
    callback('参数不正确')
    return
  }

  co(function * () {
    // 已保存的数据
    const repos = yield Api.queryRecords('repo')

    // 最新所有数据
    let result = []
    const data = yield getRepos([], user, 1)
    for (const repo of data) {
      const obj = {}
      obj.user = user
      obj.name = repo.name
      obj.description = repo.description
      obj.html = repo.html_url
      obj.created = repo.created_at
      result.push(obj)
    }

    // 取差异
    result = result.filter(r => {
      for (const repo of repos) {
        if (r.user === repo.user && r.name === repo.name) {
          return false
        }
      }
      return true
    })

    // 保存差异数据
    if (result.length) {
      yield Api.createRecords('repo', result)
      console.log('更新repo', result)
    }

    if (config.debug) {
      callback = console.log
    }
    callback('更新repo成功')
  })
}
