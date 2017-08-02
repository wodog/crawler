/**
 * 验证规则
 * 消息处理
 */

const email = require('../lib/email')

exports.handler = function(event, context, callback) {
  event = JSON.parse(event.toString())
  console.log(event)
  if (event.text.includes('COFFEE_TOKEN')) {
    email(event.url)
  }
}
