/**
 *  检查一个仓库的所有文件
 */

const fetch = require('node-fetch')
const config = require('../config')
const cheerio = require('cheerio')
const email = require('../lib/email')
const Api = require('../lib/api')
const co = require('co')

const github_host = config.github.HOST

// 判断过滤目录路径
function isfilter (path) {
  if (path.includes('node_modules')) {
    return true
  }
  return false
}

// 校验规则
function analy (url, text) {
  if (text.includes('COFFEE_TOKEN')) {
    email(url)
  }
}

function * request(url, counter) {
  try {
    if (isfilter(url)) {
      counter.filter++
      return
    }

    counter.total++
    const html = yield fetch(url).then(res => res.text())
    const $ = cheerio.load(html)
    const files = Array.from($('.file-wrap table .content a'))

    // 如果是目录
    if (files.length) {
      counter.directory++
      for (const file of files) {
        const path = `${github_host}${file.attribs.href}`
        yield request(path, counter)
      }
    } else {
      const text = $('.file').text()
      counter.file++
      analy(url, text)
    }
  } catch (err) {
    console.log(err)
    counter.fail++
  }
}

exports.handler = function(event, context, callback) {
  co(function * () {
    event = JSON.parse(event.toString())
    const url = event.url
    if (!url) {
      throw('参数不正确')
    }

    const counter = {
      url: url,
      total: 0,
      filter: 0,
      directory: 0,
      file: 0,
      fail: 0
    }
    yield request(url, counter)

    console.log(`仓库${counter.url}, 总请求: ${counter.total}, 过滤路径: ${counter.filter}, 目录: ${counter.directory || 1}, 文件： ${counter.file}, 失败: ${counter.fail}`)
    callback(null, `仓库${counter.url}, 总请求: ${counter.total}, 过滤路径: ${counter.filter}, 目录: ${counter.directory || 1}, 文件： ${counter.file}, 失败: ${counter.fail}`)
  }).catch(callback)
}
