'use strict'

const GitHubApi = require("github");
const config = require('../config');

const github = new GitHubApi({
  // optional
  // debug: true,
  protocol: "https",
  host: "api.github.com", // should be api.github.com for GitHub
  pathPrefix: null, // for some GHEs; none for GitHub
  headers: {
    "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
  },
  // Promise: require('bluebird'),
  followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
  timeout: 5000
});

// basic
github.authenticate({
  type: 'token',
  token: config.github.TOKEN
});

module.exports = github
