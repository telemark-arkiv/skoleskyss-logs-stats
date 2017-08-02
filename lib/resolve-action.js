'use strict'

module.exports = data => {
  const list = data.pathname.split('/').filter(line => line !== '')
  let result = {
    domain: 'frontpage',
    method: data.method,
    action: ''
  }
  if (list.includes('stats')) {
    result.domain = 'stats'
    if (list.includes('total')) {
      result.action = 'total'
    } else if (list.includes('schools')) {
      result.action = 'schools'
    } else if (list.includes('categories')) {
      result.action = 'categories'
    } else if (list.includes('bosted')) {
      result.action = 'bosted'
    } else if (list.includes('duplicates')) {
      result.action = 'duplicates'
    } else if (list.includes('multiples')) {
      result.action = 'multiples'
    } else if (list.includes('uniques')) {
      result.action = 'uniques'
    } else if (list.includes('queue')) {
      result.action = 'queue'
    } else if (list.includes('status')) {
      result.action = 'status'
    }
  }

  return result
}
