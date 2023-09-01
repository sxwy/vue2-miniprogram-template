/** 平台登录会话 */
export interface PfSession {
  /** uni.login 返回的 code */
  code?: string
}

/** 登录会话 */
export interface SxwySession {
  /** 平台鉴权token */
  token: string
  /** accessToken重刷时间，比access-token的有效期少一天,单位：s */
  ttl: number
}

/** 用户明细 */
export interface UserInfo {
  /** 用户姓名 */
  userName: string
  /** 用户 id */
  userId: string
}

/** 用户信息 */
export interface User {
  /** 用户信息 */
  userInfo?: UserInfo
}
