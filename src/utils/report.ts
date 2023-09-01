import store from '@/store'
import { BASE_API } from '@/constants'

export interface ReportData {
  /** 应用平台编码 */
  platf?: number
  /** 平台类型 1-app 2-小程序 3-h5 */
  plat_type?: number
  /** 设备型号 */
  mtype?: string
  /** 设备id */
  dev_id?: string
  /** 操作系统 1-android 2-ios */
  os?: string
  /** 系统版本 */
  os_ver?: string
  /** app渠道 */
  app_gid?: string
  /** app版本 */
  app_ver?: string
  /** 屏幕宽度 */
  screenWidth?: number
  /** 屏幕高度 */
  screenHeight?: number
  /** 设备品牌 */
  brand?: string
  /** 微信版本号 */
  version?: string
  /** 微信小程序版本 */
  mini_app_version?: string
  /** 微信环境 1-个微 2-企微 */
  mini_app_type?: string
  /** 登录状态 1-已登录 0-未登录 */
  login_status?: number | string
  /** 帐号角色 1-家长 2-老师 3-公众号 */
  role?: number | string
  /** openid */
  open_id?: string
  /** 帐号id */
  user_id?: string
  /** 宝宝id */
  baby_id?: string
  /** 学生id */
  student_id?: string
  /** 学校id */
  school_id?: string
  /** unionid */
  unionid?: string
  /** openid */
  openid?: string
  /** corpid */
  corpid?: string
  /** wxUserId */
  wxUserId?: string
  /** 手机号 */
  telephone?: string
  /** 家长关系 */
  relation_name?: string
  /** 启动来源信息 */
  referrerInfo?: string
  /** 付费状态 0-未付费 1-已付费 */
  pay_state?: number | string
  /** 日志时间 */
  logtime?: string
  /** 网络状态 0-无网络 1-wifi 2-蜂窝网络 */
  net?: number | string
  /** 经纬度坐标 */
  coordinate?: string
  /** ip地址 */
  ip?: string
  /** 国家 */
  country?: string
  /** 省份 */
  province?: string
  /** 城市 */
  city?: string
  /** 区县 */
  county?: string
  /** mac地址 */
  mac?: string
  /** imei */
  imei?: string
  /** androidid */
  adid?: string
  /** 区域编码 */
  adcode?: string
  /** 客户端公网ip */
  client_ip?: string
  /** 服务器接收时间 */
  receive_time?: string
  /** 数值型用户id */
  userid_origin?: string
  /** ab分组(abExps 实验信息,gIsols 全局隔离域,bIsols 业务隔离域) */
  ab_info?: string
  /** 长session_id */
  long_launch_id?: string
  /** 短session_id */
  short_launch_id?: string
  /** 自定义参数 */
  parm?: any
}

export interface ReportCommonData extends ReportData {
  /**  来路页面 */
  f_page?: string
  /**  来路页面id */
  f_page_id?: string
  /**  来路页面位置 */
  f_page_location?: string
  /**  last_source */
  last_source?: string
}

export interface ReportPvData extends ReportCommonData {
  /** 页面大类 1-一级列表页 2-二级列表页 3-内容页 4-其他 */
  page_category?: string
  /** 页面 */
  page?: string
  /** 页面id */
  page_id?: string
  /** 状态 0-退出 1-进入 2-成功 */
  status?: number | string
  /** 试看 0-非试看 1-试看 */
  trial?: number | string
  /** 时长 */
  stay_time?: number | string
  /** 浏览进度 */
  progress?: number | string
  /** 来源事件 */
  f_event_id?: string
}

export interface ReportEvData extends ReportCommonData {
  /** 事件id */
  event_id?: string
  /** 事件对象类型 */
  obj_type?: string
  /** 事件对象id */
  obj_id?: string
}

export interface ReportErrorData extends ReportCommonData {
  EventID?: string
  msg?: string
  msgLocation?: string
}

export interface ReportStartupData extends ReportData {
  /** 0-退出 1-启动 2-热启动 */
  status?: number | string
  /** 时长 */
  stay_time?: number | string
  /** 启动方式 1-点击桌面图标 2-点击推送 3-外部app调起 4-h5调起 */
  active_from?: number | string
  /** 调起来源 */
  call_from?: string
}

export type GetReportData = () => ReportData

export interface ReportCallback {
  (type: 'success' | 'fail'): void
}

export const STORE_NAME: {
  [key: string]: string
} = {
  ev: 'sdo_bfn_event',
  pv: 'sdo_bfn_pv',
  vv: 'sdo_bfn_vv',
  error: 'error',
  startup: 'sdo_bfn_startup'
}

export const getRequestUrl = (storeName: string) => {
  return `${BASE_API}/${storeName}/track?APIVersion=0.6.0`
}

export const request = (payload: {
  storeName: string
  data: ReportPvData | ReportEvData | ReportErrorData | ReportStartupData
  callback?: ReportCallback
}) => {
  uni.request({
    method: 'GET',
    url: getRequestUrl(payload.storeName),
    data: payload.data,
    success() {
      payload?.callback?.('success')
    },
    fail() {
      payload?.callback?.('fail')
    }
  })
}

export const createReport = (getReport: GetReportData) => {
  return {
    pv(data: ReportPvData, callback?: ReportCallback) {
      const reportData = getReport()
      const commonData = {
        page: '',
        page_category: '',
        page_id: '',
        parm: '',
        status: 1
      }
      request({
        storeName: STORE_NAME.pv,
        data: Object.assign({}, commonData, reportData, data),
        callback
      })
    },
    ev(data: ReportEvData, callback?: ReportCallback) {
      const reportData = getReport()
      const commonData = {
        event_id: '',
        parm: '',
        f_page: '',
        f_page_id: '',
        f_page_location: ''
      }
      request({
        storeName: STORE_NAME.ev,
        data: Object.assign({}, commonData, reportData, data),
        callback
      })
    },
    vv(data: ReportCommonData, callback?: ReportCallback) {
      const reportData = getReport()
      request({
        storeName: STORE_NAME.vv,
        data: Object.assign({}, reportData, data),
        callback
      })
    },
    error(data: ReportErrorData, callback?: ReportCallback) {
      const reportData = getReport()
      const commonData = {
        EventID: '',
        msg: '',
        msgLocation: ''
      }
      request({
        storeName: STORE_NAME.error,
        data: Object.assign({}, commonData, reportData, data),
        callback
      })
    },
    startup(data: ReportStartupData, callback?: ReportCallback) {
      const reportData = getReport()
      const commonData = {
        status: 0,
        stay_time: 0,
        parm: ''
      }
      request({
        storeName: STORE_NAME.startup,
        data: Object.assign({}, commonData, reportData, data),
        callback
      })
    }
  }
}

const systemInfo = uni.getSystemInfoSync()
// @ts-ignore
const isQyEnvironment = systemInfo.environment === 'wxwork'
let wxworkVersion = '' // 企微客户端版本

const getUid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const getOs = () => {
  const systemInfo = uni.getSystemInfoSync()
  let os = '0'
  if (systemInfo.system.includes('Android')) {
    os = '1'
  } else if (systemInfo.system.includes('iOS')) {
    os = '2'
  } else if (systemInfo.system.includes('Windows')) {
    os = '3'
  } else if (systemInfo.system.includes('macOS')) {
    os = '4'
  }
  return os
}

const getNetworkType = () => {
  uni.getNetworkType({
    success(result: UniApp.GetNetworkTypeSuccess) {
      const typeMap: { [key: string]: string } = {
        unknown: '0',
        none: '0',
        wifi: '1',
        '2g': '2',
        '3g': '2',
        '4g': '2',
        '5g': '2'
      }
      networkType = typeMap[result.networkType]
    }
  })
}

const longLaunchId = getUid()
let shortLaunchId = getUid()
let networkType = ''
let launchOptions = uni.getLaunchOptionsSync()

getNetworkType()

uni.onAppShow((options) => {
  launchOptions = options
  shortLaunchId = getUid()
  getNetworkType()
})

if (isQyEnvironment) {
  // @ts-ignore
  wx.qy.getSystemInfo({
    success(result: { version: string }) {
      wxworkVersion = result.version
    }
  })
}

export const getReportData = () => {
  const user = store.state.user
  const accountInfo = uni.getAccountInfoSync()
  const payState = user.current?.studentInfo?.parentList?.find(
    (item) => item.parentId === user.current?.userInfo?.userId
  )?.parentStatus

  const relation = user.current?.familyList?.find(
    (item) => item.parentId === user.current?.userInfo?.userId
  )?.relation

  return {
    platf: 31,
    plat_type: 2,
    screenWidth: systemInfo.screenWidth,
    screenHeight: systemInfo.screenHeight,
    brand: systemInfo.brand,
    version: systemInfo.version,
    sdkVersion: systemInfo.SDKVersion,
    wxworkVersion,
    mtype: systemInfo.model,
    dev_id: systemInfo.deviceId,
    os: getOs(),
    os_ver: systemInfo.system,
    // @ts-ignore
    mini_app_type: isQyEnvironment ? '2' : '1',
    mini_app_version: accountInfo.miniProgram.version,
    unionid: user.pfSession?.unionId || '',
    openid: user.pfSession?.openId || '',
    corpid: user.pfSession?.corpId || '',
    wxUserId: user.pfSession?.userId || '',
    login_status: user.sxwySession ? '1' : '0',
    role: user.sxwySession?.userType || '',
    telephone: user.current?.userInfo?.phone || '',
    user_id: user.sxwySession?.userId || '',
    baby_id: user.current?.babyInfo?.childId || '',
    student_id: user.current?.studentInfo?.studentId || '',
    school_id:
      user.current?.studentInfo?.schoolInfo?.schoolId ||
      user.current?.schoolInfo?.schoolId ||
      '',
    ab_info: user.current?.expInfo ? JSON.stringify(user.current?.expInfo) : '',
    pay_state: payState === 0 ? '1' : '0',
    relation_name: relation || '',
    active_from: launchOptions.scene || '',
    call_from: JSON.stringify({
      path: launchOptions.path,
      query: launchOptions.query
    }),
    referrerInfo: JSON.stringify({
      appId: launchOptions.referrerInfo?.appId || ''
    }),
    logtime: (uni as any).$u.timeFormat(Date.now(), 'yyyy-mm-dd hh:MM:ss'),
    net: networkType,
    long_launch_id: longLaunchId,
    short_launch_id: shortLaunchId,
    ip: '',
    coordinate: '',
    adcode: '',
    country: '',
    province: '',
    city: '',
    county: ''
  }
}

export const report = createReport(getReportData)
