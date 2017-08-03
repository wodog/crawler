'use strict';

const Crawler = require("crawler");
const url = require('url');
const pathParse = require('path').parse;
const Api = require('../lib/api');
const { email, customEmail } = require('../lib/email')

let analyResArr = [];

module.exports = (event, ctx, callback) => {
  let { urls, keyword, clearUp } = JSON.parse(event);
  let urlRecords = [];

  let c = new Crawler({
    maxConnections: 10,
    headers: {
      accept: 'text/html'
    },
    callback: async (error, res, done) => {
      if (error) {
        console.error(error);
      } else {
        let uri = res.request.uri;
        let blogUrl = `${uri.protocol}//${uri.host}`;
        let urlRecord;
        try {
          urlRecord = (await Api.queryRecords('urls', { $limit: 1, blog: blogUrl }))[0];
          urlRecords.push(urlRecord);
        } catch(err) {
          console.error(err);
          done();
        }

        let $ = res.$;
        if (urlRecord) {
          let analyChunk = analy(urlRecord, uri.href, $.html());
          analyResArr = analyResArr.concat(analyChunk);
          if (analyResArr.length >= 20) {
            sendEmail(analyResArr);
            analyResArr = [];
          }
        
          let hrefs = $('a').map((idx, item) => item.attribs.href).toArray()        
          if (hrefs.length) {
            let realHrefs = [];
            try {
              realHrefs = await filterHrefs(hrefs, uri, blogUrl, urlRecord);
            } catch(err) {
              console.error(err);
            }
            console.log('realHrefs: ', realHrefs);
            c.queue(realHrefs);
          }
        }
      }
      done();
    }
  });

  c.on('drain', async () => {
    if (clearUp) {
      try {
        await clear(urlRecords);
      } catch(err) {
        console.error(err);
      }
    }
    console.log('done');
  });

  c.queue(urls);
};

function clear(records) {
  let ids = records.map(item => item._id);
  return Api.updateRecords('urls', ids, { $set: { hrefs: [] } });
}

async function filterHrefs(hrefs, uri, blogUrl, urlRecord) {
  let arr = hrefs.map(h => {
    if (h.startsWith('//')) {
      h += uri.protocol;
    } else if (h.startsWith('/')) {
      h = url.resolve(blogUrl, h);
    } else if (h.startsWith('.')){
      h = url.resolve(uri.href, h);
    }

    if (!h.startsWith(blogUrl)) {
      return;
    }

    let pHref = url.parse(h);
    if (pHref.path &&
      pHref.path.startsWith('/')) {

      let pPath = pathParse(pHref.path);
      // 过滤掉除html以外的链接
      if (!pPath.ext || pPath.ext === '.html') {
        return h;
      }
    }
  }).filter(item => item);

  let hrefsList = urlRecord.hrefs;
  let tmpArr = arr.filter(item => hrefsList.indexOf(item) === -1);
  await Api.updateRecords('urls', urlRecord._id, { $addToSet: { hrefs: { $each: tmpArr } } });

  return tmpArr;
}

function analy(urlRecord, href, html, rules) {
  let r = new RegExp(rules, 'igm');
  let arr = [];
  if (r.test(html)) {
    let idx = (r.lastIndex - 25) < 0 ? 0 : r.lastIndex - 25;
    arr.push({href, text: html.substr(idx, 50)});
  }

  return arr;
}

function sendEmail(analyRes) {
  let msg = analyRes.map(item => {
    return `url: ${itme.href}, text: ${item.text}`;
  }).join('<br />');

  customEmail(msg);
}

// flush send email
setInterval(() => {
  if (analyResArr.length) {
    sendEmail(analyResArr);
    analyResArr = [];
  }
}, 5000);
