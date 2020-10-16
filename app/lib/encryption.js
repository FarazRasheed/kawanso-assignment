// Here's the required crypto code
const crypto = require('crypto');
algorithm = 'aes-256-cbc',
exports.encrypt = function (text) {
    if(text != undefined){
        let cipher = crypto.createCipher(algorithm, global.kraken.get('app:jwtSecret'))
        let crypted = cipher.update(text.toString(), 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    }
    return undefined

}
exports.decrypt = function (text) {
    if (text === null || typeof text === 'undefined') { return text; };
    let decipher = crypto.createDecipher(algorithm, global.kraken.get('app:jwtSecret'))
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
