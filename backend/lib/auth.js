const bcrypt = require('bcrypt');

module.exports.hashPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  if (!salt) {
    throw 'Salting failed';
  }

  const hash = await bcrypt.hash(password, salt);
  if (!hash) {
    throw 'Hashing failed';
  }

  return hash;
}

module.exports.authenticate = async (password, hash) => {
  const response = bcrypt.compare(password, hash);
  if (!response) {
    throw 'AUTHENTICATIONFAILED';
  }

  return response;
}