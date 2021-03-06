var express = require('express');
var router = express.Router();

const jwtUtils = require('../utils/jwt');
const auth = require('../lib/auth');
var rdb = require('../lib/rethink');

router.post('/refresh', async (req, res, next) => {
  const { refreshToken, email } = req.body;
  if (!refreshToken || !email) {
    return res.sendStatus(400);
  }

  try {
    const accessToken = jwtUtils.createAccessTokenFromRefreshToken(refreshToken);
    const userResult = await rdb.findBy('users', 'email', email);
    const user = userResult[0];
    const { password, ...rest } = user;

    rdb.subscribeWithId('users', user.id, 'user');

    res.status = 200;
    res.send({ accessToken, user: rest });
  } catch (error) {
    res.sendStatus(401);
  }
})

router.post('/', async (req, res, next) => {
  const { credentials } = req.body;
  const buf = Buffer.from(credentials, 'base64').toString('ascii');

  const [email, password] = buf.split(':');
  const userResult = await rdb.findBy('users', 'email', email);
  const user = userResult[0];

  if (!user) {
    const userNotFoundError = new Error('NOUSER');
    userNotFoundError.status = 400;
    return next(userNotFoundError);
  }

  const { password: userPassword, ...rest } = user;

  const authenticated = await auth.authenticate(password, user.password);
  if (authenticated) {
    const accessToken = jwtUtils.createAccessToken(email);
    const currentUserValue = 1;
    const refreshToken = jwtUtils.createRefreshToken(email, currentUserValue);
    rdb.subscribeWithId('users', user.id, 'user');
    res.send({ user: rest, accessToken, refreshToken, currentUserValue })
  } else {
    res.status(401);
    res.send();
    // const authenticationFailedError = new Error('Authentication failed');
    // authenticationFailedError.status = 401;
    // return next(authenticationFailedError);
  }
});

module.exports = router;
