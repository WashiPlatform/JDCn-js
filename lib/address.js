var sha256 = require('fast-sha256');
var RIPEMD160 = require('ripemd160');
var base58check = require('./base58check');
var constants = require('./constants');

// const NORMAL_PREFIX = 'A'; // A

module.exports = {
  isAddress: function (address) {
    if (typeof address !== 'string') {
      return false
    }
    // ['A'].indexOf(address[0]) == -1
    if (address.indexOf(constants.address.prefix) !== 0) {
      return false
    }

    return base58check.decodeUnsafe(address.slice(constants.address.prefix.length));
  },

  isBase58CheckAddress: function (address) {
    if (typeof address !== 'string') {
      return false
    }

    if (address.indexOf(constants.address.prefix) != 0) { // ['A'].indexOf(address[0])
      return false
    }

    return base58check.decodeUnsafe(address.slice(constants.address.prefix.length))
  },

  generateBase58CheckAddress: function (publicKey) {
    if (typeof publicKey === 'string') {
      publicKey = Buffer.from(publicKey, 'hex')
    }

    var h1 = sha256.hash(publicKey);
    var h2 = new RIPEMD160().update(Buffer.from(h1)).digest();
    
    return constants.address.prefix + base58check.encode(h2)
  },
}