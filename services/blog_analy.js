'use strict';

const Crawler = require("crawler");
const Url = require('url');
const pathParse = require('path').parse;
const Api = require('../lib/api');

module.exports = (event, ctx, callback) => {
  let { urls } = JSON.parse(event);

  let c = new Crawler({
    maxConnections: 10,
    callback: async (error, res, done) => {
      if (error) {
        console.log(error);
      } else {
        handler(res);
      
        let hrefs = res.$('a').map((idx, item) => item.attribs.href).toArray()        
        if (hrefs.length) {
          let realHrefs = await filterHrefs(hrefs, res.request.uri);
          c.queue(realHrefs);
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

async function filterHrefs(hrefs, url) {
  if (!url ||
    !url.host ||
    !url.protocol ||
    !url.href) {
    return [];
  }

  let blogUrl = `${url.protocol}//${url.host}`;
  let arr = hrefs.map(h => {
    if (h.startsWith('//')) {
      h += url.protocol;
    } else if (h.startsWith('/')) {
      h = Url.resolve(blogUrl, h);
    } else if (h.startsWith('.')){
      h = Url.resolve(url.href, h);
    }

    if (!h.startsWith('http')) {
      return;
    }

    let pHref = Url.parse(h);
    
    if (pHref.host === url.host &&
      pHref.path &&
      pHref.path.startsWith('/')) {

      let pPath = pathParse(pHref.path);
      // 过滤掉除html以外的链接
      if (!pPath.ext || pPath.ext === '.html') {
        return h;
      }
    }
  }).filter(item => item);

  let [ urlRecord ] = await Api.queryRecords('urls', { $limit: 1, blog: blogUrl });
  let hrefsList = urlRecords && urlRecords.hrefs;
  let tmpArr = [];
  if (hrefsList && hrefsList.length) {
    tmpArr = arr.filter(item => !hrefsList.includes(item));
    await updateRecord('urls', urlRecord._id, { $addToSet: { hrefs: { $each: tmpArr } } });
  }

  return tmpArr;
}

function handler(res) {

}
