'use strict';

const blogAnaly = require('../es5/blog_analy').handler;

let body = {
  urls: ['https://shijianan.com'],
  clearUp: true
};

let evt = new Buffer(JSON.stringify(body));

blogAnaly(evt, null, console.log);

// const pathParse = require('path').parse;
// const Url = require('url');

// let res = filterHrefs(['#', '/aa/bb', '/aa/c', 'sssd', 'baidu.com', 'https://shijianan.com/ccc/ddd'], Url.parse('https://shijianan.com/'));
// console.log(res);

// function filterHrefs(hrefs, url) {
//   return hrefs.map(h => {
//     if (!/^(https?:)?\/\/|^\//.test(h)) {
//       return;
//     }

//     if (h.startsWith('//')) {
//       h += url.protocol;
//     } else if (h.startsWith('/')) {
//       h = Url.resolve(url.href, h);
//     }

//     let pHref = Url.parse(h);
    
//     if ((!pHref.hostname || pHref.hostname === url.hostname) &&
//       pHref.path &&
//       pHref.path.startsWith('/')) {

//       let pPath = pathParse(pHref.path);
//       // 过滤掉除html以外的链接
//       if (!pPath.ext || pPath.ext === 'html') {
//         return h;
//       }
//     }
//   }).filter(item => item);
// }