const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;
const EXPIRATION = {
  ACCESSTOKEN: '15m',
  REFRESHTOKEN: '6d'
};

const createAccessToken = username => {
  const data = {
    username, 
  }

  return jwt.sign(data, SECRET, { expiresIn: EXPIRATION.ACCESSTOKEN });
}

const createRefreshToken = (username, currentUserValue) => {
  const data = {
    username,
    currentUserValue
  };

  return jwt.sign(data, SECRET, { expiresIn: EXPIRATION.REFRESHTOKEN });
}

const verifyRefreshToken = refreshToken => {
  return jwt.verify(refreshToken, SECRET);
}

const createAccessTokenFromRefreshToken = (refreshToken, currentUserValue) => {
  const storedData = verifyRefreshToken(refreshToken);

  if (!storedData.username) {
    throw new Error('JWT::createAccessTokenFromRefreshToken: No username');
  } else if (storedData.currentUserValue > currentUserValue) {
    throw new Error('JWT::createAccessTokenFromRefreshToken: Old refreshtoken');
  }

  return createAccessToken(storedData.username);
}

const createRefreshTokenFromRefreshToken = (refreshToken, currentUserValue) => {
  const storedData = verifyRefreshToken(refreshToken);
  const newCurrentUserValue = currentUserValue + 1;
  const newRefreshToken = createRefreshToken(storedData.username, newCurrentUserValue);
  return {
    currentUserValue: newCurrentUserValue, 
    refreshtoken: newRefreshToken
  }
}

module.exports = {
  createAccessToken,
  createRefreshToken
};
