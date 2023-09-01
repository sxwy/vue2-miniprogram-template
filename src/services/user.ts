/**
 * 获取个人微信平台会话是否过期
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.checkSession.html
 */
export const checkWxPersonalSession = () => {
  return new Promise<boolean>((resolve) => {
    uni.checkSession({
      success() {
        resolve(false) // 未过期
      },
      fail() {
        resolve(true) // 已过期
      }
    })
  })
}
