// BASIC AUTH
function authentication (req, res, next) {
  const authheader = req.headers.authorization

  if (!authheader) {
    const err = new Error('You are not authenticated!')
    res.setHeader('WWW-Authenticate', 'Basic')
    err.status = 401
    return next(err)
  }

  const auth = new Buffer.from(authheader.split(' ')[1], 'base64')
    .toString()
    .split(':')
  const user = auth[0]
  const pass = auth[1]

  const username = process.env.USERNAME || 'admin'
  const password = process.env.PASSWORD || 'password'

  if (user === username && pass === password) {
    // If Authorized user
    next()
  } else {
    const err = new Error('You are not authenticated!')
    res.setHeader('WWW-Authenticate', 'Basic')
    err.status = 401
    return next(err)
  }
}

module.exports = { authentication }
