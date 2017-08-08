const fetch = require('node-fetch')
const config = require('../config')

const EMAIL_API = config.email.API
const KEY = config.email.KEY
const TOKEN = config.email.TOKEN
const RECEIVERS = config.email.RECEIVERS.join(';') || 'zhongyang.zhou@ele.me'

function sendEmail (receivers, message, subject) {
  const data = {
    receivers: receivers,
    subject: encodeURIComponent(subject || 'crawler'),
    from_address: 'frontend@ele.me',
    from_name: encodeURIComponent('饿了么大前端'),
    message: encodeURIComponent(message),
    sender_key: KEY
  }

  return fetch(EMAIL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authentication-Token': TOKEN
    },
    body: JSON.stringify(data)
  }).then(res => res.text())
}

module.exports = {
  email: function (url, text) {
    //TODO 渲染msg, 支持自定义模版
    const msg = `
      链接：${url}
      内容：
      ${text}
    `
    console.log('发送到', RECEIVERS)
    sendEmail(RECEIVERS, msg)
  },

  customEmail(msg) {
    sendEmail(RECEIVERS, msg);
  }
}
