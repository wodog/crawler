const email = require('../lib/email')
const config = require('../config')

const pattern = new RegExp('(coffee_token|password)', 'i')

// 校验规则
function analy (url, text) {
  if (pattern.test(text)) {
    email(url, text)
  }
}

exports.handler = function (event, context, callback) {
  event = JSON.parse(event.toString())
  const url = event.url
  const text = event.text
  analy(url, text)

  if (config.debug) return
  callback(`校验完成 ${url}`)
}
