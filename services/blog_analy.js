'use strict';

const Crawler = require("crawler");
const url = require('url');
const pathParse = require('path').parse;
const Api = require('../lib/api');
const email = require('../lib/email')

module.exports = (event, ctx, callback) => {
  let { urls } = JSON.parse(event);

  let c = new Crawler({
    maxConnections: 10,
    callback: async (error, res, done) => {
      if (error) {
        console.log(error);
      } else {
        let uri = res.request.uri;
        let blogUrl = `${uri.protocol}//${uri.host}`;
        let urlRecord;
        try {
          urlRecord = (await Api.queryRecords('urls', { $limit: 1, blog: blogUrl }))[0];
        } catch(err) {
          console.log(err);
          done();
        }

        let $ = res.$;
        if (urlRecord) {
          analy(urlRecord, uri.href, $.html());
        
          let hrefs = $('a').map((idx, item) => item.attribs.href).toArray()        
          if (hrefs.length) {
            let realHrefs = await filterHrefs(hrefs, uri, blogUrl, urlRecord);
            console.log('realHrefs: ', realHrefs);
            c.queue(realHrefs);
          }
        }
      }
      done();
    }
  });

  c.on('drain', () => {
    console.log('done');
  });

  c.queue(urls);
};

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
  try {
    await Api.updateRecord('urls', urlRecord._id, { $addToSet: { hrefs: { $each: tmpArr } } });
  } catch(err) {
    console.log(err);
  }

  return tmpArr;
}

function analy(urlRecord, href, html) {
  if (html.includes('COFFEE_TOKEN')) {
    email(`泄露地址: ${href}`, 'yaokui.xiong@ele.me')
  }
}
