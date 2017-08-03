const co = require('co')
const github = require('../lib/github')
const Api = require('../lib/api')
const config = require('../config')

// 获取所有用户
function * getMembers (data, page) {
  const per_page = 100
  const { data: members } = yield github.orgs.getMembers({
    org: 'elemefe',
    page: page,
    per_page
  })
  data = data.concat(members)
  if (members.length === per_page) {
    data = yield getMembers(data, ++page)
  }
  return data
}

// 更新用户列表
exports.handler = function(event, context, callback) {
  console.log(config)
  co(function * () {
    console.log(1)
    const users = yield Api.queryRecords('user')
    console.log(2)
    const members = yield getMembers([], 1)
    let username = members.map(member => {
      return { name: member.login }
    })
    console.log(3)
    console.log(username)
    // 取差异
    username = username.filter(u => {
      for (const user of users) {
        if (u.name === user.name) {
          return false
        }
      }
      return true
    })
    console.log(4)
    if (username.length) {
      yield Api.createRecords('user', username)
      console.log('更新用户', username)
    }

    if (config.debug) return
    callback(null, '更新用户成功')
  }).catch(err => {
    callback(err)
  })
}
