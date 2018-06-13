module.exports = {
  fees: {
    percent: 10 / 10000,   // 手续费百分比
    send: 1 * 100000000,  // 转账矿工费用基数
    vote: 1 * 100000000,  // 投票费用
    delegate: 10000 * 100000000,  // 注册委托账号
    secondsignature: 1 * 100000000, // 设置二级密码
    multisignature: 1 * 100000000,
    dapp: 100 * 100000000,   // 发布dapp
    lock: 1 * 100000000,   // 锁仓
    issuer: 1000 * 100000000,  // 注册发行商
    issue: 100 * 100000000,  // 发行资产
    flag: 100 * 100000000, // // 注销
    acl: 1 * 100000000, // 创建 ACL
    asset: 100 * 100000000 // 创建资产
  },
  coin: 100000000,
  address: {
    prefix: 'A'
  }
}
