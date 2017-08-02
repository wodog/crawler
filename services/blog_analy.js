'use strict';

const Crawler = require("crawler");
const urlParse = require('url').parse;
const pathParse = require('path').parse;

module.exports = (event, ctx, callback) => {
  let { urls } = JSON.parse(event);

  let c = new Crawler({
    maxConnections: 10,
    callback: (error, res, done) => {
      if (error) {
        console.log(error);
      } else {
        handler(res);
      
        let hrefs = res.$('a').map((idx, item) => item.attribs.href).toArray()        
        if (hrefs.length) {
          c.queue(filterHrefs(hrefs, res.request.uri));
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

function filterHrefs(hrefs, url) {
  return hrefs.filter(h => {
    let pHref = urlParse(h);
    if (!pHref.hostname || pHref.hostname === url.hostname) {
      let pPath = pathParse(pHref.path);
      // 过滤掉除html以外的链接
      if (!pPath.ext || pPath.ext === 'html') {
        return true;
      }
    }
  }).map(h => {
    
  });
}

function handler(res) {

}
