'use strict'

const co = require('co')
const Api = require('../lib/api')
const github = require('../lib/github')


function * getRepos (data, username, page) {
  const per_page = 100
  const { data: repos } = yield github.repos.getForUser({
    username: username,
    page: page,
    per_page
  })
  data = data.concat(repos)
  if (data.length === per_page) {
    data = yield getMembers(data, ++page)
  }
  return data
}

exports.handler = function (ctx, body) {
  co(function * () {
    const username = 'wodog'

    // 已保存的数据
    const repos = yield Api.queryRecords('repo')

    // 最新所有数据
    let result = []
    const data = yield getRepos([], username, 1)
    for (const repo of data) {
      const obj = {}
      obj.user = username
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
  })
}
