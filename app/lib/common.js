const crypto = require('crypto');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
    getHashedPassword: (password) => {
        return bcrypt.hashSync(password);
    },
    createToken: (object, expiresIn) => {
        let options = {};
        if (expiresIn) options.expiresIn = expiresIn;
        return jwt.sign(object, global.kraken.get('app:jwtSecret'), options);
    },
    async decodeAPiToken(token) {
        return await jwt.verify(token, global.kraken.get('app:jwtSecret'))
    }
}