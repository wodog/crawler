const Api = require('../lib/api')

exports.handler = function(event, context, callback) {
  callback('ok1')
  setTimeout(function() {
    const stats = Api.createRecord('stats', {
      url: '20',
      finished: false
    })
  }, 20 * 1000)
  setTimeout(function() {
    const stats = Api.createRecord('stats', {
      url: '50',
      finished: false
    })
  }, 50 * 1000)
  setTimeout(function() {
    const stats = Api.createRecord('stats', {
      url: '100',
      finished: false
    })
  }, 100 * 1000)
  setTimeout(function() {
    const stats = Api.createRecord('stats', {
      url: '200',
      finished: false
    })
  }, 200 * 1000)
}
