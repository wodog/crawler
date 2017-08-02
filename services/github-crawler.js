const fetch = require('node-fetch')
const config = require('../config')
const cheerio = require('cheerio')
const email = require('../lib/email')
const Api = require('../lib/api')

const github_host = config.github.HOST

function request(url) {
  console.log(url)
  fetch(url).then(res => res.text()).then(html => {
    const $ = cheerio.load(html)
    const files = Array.from($('.file-wrap table .content a'))
    // 如果是目录
    if (files.length) {
      for (const file of files) {
        const path = file.attribs.href
        request(`${github_host}${path}`)
      }
    } else {
      const text = $('.file').text()
      // 如果有文件内容
      if (text) {
        const event = {
          url,
          text
        }
        if (config.debug) {
          const buf = Buffer.from(JSON.stringify(event))
          require('./analy').handler(buf)
        } else {
          Api.invoke('analy', event)
        }
      }
    }
  })
}

exports.handler = function(event, context, callback) {
  event = JSON.parse(event.toString())
  const user = event.user
  const repo = event.repo
  if (!user || !repo) {
    callback('参数不正确')
    return
  }
  request(`${github_host}/${user}/${repo}`)
}
