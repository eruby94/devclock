import series from 'async/series'
import { checkForUser, extractUser, adjustTimesheet } from './util'

export default () => {
  const fnSeries = []
  fnSeries.push((cb) => {
    checkForUser(cb)
  })
  fnSeries.push((cb) => {
    extractUser(cb)
  })
  series(fnSeries, (err, results) => {
    if (err) throw err
    adjustTimesheet(results[results.length - 1], false)
  })
}
