/* eslint-disable @typescript-eslint/no-var-requires */

const MockJs = require('mockjs')

module.exports = {
  /**
   * 获取配置信息
   * @see http://api.ztjy.cn:5000/project/178/interface/api/114157
   */
  'GET /base/feServer/enroll/intro/v1.0': (req, res) => {
    const data = MockJs.mock({
      code: '10000',
      message: 'success',
      body: {
        schoolName: '@ctitle',
        gradeName: '@ctitle',
        enrollStartTime: '@datetime',
        enrollEndTime: '@datetime',
        enrollAdvert: '@cparagraph',
        birthLimitStart: '@datetime',
        birthLimitEnd: '@datetime',
        planEnrollNum: 200,
        enrolledNum: 100,
        remainNum: 100,
        title: '户口本,出生证明,房产证,预防接种本'
      }
    })
    return res.json(data)
  }
}
