import { baseApi } from '@/api'
import { PfSession, SxwySession, User } from '@/types'

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

/**
 * 平台登录（获取平台会话）（个人微信版）
 */
export const pfLoginByWxPersonal = () => {
  return baseApi.request<PfSession>({
    method: 'POST',
    url: '/api/pfLoginByWxPersonal/v1.0'
  })
}

/**
 * 登录（获取会话）（个人微信 unionId 版）
 */
export const sxwyLoginByWxPersonal = (data: {
  openId: string
  unionId: string
}) => {
  return baseApi.request<SxwySession>({
    method: 'POST',
    url: '/api/sxwyLoginByWxPersonal/v1.0',
    data
  })
}

/**
 * 登录（获取会话）（微信手机号授权版）
 */
export const sxwyLoginByWxPhoneAuth = (data: {
  iv: string
  encryptedData: string
}) => {
  return baseApi.request<SxwySession>({
    method: 'POST',
    url: '/api/sxwyLoginByWxPhoneAuth/v1.0',
    data
  })
}

/**
 * 刷新 token
 */
export const refreshToken = () => {
  return baseApi.request<SxwySession>({
    method: 'POST',
    url: '/api/refreshToken/v1.0'
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return baseApi.request<User>({
    method: 'POST',
    url: '/api/getUserInfo/v1.0'
  })
}
