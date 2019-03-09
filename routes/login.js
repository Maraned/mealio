var express = require('express');
var router = express.Router();

const jwtUtils = require('../utils/jwt');

router.post('/', (req, res, next) => {
  console.log('got login')
  const { username, password } = req.body;

  const accessToken = jwtUtils.createAccessToken(username);
  const currentUserValue = 1;
  const refreshToken = jwtUtils.createRefreshToken(username, currentUserValue);

  res.json({
    accessToken, 
    currentUserValue, 
    refreshToken
  })
})

module.exports = router;
