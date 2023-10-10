/**
 * 判断是否是手机号拒绝授权错误
 * @param detail 错误信息
 * @returns 返回是或否
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/usability/PublicErrno.html 官方文档
 */
export const isRefusalOfAuthorization = (detail: {
  errMsg: string
  errno?: number
}) => {
  return detail.errMsg.includes('user deny') || detail.errno === 103
}

/**
 * 判断是否是获取手机号次数上限错误
 * @param detail 错误信息
 * @returns 返回是或否
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/usability/PublicErrno.html 官方文档
 */
export const isUpperFrequencyLimit = (detail: {
  errMsg: string
  errno?: number
}) => {
  return detail.errMsg.includes('no enough quota') || detail.errno === 1400001
}

/**
 * 判断是否是隐私协议不同意错误
 * @param detail 错误信息
 * @returns 返回是或否
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/usability/PublicErrno.html 官方文档
 */
export const isPrivacyAgreementDisagrees = (detail: {
  errMsg: string
  errno?: number
}) => {
  return (
    detail.errMsg.includes('privacy permission is not authorized') ||
    detail.errno === 104 ||
    detail.errno === 101102
  )
}
