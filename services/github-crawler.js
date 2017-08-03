/**
 *  检查一个仓库的所有文件
 */

const fetch = require('node-fetch')
const config = require('../config')
const cheerio = require('cheerio')
const { email } = require('../lib/email')
const Api = require('../lib/api')
const co = require('co')

const github_host = config.github.HOST

const imagePattern = new RegExp('\\.(ai|bmp|bw|cin|cr2|crw|dcr|dng|dib|dpx|eps|erf|exr|gif|hdr|icb|iff|jpe|jpeg|jpg|mos|mrw|nef|orf|pbm|pef|pct|pcx|pdf|pic|pict|png|ps|psd|pxr|raf|raw|rgb|rgbe|rla|rle|rpf|sgi|srf|tdi|tga|tif|tiff|vda|vst|x3f|xyze)$', 'i')
const pkgPattern = new RegExp('node_modules')

// 判断过滤目录路径
function isfilter (url) {
  if (imagePattern.test(url) || pkgPattern.test(url)) {
    return true
  }
  return false
}

function * request(url, counter) {
  try {
    // 过滤路径
    if (isfilter(url)) {
      counter.filter++
      return
    }

    counter.total++
    const html = yield fetch(url).then(res => res.text())
    const $ = cheerio.load(html)
    const files = Array.from($('.file-wrap table .content a'))

    // 如果当前url是目录
    if (files.length) {
      counter.directory++
      for (const file of files) {
        yield request(`${github_host}${file.attribs.href}`, counter)
      }
    } else {
      counter.file++
      const text = $('.file').text()
      const event = {
        url,
        text
      }
      if (config.debug) {
        require('./analy').handler(Buffer.from(JSON.stringify(event)))
      } else {
        Api.invoke('analy', event)
      }
    }
  } catch (err) {
    counter.fail++
    console.log(err)
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
    console.log(`仓库 ${counter.url} 开始搜索`)
    yield request(url, counter)

    console.log(`仓库 ${counter.url}, 总请求: ${counter.total}, 过滤路径: ${counter.filter}, 目录: ${counter.directory || 1}, 文件： ${counter.file}, 失败: ${counter.fail}`)

    if (config.debug) return
    callback(null, `仓库 ${counter.url}, 总请求: ${counter.total}, 过滤路径: ${counter.filter}, 目录: ${counter.directory || 1}, 文件： ${counter.file}, 失败: ${counter.fail}`)
  }).catch(callback)
}
