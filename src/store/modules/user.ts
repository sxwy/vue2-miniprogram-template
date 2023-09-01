import { Module } from 'vuex'
import { UserState, StoreState } from '../type'
import { checkWxPersonalSession } from '@/services'
import { User, PfSession, SxwySession } from '@/types'

export const SET_PF_SESSION = 'SET_PF_SESSION'
export const SET_SXWY_SESSION = 'SET_SXWY_SESSION'
export const SET_USER_INFO = 'SET_USER_INFO'
export const CLEAR_STATE = 'CLEAR_STATE'

export const SXWY_SESSION = 'SXWY_SESSION'
export const PF_SESSION = 'PF_SESSION'

let lastLoginInitPromise: Promise<{
  pfSession: PfSession | null
  sxwySession: SxwySession | null
  current: User | null
}> | null = null
let lastPfLoginPromise: Promise<PfSession> | null = null
let lastZtLoginPromise: Promise<SxwySession | null> | null = null
let lastUserInitPromise: Promise<User | null> | null = null

export const user: Module<UserState, StoreState> = {
  namespaced: true,
  state: {
    pfSession: null,
    sxwySession: null,
    current: null
  },
  mutations: {
    [SET_PF_SESSION](state, pfSession: PfSession | null) {
      state.pfSession = pfSession
      uni.setStorageSync(PF_SESSION, JSON.stringify(pfSession))
    },
    [SET_SXWY_SESSION](state, sxwySession: SxwySession | null) {
      state.sxwySession = sxwySession
      uni.setStorageSync(SXWY_SESSION, JSON.stringify(sxwySession))
    },
    [SET_USER_INFO](state, user: User | null) {
      state.current = user
    },
    [CLEAR_STATE](state) {
      state.pfSession = null
      state.sxwySession = null
      state.current = null
      uni.setStorageSync(PF_SESSION, JSON.stringify(null))
      uni.setStorageSync(SXWY_SESSION, JSON.stringify(null))
    }
  },
  getters: {
    isPfLogined(state) {
      return !!state.pfSession
    },
    isSxwyLogined(state) {
      return !!state.sxwySession
    },
    isUserInited(state) {
      return !!state.current
    },
    pfSession(state) {
      return state.pfSession
    },
    sxwySession(state) {
      return state.sxwySession
    },
    current(state) {
      return state.current
    }
  },
  actions: {
    /** 登录初始化 */
    loginInit({ state, commit, dispatch }) {
      if (lastLoginInitPromise) {
        return lastLoginInitPromise
      }
      lastLoginInitPromise = new Promise<UserState>((resolve, reject) => {
        ;(async () => {
          try {
            const pfResult = uni.getStorageSync(PF_SESSION)
            const sxwyResult = uni.getStorageSync(SXWY_SESSION)
            const pfSession: PfSession = pfResult ? JSON.parse(pfResult) : null
            const sxwySession: SxwySession = sxwyResult
              ? JSON.parse(sxwyResult)
              : null
            const isExpires = await checkWxPersonalSession()
            if (
              !isExpires &&
              pfSession &&
              sxwySession &&
              Date.now() < sxwySession?.ttl * 1000
            ) {
              commit(SET_SXWY_SESSION, sxwySession)
              commit(SET_PF_SESSION, pfSession)
              await dispatch('userInit', {})
              resolve(state)
            } else {
              commit(CLEAR_STATE)
              // #ifdef MP-WEIXIN
              if (isQyEnvironment) {
                await dispatch('ztLoginByWxCorporate', payload)
                // 企微游客身份使用个微登录
                if (!state.sxwySession) {
                  await dispatch('ztLoginByWxPersonal', payload)
                }
              } else {
                await dispatch('ztLoginByWxPersonal', payload)
              }
              // #endif
              // #ifdef MP-DINGTALK
              await dispatch('ztLoginByDdPersonal', payload)
              // #endif
              resolve(state)
            }
          } catch (error) {
            commit(CLEAR_STATE)
            reject(error)
          } finally {
            lastLoginInitPromise = null
          }
        })()
      })
      return lastLoginInitPromise
    },

    /** 平台登录（获取平台会话）（个人微信版） */
    pfLoginByWxPersonal({ commit }) {
      if (lastPfLoginPromise) {
        return lastPfLoginPromise
      }
      lastPfLoginPromise = (async () => {
        try {
          const pfSession = await pfLoginByWxPersonalMode()
          commit(SET_PF_SESSION, pfSession)
          return pfSession
        } catch (error) {
          commit(SET_PF_SESSION, null)
          throw error
        } finally {
          lastPfLoginPromise = null
        }
      })()
      return lastPfLoginPromise
    },

    /** 掌通登录（获取掌通会话）（微信手机号授权版） */
    ztLoginByWxPhoneAuth(
      { state, commit, dispatch },
      payload: {
        iv: string
        encryptedData: string
        wxPhoneCode?: string
        childId?: string
        classId?: string
        studentId?: string
        verifyId?: string
        schoolId?: string
        isForcePhoneAuthLogin?: boolean
        mode?: 'auto' | 'parent' | 'teacher'
      }
    ) {
      if (lastZtLoginPromise) {
        return lastZtLoginPromise
      }
      lastZtLoginPromise = (async () => {
        try {
          await dispatch('pfLoginByWxPersonal')
          const sxwySession = await ztLoginByWxPhoneAuthMode({
            unionId: state.pfSession!.unionId || '',
            wxToken: state.pfSession!.token || '',
            iv: payload.iv,
            encryptedData: payload.encryptedData,
            wxPhoneCode: payload.wxPhoneCode,
            isForcePhoneAuthLogin: payload.isForcePhoneAuthLogin,
            mode: payload?.mode
          })
          const isQyEnvironment =
            // @ts-ignore
            uni.getSystemInfoSync().environment === 'wxwork' // 是否是企微环境
          // 企微环境下登录老师身份是游客返回 null
          if (isQyEnvironment && !sxwySession) {
            // 闭环接口：个微和企微都没有老师账号时调用
            await createQiWeiSchool({
              corpId: state.pfSession!.corpId || '',
              wxAppType: uniSDKConfig.appType
            })
            commit(SET_SXWY_SESSION, null)
            return null
          }
          commit(SET_SXWY_SESSION, sxwySession)
          await dispatch('userInit', {
            childId: payload?.childId,
            classId: payload?.classId,
            studentId: payload?.studentId,
            verifyId: payload?.verifyId,
            schoolId: payload?.schoolId
          })
          return sxwySession
        } catch (error) {
          commit(SET_SXWY_SESSION, null)
          throw error
        } finally {
          lastZtLoginPromise = null
        }
      })()
      return lastZtLoginPromise
    },

    /** 用户信息初始化 */
    userInit(
      { state, commit },
      payload?: {
        childId?: string
        classId?: string
        studentId?: string
        schoolId?: string
        verifyId?: string
      }
    ) {
      if (lastUserInitPromise) {
        return lastUserInitPromise
      }
      lastUserInitPromise = (async () => {
        try {
          const isQyEnvironment =
            // @ts-ignore
            uni.getSystemInfoSync().environment === 'wxwork' // 是否是企微环境
          // 如果是企微环境并且是老师并且没有指定 schoolId，则应该切换到当前企业对应的学校（一定是老师）
          if (
            isQyEnvironment &&
            state.sxwySession?.userType === 2 &&
            !payload?.schoolId
          ) {
            payload = {
              schoolId: state.pfSession?.schoolId
            }
          }
          const userInfo = await getUserInfo(payload)
          commit(SET_USER_INFO, userInfo)
          return userInfo
        } catch (error) {
          commit(SET_USER_INFO, null)
          throw error
        } finally {
          lastUserInitPromise = null
        }
      })()
      return lastUserInitPromise
    },

    /** 刷新 token */
    async refreshToken({ state, commit }) {
      const result = await refreshTokenService({
        Authorization: `Bearer ${state.sxwySession?.refreshToken}`
      })
      commit(SET_SXWY_SESSION, {
        ...state.sxwySession,
        ...result
      })
    },

    /** 退出登录 */
    async logout(
      { commit },
      payload?: {
        url: string
        action: 'switchTab' | 'reLaunch' | 'redirectTo' | 'navigateTo'
      }
    ) {
      commit(CLEAR_STATE)
      if (payload) {
        uni[payload.action]({ url: payload.url })
      }
    }
  }
}
