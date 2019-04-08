const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const fs = require('fs');

const rdb = require('../lib/rethink');
const auth = require('../lib/auth');
const jwt = require('../utils/jwt');

router.post('/create', async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await rdb.findBy('users', 'email', email);

  if (existingUser.length) {
    const userAlreadyExists = new Error('USERALREADYEXISTS');
    userAlreadyExists.status = 301;
    return next(userAlreadyExists);
  }

  let user;
  try {
    const hashedPassword = await auth.hashPassword(password);
    user = {
      email, 
      password: hashedPassword,
    };
  } catch (error) {
    res.status = 500;
    res.send({ error: 'COULDNOTCREATEUSER' })
  }

  const userInfo = { ...user, draftRecipes: [], publishedRecipes: [] };

  const result = await rdb.save('users', userInfo);
  if (!result.inserted) {
    const userNotCreated = new Error('User could not be created');
    userNotCreated.status = 500;
    return next(userNotCreated);
  }

  const createdUserId = result.generated_keys[0];
  const createdUser = await rdb.find('users', createdUserId);
  const { password: userPassword, ...rest } = createdUser;

  const accessToken = jwt.createAccessToken(email);
  const refreshToken = jwt.createRefreshToken(email, 1);

  res.status = 201;
  res.send({ accessToken, refreshToken, currentUserValue: 1, user: rest });
});

const updateAvatar = async userAvatar => {
  if (userAvatar && userAvatar.indexOf(';base64,') !== -1) {
    try {
      const uri = userAvatar.split(';base64,').pop();
      let imgBuffer =  Buffer.from(uri, 'base64');
      const folderPath = `images/${id}`;
      const imagePath = `${folderPath}/avatar.webp`;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      await sharp(imgBuffer)
        .resize(200, 200)
        .webp({ lossless: true })
        .toFile(imagePath);
      
      return avatar = `${id}/avatar.webp`; 

    } catch (error) {
      console.error('Sharp error: ', error);
    }
  }
}

router.post('/update', async (req, res, next) => {
  const { user } = req.body;
  const { id, avatar: userAvatar, ...rest } = user;

  const avatar = updateAvatar(userAvatar);
  if (avatar) {
    rest.avatar = avatar;
  }
  
  await rdb.edit('users', id, rest);
  res.sendStatus(200);
});

router.get('/:userid/draftRecipes', async (req, res, next) => {
  const { userid } = req.params;
  const result = await rdb.userRecipes('draftRecipes', userid);
  res.send(result);
});

router.get('/:userid/publishedRecipes', async (req, res, next) => {
  const { userid } = req.params;
  const result = await rdb.userRecipes('publishedRecipes', userid);
  res.send(result);
});

module.exports = router;
