const Api = require('../lib/api')

exports.handler = function(event, context, callback) {
  const stats = Api.createRecord('stats', {
    url: '10',
    finished: false
  })
  console.log(1)
  callback('im test ok')
  // setTimeout(function() {
  //   const stats = Api.createRecord('stats', {
  //     url: '10',
  //     finished: false
  //   })
  // }, 10 * 1000)
  // setTimeout(function() {
  //   const stats = Api.createRecord('stats', {
  //     url: '20',
  //     finished: false
  //   })
  // }, 20 * 1000)
  // setTimeout(function() {
  //   const stats = Api.createRecord('stats', {
  //     url: '50',
  //     finished: false
  //   })
  // }, 50 * 1000)
  // setTimeout(function() {
  //   const stats = Api.createRecord('stats', {
  //     url: '100',
  //     finished: false
  //   })
  // }, 100 * 1000)
  // setTimeout(function() {
  //   const stats = Api.createRecord('stats', {
  //     url: '150',
  //     finished: false
  //   })
  // }, 150 * 1000)
  // setTimeout(function() {
  //   const stats = Api.createRecord('stats', {
  //     url: '200',
  //     finished: false
  //   })
  // }, 200 * 1000)
  // setTimeout(function() {
  //   const stats = Api.createRecord('stats', {
  //     url: '250',
  //     finished: false
  //   })
  // }, 250 * 1000)
  // setTimeout(function() {
  //   const stats = Api.createRecord('stats', {
  //     url: '300',
  //     finished: false
  //   })
  // }, 300 * 1000)
  // setTimeout(function() {
  //   const stats = Api.createRecord('stats', {
  //     url: '350',
  //     finished: false
  //   })
  // }, 350 * 1000)
}
