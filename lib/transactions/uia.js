var ByteBuffer = require('bytebuffer')
var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")
var options = require('../options')

function getClientFixedTime() {
  return slots.getTime() - options.get('clientDriftSeconds')
}

function calculateFee(amount) {
  var min = constants.fees.send;
  var fee = Number(parseFloat((amount * constants.fees.percent).toFixed(0)));
  return fee < min ? min : fee;
}

function createTransaction(asset, fee, type, recipientId, message, secret, secondSecret) {
  var keys = crypto.getKeys(secret)

  var transaction = {
    type: type,
    amount: 0,
    fee: fee,
    recipientId: recipientId,
    senderPublicKey: keys.publicKey,
    timestamp: getClientFixedTime(),
    message: message,
    asset: asset
    // asset: {
    //  uiaTransfer: {
    //    currency: asset.uiaTransfer.currency,
    //    amount: String(asset.uiaTransfer.amount)
    //  }
    // }
  }

  crypto.sign(transaction, keys)

  if (secondSecret) {
    var secondKeys = crypto.getKeys(secondSecret)
    crypto.secondSign(transaction, secondKeys)
  }

  transaction.id = crypto.getId(transaction)

  return transaction
}

module.exports = {
  calculateFee: calculateFee,
  createIssuer: function (name, desc, secret, secondSecret) {
    var asset = {
      uiaIssuer: {
        name: name,
        desc: desc
      }
    }
    //var fee = (100 + (Math.floor(bytes.length / 200) + 1) * 0.1) * constants.coin
    // var fee = 100 * constants.coin
    var fee = constants.fees.issuer;
    return createTransaction(asset, fee, 9, '', '', secret, secondSecret)
  },

  createAsset: function (name, desc, maximum, precision, price, strategy, allowWriteoff, allowWhitelist, allowBlacklist, secret, secondSecret) {
    var asset = {
      uiaAsset: {
        name: name,
        desc: desc,
        maximum: maximum,
        precision: precision,
        issuePrice: price,
        price: price,
        strategy: strategy,
        allowBlacklist: allowBlacklist,
        allowWhitelist: allowWhitelist,
        allowWriteoff: allowWriteoff
      }
    }
    // var fee = (500 + (Math.floor(bytes.length / 200) + 1) * 0.1) * constants.coin
    // var fee = 500 * constants.coin
    var fee = constants.fees.asset;
    return createTransaction(asset, fee, 10, '', '', secret, secondSecret)
  },

  createFlags: function (currency, flagType, flag, secret, secondSecret) {
    var asset = {
      uiaFlags: {
        currency: currency,
        flagType: flagType,
        flag: flag
      }
    }
    // var fee = 0.1 * constants.coin
    var fee = constants.fees.flag;
    return createTransaction(asset, fee, 11, '', '', secret, secondSecret)
  },

  createAcl: function (currency, operator, flag, list, secret, secondSecret) {
    var asset = {
      uiaAcl: {
        currency: currency,
        operator: operator,
        flag: flag,
        list: list
      }
    }
    // var fee = 0.2 * constants.coin
    var fee = constants.fees.acl;
    return createTransaction(asset, fee, 12, '', '', secret, secondSecret)
  },

  createIssue: function (currency, amount, secret, secondSecret) {
    var asset = {
      uiaIssue: {
        currency: currency,
        amount: String(amount)
      }
    }
    // var fee = 0.1 * constants.coin
    var fee = constants.fees.issue;
    return createTransaction(asset, fee, 13, '', '', secret, secondSecret)
  },

  createTransfer: function (currency, amount, recipientId, message, secret, secondSecret) {
    var asset = {
      uiaTransfer: {
        currency: currency,
        amount: String(amount)
      }
    }
    // var fee = 0.1 * constants.coin
    var fee = calculateFee(amount);
    return createTransaction(asset, fee, 14, recipientId, message, secret, secondSecret)
  },
}