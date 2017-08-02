'use strict';

const blogAnaly = require('../es5/blog_analy');

let body = {
  urls: ['https://smallpath.me']
};

let evt = new Buffer(JSON.stringify(body));

blogAnaly(evt, null, console.log);
