const co = require('co')
const Api = require('../lib/api')

// const usernames = ['wodog', 'wodog1', 'geemo']


function * getMembers (data, page) {
  const per_page = 100
  const { data: members } = yield github.orgs.getMembers({
    org: 'eleme',
    page: page,
    per_page
  })

  data = data.concat(members)
  if (members.length === per_page) {
    data = yield getMembers(data, ++page)
  }

  return data
}


exports.handler = function() {
  co(function * () {
    // 获取用户
    const members = yield getMembers([], 1)
    const usernames = members.map(member => member.login)
    console.log(usernames.length)
    console.log('1')

    // 已保存的数据
    const repos = yield Api.queryRecords('repo')
    console.log(2)

    // 最新所有数据
    let result = []
    for (const username of usernames) {
      const { data } = yield github.repos.getForUser({ username });
      for (const repo of data) {
        const obj = {}
        obj.user = username
        obj.name = repo.name
        obj.description = repo.description
        obj.html = repo.html_url
        obj.created = repo.created_at
        result.push(obj)
      }
    }
    console.log(3)

    // 取差异
    result = result.filter(r => {
      for (const repo of repos) {
        if (r.user === repo.user && r.name === repo.name) {
          return false
        }
      }
      return true
    })
    console.log(result)

    // 保存差异数据
    if (result.lengt) {
      yield Api.createRecords('repo', result)
    }
  })
}
