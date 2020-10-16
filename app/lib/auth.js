const common = require("./common");
const encryptDecrypt = require("./encryption");
const redis = require("redis");
const client = redis.createClient();

module.exports = function () {
  return async function (req, res, next) {
    if (!req.headers.authorization) {
      return res.http401('Authorization header missing');
    } else {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = await common.decodeAPiToken(encryptDecrypt.decrypt(token))
        let user;
        client.hgetall("user", function (err, user) {
          if (!user) {
            return res.http401('Invalid token');
          }
          if (decoded.email !== user.email || decoded.id !== user.id) return res.http401("Invalid token!");
          req.user = user;
          next();
        })
      } catch (error) {
        global.log.error(error);
        return res.http401('Invalid token');
      }
    }
  }
};
