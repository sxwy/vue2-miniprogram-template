import { Module } from 'vuex'
import { UserState, StoreState } from '../type'
import {
  checkWxPersonalSession,
  getUserInfo,
  refreshToken as refreshTokenService,
  pfLoginByWxPersonal as pfLoginByWxPersonalService,
  sxwyLoginByWxPersonal as sxwyLoginByWxPersonalService,
  sxwyLoginByWxPhoneAuth as sxwyLoginByWxPhoneAuthService
} from '@/services'
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
let lastSxwyLoginPromise: Promise<SxwySession | null> | null = null
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
              await dispatch('userInit')
              resolve(state)
            } else {
              commit(CLEAR_STATE)
              await dispatch('sxwyLoginByWxPersonal')
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
          const pfSession = await pfLoginByWxPersonalService()
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

    /** 登录（获取会话）（个人微信 unionId 版） */
    sxwyLoginByWxPersonal({ state, commit, dispatch }) {
      if (lastSxwyLoginPromise) {
        return lastSxwyLoginPromise
      }
      lastSxwyLoginPromise = (async () => {
        try {
          await dispatch('pfLoginByWxPersonal')
          const sxwySession = await sxwyLoginByWxPersonalService({
            openId: state.pfSession!.openId || '',
            unionId: state.pfSession!.unionId || ''
          })
          // 未绑定返回 null
          if (!sxwySession) {
            commit(SET_SXWY_SESSION, null)
            return null
          }
          commit(SET_SXWY_SESSION, sxwySession)
          await dispatch('userInit')
          return sxwySession
        } catch (error) {
          commit(SET_SXWY_SESSION, null)
          throw error
        } finally {
          lastSxwyLoginPromise = null
        }
      })()
      return lastSxwyLoginPromise
    },

    /** 登录（获取会话）（微信手机号授权版） */
    sxwyLoginByWxPhoneAuth(
      { commit, dispatch },
      payload: {
        iv: string
        encryptedData: string
      }
    ) {
      if (lastSxwyLoginPromise) {
        return lastSxwyLoginPromise
      }
      lastSxwyLoginPromise = (async () => {
        try {
          await dispatch('pfLoginByWxPersonal')
          const sxwySession = await sxwyLoginByWxPhoneAuthService({
            iv: payload.iv,
            encryptedData: payload.encryptedData
          })
          commit(SET_SXWY_SESSION, sxwySession)
          await dispatch('userInit')
          return sxwySession
        } catch (error) {
          commit(SET_SXWY_SESSION, null)
          throw error
        } finally {
          lastSxwyLoginPromise = null
        }
      })()
      return lastSxwyLoginPromise
    },

    /** 用户信息初始化 */
    userInit({ commit }) {
      if (lastUserInitPromise) {
        return lastUserInitPromise
      }
      lastUserInitPromise = (async () => {
        try {
          const userInfo = await getUserInfo()
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
      const result = await refreshTokenService()
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
        // @ts-ignore
        uni[payload.action]({ url: payload.url })
      }
    }
  }
}
