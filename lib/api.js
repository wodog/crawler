'use strict'

const fetch = require('node-fetch')
const appId = '59801efa5e40d834463483fe'

const Api = {
  queryRecords(tableName, query) {
    let baseUrl = `https://baas.ele.me/tables/${tableName}?appId=${appId}`;
    if (query) {
      baseUrl = `${baseUrl}&query=${encodeURIComponent(JSON.stringify(query))}`
    }
    return fetch(baseUrl).then(res => res.json())
  },
  queryRecord (tableName, _id) {
    return fetch(`https://baas.ele.me/tables/${tableNAme}/${_id}/?appId=${appId}`).then(res => res.json())
  },
  createRecord (tableName, data) {
    const body = {
      body: data
    }
    return fetch(`https://baas.ele.me/tables/${tableName}?appId=${appId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  },
  createRecords (tableName, data) {
    const body = {
      body: data
    }
    return fetch(`https://baas.ele.me/tables/${tableName}?appId=${appId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  },
  updateRecord(tableName, id, data) {
    const body = {
      body: data
    };

    return fetch(`https://baas.ele.me/tables/${tableName}/${id}?appId=${appId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }
}

module.exports = Api
