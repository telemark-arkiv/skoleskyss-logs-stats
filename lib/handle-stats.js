'use strict'

const config = require('../config')
const mongojs = require('mongojs')
const db = mongojs(config.DB)
const logs = db.collection('logs')
const logger = require('./logger')

module.exports = query => {
  return new Promise((resolve, reject) => {
    if (query.action === 'total') {
      logger('info', ['handle-stats', 'action', 'total'])
      logs.count({}, (error, count) => {
        if (error) {
          logger('error', ['handle-stats', 'action', 'total', error])
          reject(error)
        } else {
          logger('info', ['handle-stats', 'action', 'total', 'success', count])
          resolve({total: count})
        }
      })
    } else if (query.action === 'schools') {
      logger('info', ['handle-stats', 'action', 'schools'])
      logs.aggregate({'$group': {'_id': '$skoleData.name', 'total': {'$sum': 1}}})
        .sort({'total': -1}, (error, data) => {
          if (error) {
            logger('error', ['handle-stats', 'action', 'schools', error])
            reject(error)
          } else {
            logger('info', ['handle-stats', 'action', 'schools', 'success'])
            resolve(data)
          }
        })
    } else if (query.action === 'categories') {
      logger('info', ['handle-stats', 'action', 'categories'])
      logs.aggregate({'$group': {'_id': '$grunnlag.grunnlag', 'total': {'$sum': 1}}})
        .sort({'total': -1}, (error, data) => {
          if (error) {
            logger('error', ['handle-stats', 'action', 'categories', error])
            reject(error)
          } else {
            logger('info', ['handle-stats', 'action', 'categories', 'success'])
            resolve(data)
          }
        })
    } else if (query.action === 'bosted') {
      logger('info', ['handle-stats', 'action', 'bosted'])
      logs.aggregate({'$group': {'_id': '$bosted.bosted', 'total': {'$sum': 1}}})
        .sort({'total': -1}, (error, data) => {
          if (error) {
            logger('error', ['handle-stats', 'action', 'bosted', error])
            reject(error)
          } else {
            logger('info', ['handle-stats', 'action', 'bosted', 'success'])
            resolve(data)
          }
        })
    } else if (query.action === 'duplicates') {
      logs.count({duplikatSoknad: true}, (error, count) => {
        if (error) {
          logger('error', ['handle-stats', 'action', 'duplicates', error])
          reject(error)
        } else {
          logger('info', ['handle-stats', 'action', 'duplicates', 'success', count])
          resolve({duplicates: count})
        }
      })
    } else if (query.action === 'multiples') {
      logs.count({tidligereSoknad: true}, (error, count) => {
        if (error) {
          logger('error', ['handle-stats', 'action', 'multiples', error])
          reject(error)
        } else {
          logger('info', ['handle-stats', 'action', 'multiples', 'success', count])
          resolve({multiples: count})
        }
      })
    } else if (query.action === 'uniques') {
      logs.count({duplikatSoknad: false}, (error, count) => {
        if (error) {
          logger('error', ['handle-stats', 'action', 'uniques', error])
          reject(error)
        } else {
          logger('info', ['handle-stats', 'action', 'uniques', 'success', count])
          resolve({uniques: count})
        }
      })
    } else if (query.action === 'queue') {
      logger('info', ['handle-stats', 'action', 'queue'])
      logs.count({isQueued: true}, (error, count) => {
        if (error) {
          logger('error', ['handle-stats', 'action', 'queue', error])
          reject(error)
        } else {
          logger('info', ['handle-stats', 'action', 'queue', 'success', 'found', count])
          resolve({queue: count})
        }
      })
    } else if (query.action === 'status') {
      logger('info', ['handle-stats', 'action', 'status'])
      logs.aggregate([{'$unwind': '$documentStatus'}, {'$group': {'_id': '$documentStatus.status', 'total': {'$sum': 1}}}])
        .sort({'total': -1}, (error, data) => {
          if (error) {
            logger('error', ['handle-stats', 'action', 'status', error])
            reject(error)
          } else {
            logger('info', ['handle-stats', 'action', 'status', 'success'])
            resolve(data)
          }
        })
    } else {
      logger('warn', ['handle-stats', 'action', 'unknown action', query.action])
      resolve(query)
    }
  })
}
