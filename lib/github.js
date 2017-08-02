'use strict'

const GitHubApi = require("github");

const github = new GitHubApi({
  // optional
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

console.log('envv:', process.env.TOKEN)

// basic
github.authenticate({
  type: 'token',
  token: '1de6a3a52e3336a636f0b0d8f013af5d1544b175'
});


module.exports = github
