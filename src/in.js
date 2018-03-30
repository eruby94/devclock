import series from 'async/series'
import { checkForUser, extractUser, adjustTimesheet } from './util'

export default () => {
  series(
    {
      checkForUser,
      user: extractUser,
    },
    (err, results) => {
      if (err) throw err
      adjustTimesheet(results.user, true)
    },
  )
}
