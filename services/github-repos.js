/**
 * 所有用户的仓库，并调用
 */

const Api = require('../lib/api')
const config = require('../config')

exports.handler = function (event, context, callback) {
  Api.queryRecords('user').then(users => {
    users = users.map(user => user.name)
    for (const user of users) {
      const data = {
        user: user
      }
      if (config.debug) {
        require('./github-repo').handler(Buffer.from(JSON.stringify(data)), null, console.log)
      } else {
        Api.invoke('github-repo', data)
      }
    }
    callback(null, `执行所有用户 ${users} 的仓库`)
  }).catch(callback)
}
