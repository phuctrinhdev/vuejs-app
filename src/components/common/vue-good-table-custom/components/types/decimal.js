import _ from 'lodash'
import number from './number'

const decimal = _.cloneDeep(number)
decimal.format = function (v) {
  if (v === undefined || v === null) return ''
  return parseFloat(Math.round(v * 100) / 100).toFixed(2)
}

export default decimal
